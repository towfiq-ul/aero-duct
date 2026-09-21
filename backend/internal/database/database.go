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
}
