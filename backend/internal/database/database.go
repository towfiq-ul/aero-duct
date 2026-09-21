package database

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	_ "modernc.org/sqlite"
)

var (
	DB   *sql.DB
	once sync.Once
)

// Init opens and verifies the database connection, running migrations if necessary.
func Init(databaseURL string) (*sql.DB, error) {
	var err error
	once.Do(func() {
		driverName := "sqlite"
		dsn := databaseURL

		if dsn == "" {
			dsn = "file:./dev.db?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)"
		} else if strings.HasPrefix(dsn, "postgres://") || strings.HasPrefix(dsn, "postgresql://") {
			driverName = "pgx"
		} else if strings.HasPrefix(dsn, "file:") && !strings.Contains(dsn, "?") {
			dsn = dsn + "?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)"
		}

		log.Printf("[Database] Connecting using driver '%s'...", driverName)
		DB, err = sql.Open(driverName, dsn)
		if err != nil {
			return
		}

		DB.SetMaxOpenConns(25)
		DB.SetMaxIdleConns(10)
		DB.SetConnMaxLifetime(5 * time.Minute)

		if err = DB.Ping(); err != nil {
			return
		}

		log.Printf("[Database] Connection established successfully.")

		// Run embedded SQLite schema bootstrap if using SQLite
		if driverName == "sqlite" {
			if err = bootstrapSQLite(DB); err != nil {
				log.Printf("[Database] Bootstrap warning: %v", err)
				err = nil // Do not prevent startup if tables exist
			}
		}
	})

	return DB, err
}

func bootstrapSQLite(db *sql.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS customers (
		id TEXT PRIMARY KEY,
		email TEXT UNIQUE NOT NULL,
		first_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
		phone TEXT NOT NULL,
		market TEXT NOT NULL DEFAULT 'chicago',
		password_hash TEXT,
		role TEXT NOT NULL DEFAULT 'customer',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS addresses (
		id TEXT PRIMARY KEY,
		customer_id TEXT NOT NULL,
		line1 TEXT NOT NULL,
		line2 TEXT,
		city TEXT NOT NULL,
		state TEXT,
		postal_code TEXT NOT NULL,
		country TEXT NOT NULL,
		square_footage REAL,
		furnace_count INTEGER,
		vent_count INTEGER,
		FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS time_slots (
		id TEXT PRIMARY KEY,
		date DATE NOT NULL,
		start_time TEXT NOT NULL,
		end_time TEXT NOT NULL,
		available INTEGER NOT NULL DEFAULT 1,
		market TEXT NOT NULL DEFAULT 'chicago',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		UNIQUE(date, start_time, market)
	);

	CREATE TABLE IF NOT EXISTS technicians (
		id TEXT PRIMARY KEY,
		first_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
		phone TEXT UNIQUE NOT NULL,
		market TEXT NOT NULL DEFAULT 'chicago',
		status TEXT NOT NULL DEFAULT 'available',
		nadca_cert_id TEXT,
		badge_number TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS bookings (
		id TEXT PRIMARY KEY,
		reference_number TEXT UNIQUE NOT NULL,
		status TEXT NOT NULL DEFAULT 'confirmed',
		customer_id TEXT NOT NULL,
		address_id TEXT NOT NULL,
		time_slot_id TEXT,
		service_category TEXT NOT NULL,
		tier TEXT NOT NULL,
		total_price REAL NOT NULL,
		currency TEXT NOT NULL DEFAULT 'USD',
		technician_id TEXT,
		notes TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (customer_id) REFERENCES customers(id),
		FOREIGN KEY (address_id) REFERENCES addresses(id),
		FOREIGN KEY (time_slot_id) REFERENCES time_slots(id),
		FOREIGN KEY (technician_id) REFERENCES technicians(id)
	);

	CREATE TABLE IF NOT EXISTS duct_passports (
		id TEXT PRIMARY KEY,
		booking_id TEXT UNIQUE NOT NULL,
		reference_number TEXT NOT NULL,
		customer_name TEXT NOT NULL,
		service_address TEXT NOT NULL,
		inspection_date TEXT NOT NULL,
		technician_name TEXT NOT NULL,
		lead_tech_badge TEXT NOT NULL,
		nadca_cert_id TEXT NOT NULL,
		system_model TEXT NOT NULL,
		square_footage INTEGER NOT NULL,
		cfm_pre_clean INTEGER NOT NULL,
		cfm_post_clean INTEGER NOT NULL,
		particulate_reduction REAL NOT NULL,
		air_quality_rating TEXT NOT NULL,
		inspection_notes TEXT,
		passport_url TEXT UNIQUE NOT NULL,
		before_after_json TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (booking_id) REFERENCES bookings(id)
	);

	CREATE TABLE IF NOT EXISTS admin_settings (
		id TEXT PRIMARY KEY,
		contact_email TEXT NOT NULL,
		contact_phone TEXT NOT NULL,
		service_address TEXT NOT NULL,
		office_hours TEXT NOT NULL,
		google_places_api_key TEXT,
		google_place_id TEXT,
		google_reviews_min_rating REAL DEFAULT 4.5,
		stripe_publishable_key TEXT,
		stripe_secret_key TEXT,
		stripe_webhook_secret TEXT,
		stripe_enabled INTEGER DEFAULT 1,
		bank_name TEXT,
		bank_account_number TEXT,
		bank_routing_number TEXT,
		bank_wire_notes TEXT,
		bank_transfer_enabled INTEGER DEFAULT 1,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS service_areas (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		fee_multiplier REAL NOT NULL DEFAULT 1.0,
		active INTEGER NOT NULL DEFAULT 1
	);

	CREATE TABLE IF NOT EXISTS services (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		category TEXT NOT NULL,
		price TEXT NOT NULL,
		description TEXT NOT NULL,
		is_package INTEGER NOT NULL DEFAULT 0,
		active INTEGER NOT NULL DEFAULT 1
	);

	CREATE TABLE IF NOT EXISTS faqs (
		id TEXT PRIMARY KEY,
		question TEXT NOT NULL,
		answer TEXT NOT NULL,
		display_order INTEGER NOT NULL DEFAULT 0
	);
	`
	_, err := db.Exec(schema)
	if err != nil {
		return fmt.Errorf("failed executing bootstrap schema: %w", err)
	}

	seedInitialData(db)
	return nil
}

func seedInitialData(db *sql.DB) {
	// Seed demo technician if none exist
	var count int
	_ = db.QueryRow("SELECT COUNT(*) FROM technicians").Scan(&count)
	if count == 0 {
		_, _ = db.Exec(`
			INSERT INTO technicians (id, first_name, last_name, phone, market, status, nadca_cert_id, badge_number)
			VALUES ('tech-8891', 'Marcus', 'Sterling', '(312) 555-0144', 'chicago', 'available', 'NADCA-ASCS-4410', 'NADCA-CVI-8891');
		`)
	}

	// Seed available time slots for today + next 7 days
	today := time.Now().Truncate(24 * time.Hour)
	slots := []struct {
		start string
		end   string
	}{
		{"08:00 AM", "10:00 AM"},
		{"10:00 AM", "12:00 PM"},
		{"01:00 PM", "03:00 PM"},
		{"03:00 PM", "05:00 PM"},
		{"05:00 PM", "07:00 PM"},
	}

	for dayOffset := 0; dayOffset <= 7; dayOffset++ {
		dateStr := today.AddDate(0, 0, dayOffset).Format("2006-01-02")
		for _, s := range slots {
			slotID := fmt.Sprintf("slot-%s-%s", dateStr, strings.ReplaceAll(s.start, " ", ""))
			_, _ = db.Exec(`
				INSERT OR IGNORE INTO time_slots (id, date, start_time, end_time, available, market)
				VALUES (?, ?, ?, ?, 1, 'chicago');
			`, slotID, dateStr, s.start, s.end)
		}
	}

	// Seed default admin settings
	var settingsCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM admin_settings").Scan(&settingsCount)
	if settingsCount == 0 {
		_, _ = db.Exec(`
			INSERT INTO admin_settings (
				id, contact_email, contact_phone, service_address, office_hours,
				google_places_api_key, google_place_id, google_reviews_min_rating,
				stripe_publishable_key, stripe_secret_key, stripe_webhook_secret, stripe_enabled,
				bank_name, bank_account_number, bank_routing_number, bank_wire_notes, bank_transfer_enabled, updated_at
			) VALUES (
				'default', 'support@aeroduct.com', '(312) 555-0199', '1420 N Michigan Ave, Suite 400, Chicago, IL 60611',
				'Mon-Sat: 7:00 AM - 7:00 PM CST', '', 'ChIJ7cv00DwsDogRAMDACa2m4K8', 4.5,
				'pk_test_sample_stripe_key', '', '', 1,
				'JPMorgan Chase Bank, N.A.', '••••••••4819', '071000013', 'Include invoice reference on wire memo.', 1, CURRENT_TIMESTAMP
			);
		`)
	}

	// Seed service areas
	var areasCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM service_areas").Scan(&areasCount)
	if areasCount == 0 {
		areas := []struct {
			id         string
			name       string
			multiplier float64
		}{
			{"chicago", "Chicago, IL", 1.0},
			{"evanston", "Evanston, IL", 1.05},
			{"oak_park", "Oak Park, IL", 1.05},
			{"cicero", "Cicero, IL", 1.10},
			{"skokie", "Skokie, IL", 1.10},
			{"berwyn", "Berwyn, IL", 1.05},
		}
		for _, a := range areas {
			_, _ = db.Exec("INSERT OR IGNORE INTO service_areas (id, name, fee_multiplier, active) VALUES (?, ?, ?, 1)", a.id, a.name, a.multiplier)
		}
	}

	// Seed services
	var servicesCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM services").Scan(&servicesCount)
	if servicesCount == 0 {
		services := []struct {
			id, name, cat, price, desc string
			pkg                         int
		}{
			{"res-air-duct", "Air Duct Cleaning", "residential", "$299", "Removing dust, debris, and allergens from home ductwork systems to improve airflow.", 0},
			{"res-dryer-vent", "Dryer Vent Cleaning", "residential", "$129", "Clearing lint and blockages from dryer exhaust vent lines to prevent fire hazards.", 0},
			{"res-chimney", "Chimney Sweep & Fireplace Cleaning", "residential", "$189", "Removing dangerous soot, creosote buildup, and physical blockages from residential chimneys.", 0},
			{"res-uv-light", "UV Light & Air Purification", "residential", "$449", "Installation of UV air purifiers inside HVAC systems to neutralize airborne pathogens.", 0},
			{"res-duct-sanitizing", "Duct Sanitizing & Odor Removal", "residential", "$99", "Eliminating mold, bacteria, and lingering odors with specialized fogging treatments.", 0},
			{"com-air-duct", "Commercial Air Duct Cleaning", "commercial", "Custom Quote", "Large-scale vent and HVAC system cleaning designed to meet corporate compliance.", 0},
			{"pkg-furnace", "Furnace Package Units", "package", "From $249", "Flat-rate, all-in-one maintenance and cleaning tiers specifically tailored for packaged HVAC systems.", 1},
		}
		for _, s := range services {
			_, _ = db.Exec("INSERT OR IGNORE INTO services (id, name, category, price, description, is_package, active) VALUES (?, ?, ?, ?, ?, ?, 1)", s.id, s.name, s.cat, s.price, s.desc, s.pkg)
		}
	}

	// Seed FAQs
	var faqsCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM faqs").Scan(&faqsCount)
	if faqsCount == 0 {
		faqs := []struct {
			id, q, a string
			order    int
		}{
			{"faq-1", "How often should I have my ducts cleaned?", "The EPA recommends duct cleaning every 3–5 years for most residential properties.", 1},
			{"faq-2", "How long does the service take?", "Most homes are completed within our guaranteed 2-hour arrival window.", 2},
			{"faq-3", "Is the pricing really flat-rate? No add-ons?", "Yes. The price you see on the pricing page is the price you pay. We don't charge per vent.", 3},
			{"faq-4", "Are your technicians certified?", "All AeroDuct technicians are NADCA-certified (National Air Duct Cleaners Association).", 4},
		}
		for _, f := range faqs {
			_, _ = db.Exec("INSERT OR IGNORE INTO faqs (id, question, answer, display_order) VALUES (?, ?, ?, ?)", f.id, f.q, f.a, f.order)
		}
	}
}
