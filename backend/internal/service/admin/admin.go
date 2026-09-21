package admin

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/aeroduct/api/internal/database"
	"github.com/aeroduct/api/internal/model"
	"github.com/google/uuid"
)

// ── Settings ────────────────────────────────────────────────

func GetSettings() (*model.AdminSettings, error) {
	db := database.DB
	if db == nil {
		return nil, errors.New("database not initialized")
	}

	var s model.AdminSettings
	var (
		gKey, gPlace, sPub, sSec, sWebhook, bName, bAcc, bRouting, bWire sql.NullString
		sEnabled, bEnabled int
	)

	row := db.QueryRow(`
		SELECT 
			id, contact_email, contact_phone, service_address, office_hours,
			google_places_api_key, google_place_id, google_reviews_min_rating,
			stripe_publishable_key, stripe_secret_key, stripe_webhook_secret, stripe_enabled,
			bank_name, bank_account_number, bank_routing_number, bank_wire_notes, bank_transfer_enabled, updated_at
		FROM admin_settings LIMIT 1
	`)

	err := row.Scan(
		&s.ID, &s.ContactEmail, &s.ContactPhone, &s.ServiceAddress, &s.OfficeHours,
		&gKey, &gPlace, &s.GoogleReviewsMinRating,
		&sPub, &sSec, &sWebhook, &sEnabled,
		&bName, &bAcc, &bRouting, &bWire, &bEnabled, &s.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return &model.AdminSettings{
				ID:                     "default",
				ContactEmail:           "support@aeroduct.com",
				ContactPhone:           "(312) 555-0199",
				ServiceAddress:         "1420 N Michigan Ave, Suite 400, Chicago, IL 60611",
				OfficeHours:            "Mon-Sat: 7:00 AM - 7:00 PM CST",
				GooglePlaceID:          "ChIJ7cv00DwsDogRAMDACa2m4K8",
				GoogleReviewsMinRating: 4.5,
				StripePublishableKey:   "pk_test_sample",
				StripeEnabled:          true,
				BankName:               "JPMorgan Chase Bank, N.A.",
				BankAccountNumber:      "••••••••4819",
				BankRoutingNumber:      "071000013",
				BankTransferEnabled:    true,
				UpdatedAt:              time.Now(),
			}, nil
		}
		return nil, fmt.Errorf("failed querying admin settings: %w", err)
	}

	s.GooglePlacesAPIKey = gKey.String
	s.GooglePlaceID = gPlace.String
	s.StripePublishableKey = sPub.String
	s.StripeSecretKey = sSec.String
	s.StripeWebhookSecret = sWebhook.String
	s.StripeEnabled = (sEnabled == 1)
	s.BankName = bName.String
	s.BankAccountNumber = bAcc.String
	s.BankRoutingNumber = bRouting.String
	s.BankWireNotes = bWire.String
	s.BankTransferEnabled = (bEnabled == 1)

	return &s, nil
}

func UpdateSettings(s model.AdminSettings) error {
	db := database.DB
	if db == nil {
		return errors.New("database not initialized")
	}

	stripeInt := 0
	if s.StripeEnabled {
		stripeInt = 1
	}
	bankInt := 0
	if s.BankTransferEnabled {
		bankInt = 1
	}

	_, err := db.Exec(`
		INSERT INTO admin_settings (
			id, contact_email, contact_phone, service_address, office_hours,
			google_places_api_key, google_place_id, google_reviews_min_rating,
			stripe_publishable_key, stripe_secret_key, stripe_webhook_secret, stripe_enabled,
			bank_name, bank_account_number, bank_routing_number, bank_wire_notes, bank_transfer_enabled, updated_at
		) VALUES (
			'default', ?, ?, ?, ?,
			?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?, ?, ?, CURRENT_TIMESTAMP
		)
		ON CONFLICT(id) DO UPDATE SET
			contact_email = excluded.contact_email,
			contact_phone = excluded.contact_phone,
			service_address = excluded.service_address,
			office_hours = excluded.office_hours,
			google_places_api_key = excluded.google_places_api_key,
			google_place_id = excluded.google_place_id,
			google_reviews_min_rating = excluded.google_reviews_min_rating,
			stripe_publishable_key = excluded.stripe_publishable_key,
			stripe_secret_key = excluded.stripe_secret_key,
			stripe_webhook_secret = excluded.stripe_webhook_secret,
			stripe_enabled = excluded.stripe_enabled,
			bank_name = excluded.bank_name,
			bank_account_number = excluded.bank_account_number,
			bank_routing_number = excluded.bank_routing_number,
			bank_wire_notes = excluded.bank_wire_notes,
			bank_transfer_enabled = excluded.bank_transfer_enabled,
			updated_at = CURRENT_TIMESTAMP
	`, s.ContactEmail, s.ContactPhone, s.ServiceAddress, s.OfficeHours,
		s.GooglePlacesAPIKey, s.GooglePlaceID, s.GoogleReviewsMinRating,
		s.StripePublishableKey, s.StripeSecretKey, s.StripeWebhookSecret, stripeInt,
		s.BankName, s.BankAccountNumber, s.BankRoutingNumber, s.BankWireNotes, bankInt)

	return err
}

// ── Service Areas ───────────────────────────────────────────

func GetServiceAreas() ([]model.ServiceAreaAdmin, error) {
	db := database.DB
	if db == nil {
		return nil, errors.New("database not initialized")
	}

	rows, err := db.Query("SELECT id, name, fee_multiplier, active FROM service_areas ORDER BY name ASC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var areas []model.ServiceAreaAdmin
	for rows.Next() {
		var a model.ServiceAreaAdmin
		var act int
		if err := rows.Scan(&a.ID, &a.Name, &a.FeeMultiplier, &act); err != nil {
			return nil, err
		}
		a.Active = (act == 1)
		areas = append(areas, a)
	}
	return areas, nil
}

func SaveServiceArea(a model.ServiceAreaAdmin) error {
	db := database.DB
	if db == nil {
		return errors.New("database not initialized")
	}
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	act := 0
	if a.Active {
		act = 1
	}

	_, err := db.Exec(`
		INSERT INTO service_areas (id, name, fee_multiplier, active)
		VALUES (?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			name = excluded.name,
			fee_multiplier = excluded.fee_multiplier,
			active = excluded.active
	`, a.ID, a.Name, a.FeeMultiplier, act)
	return err
}

func DeleteServiceArea(id string) error {
	db := database.DB
	if db == nil {
		return errors.New("database not initialized")
	}
	_, err := db.Exec("DELETE FROM service_areas WHERE id = ?", id)
	return err
}

// ── Services ────────────────────────────────────────────────

func GetServices() ([]model.ServiceAdmin, error) {
	db := database.DB
	if db == nil {
		return nil, errors.New("database not initialized")
	}

	rows, err := db.Query("SELECT id, name, category, price, description, is_package, active FROM services ORDER BY category ASC, name ASC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var services []model.ServiceAdmin
	for rows.Next() {
		var s model.ServiceAdmin
		var pkg, act int
		if err := rows.Scan(&s.ID, &s.Name, &s.Category, &s.Price, &s.Description, &pkg, &act); err != nil {
			return nil, err
		}
		s.IsPackage = (pkg == 1)
		s.Active = (act == 1)
		services = append(services, s)
	}
	return services, nil
}

func SaveService(s model.ServiceAdmin) error {
	db := database.DB
	if db == nil {
		return errors.New("database not initialized")
	}
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	pkg := 0
	if s.IsPackage {
		pkg = 1
	}
	act := 0
	if s.Active {
		act = 1
	}

	_, err := db.Exec(`
		INSERT INTO services (id, name, category, price, description, is_package, active)
		VALUES (?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			name = excluded.name,
			category = excluded.category,
			price = excluded.price,
			description = excluded.description,
			is_package = excluded.is_package,
			active = excluded.active
	`, s.ID, s.Name, s.Category, s.Price, s.Description, pkg, act)
	return err
}

func DeleteService(id string) error {
	db := database.DB
	if db == nil {
		return errors.New("database not initialized")
	}
	_, err := db.Exec("DELETE FROM services WHERE id = ?", id)
	return err
}

// ── FAQs ────────────────────────────────────────────────────

func GetFAQs() ([]model.FAQItem, error) {
	db := database.DB
	if db == nil {
		return nil, errors.New("database not initialized")
	}

	rows, err := db.Query("SELECT id, question, answer, display_order FROM faqs ORDER BY display_order ASC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var faqs []model.FAQItem
	for rows.Next() {
		var f model.FAQItem
		if err := rows.Scan(&f.ID, &f.Question, &f.Answer, &f.DisplayOrder); err != nil {
			return nil, err
		}
		faqs = append(faqs, f)
	}
	return faqs, nil
}

func SaveFAQ(f model.FAQItem) error {
	db := database.DB
	if db == nil {
		return errors.New("database not initialized")
	}
	if f.ID == "" {
		f.ID = uuid.New().String()
	}

	_, err := db.Exec(`
		INSERT INTO faqs (id, question, answer, display_order)
		VALUES (?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			question = excluded.question,
			answer = excluded.answer,
			display_order = excluded.display_order
	`, f.ID, f.Question, f.Answer, f.DisplayOrder)
	return err
}

func DeleteFAQ(id string) error {
	db := database.DB
	if db == nil {
		return errors.New("database not initialized")
	}
	_, err := db.Exec("DELETE FROM faqs WHERE id = ?", id)
	return err
}
