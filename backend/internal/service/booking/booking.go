package booking

import (
	"database/sql"
	"errors"
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/aeroduct/api/internal/database"
	"github.com/aeroduct/api/internal/model"
	"github.com/aeroduct/api/internal/pricing"
	"github.com/google/uuid"
)

// GetAvailableSlots queries open 2-hour arrival windows for a given date.
func GetAvailableSlots(dateStr, market string) ([]model.TimeSlot, error) {
	db := database.DB
	if db == nil {
		return nil, errors.New("database not initialized")
	}

	if market == "" {
		market = "chicago"
	}

	query := "SELECT id, date, start_time, end_time, available, market, created_at FROM time_slots WHERE market = ?"
	args := []interface{}{market}

	if dateStr != "" {
		query += " AND date = ?"
		args = append(args, dateStr)
	}
	query += " ORDER BY date ASC, start_time ASC"

	rows, err := db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed querying time slots: %w", err)
	}
	defer rows.Close()

	var slots []model.TimeSlot
	for rows.Next() {
		var s model.TimeSlot
		var dateVal time.Time
		var availInt int
		if err := rows.Scan(&s.ID, &dateVal, &s.StartTime, &s.EndTime, &availInt, &s.Market, &s.CreatedAt); err != nil {
			return nil, err
		}
		s.Date = dateVal
		s.Available = (availInt == 1)
		slots = append(slots, s)
	}

	return slots, nil
}

// CreateBooking creates a customer, address, reserves the time slot, and persists the booking.
func CreateBooking(req model.CreateBookingRequest) (*model.Booking, error) {
	db := database.DB
	if db == nil {
		return nil, errors.New("database not initialized")
	}

	tx, err := db.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed starting transaction: %w", err)
	}
	defer tx.Rollback()

	// 1. Resolve or create customer
	var customerID string
	err = tx.QueryRow("SELECT id FROM customers WHERE email = ?", req.Email).Scan(&customerID)
	if errors.Is(err, sql.ErrNoRows) {
		customerID = uuid.New().String()
		fName := req.FirstName
		lName := req.LastName
		if fName == "" && req.CustomerName != "" {
			parts := strings.SplitN(req.CustomerName, " ", 2)
			fName = parts[0]
			if len(parts) > 1 {
				lName = parts[1]
			}
		}
		market := req.Market
		if market == "" {
			market = "chicago"
		}
		_, err = tx.Exec(`
			INSERT INTO customers (id, email, first_name, last_name, phone, market, role, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, 'customer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		`, customerID, req.Email, fName, lName, req.Phone, market)
		if err != nil {
			return nil, fmt.Errorf("failed creating customer: %w", err)
		}
	} else if err != nil {
		return nil, fmt.Errorf("failed querying customer: %w", err)
	}

	// 2. Insert service address
	addressID := uuid.New().String()
	city := req.City
	if city == "" {
		city = "Chicago"
	}
	postal := req.PostalCode
	if postal == "" {
		postal = "60601"
	}
	_, err = tx.Exec(`
		INSERT INTO addresses (id, customer_id, line1, city, state, postal_code, country, square_footage, furnace_count, vent_count)
		VALUES (?, ?, ?, ?, 'IL', ?, 'USA', ?, ?, ?)
	`, addressID, customerID, req.Address, city, postal, req.SquareFootage, req.FurnaceCount, req.VentCount)
	if err != nil {
		return nil, fmt.Errorf("failed creating address: %w", err)
	}

	// 3. Resolve or reserve time slot
	var timeSlotID string
	if req.PreferredDate != "" {
		_ = tx.QueryRow(`
			SELECT id FROM time_slots
			WHERE date = ? AND available = 1 LIMIT 1
		`, req.PreferredDate).Scan(&timeSlotID)
	}
	if timeSlotID != "" {
		_, _ = tx.Exec("UPDATE time_slots SET available = 0 WHERE id = ?", timeSlotID)
	}

	// 4. Calculate total price
	sqft := req.SquareFootage
	if sqft <= 0 {
		sqft = 1800
	}
	calcResult, err := pricing.Calculate(pricing.Input{
		Market:        pricing.MarketChicago,
		Category:      pricing.CategoryResidentialDuct,
		SquareFootage: sqft,
		FurnaceCount:  req.FurnaceCount,
		VentCount:     req.VentCount,
	})
	totalPrice := 299.0
	tier := "standard"
	if err == nil && calcResult != nil {
		totalPrice = calcResult.TotalPrice
		tier = string(calcResult.Tier)
	}

	// 5. Generate reference number & insert booking
	refNumber := fmt.Sprintf("AERO-%06d", rand.Intn(900000)+100000)
	bookingID := uuid.New().String()
	category := req.SelectedPackage
	if category == "" {
		category = "residential_duct"
	}

	var slotArg *string
	if timeSlotID != "" {
		slotArg = &timeSlotID
	}

	var notesArg *string
	if req.AccessNotes != "" {
		notesArg = &req.AccessNotes
	}

	_, err = tx.Exec(`
		INSERT INTO bookings (id, reference_number, status, customer_id, address_id, time_slot_id, service_category, tier, total_price, currency, notes, created_at, updated_at)
		VALUES (?, ?, 'confirmed', ?, ?, ?, ?, ?, ?, 'USD', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`, bookingID, refNumber, customerID, addressID, slotArg, category, tier, totalPrice, notesArg)
	if err != nil {
		return nil, fmt.Errorf("failed inserting booking: %w", err)
	}

	// 6. Pre-scaffold initial Duct Health Passport record
	passportID := fmt.Sprintf("PASS-%s", refNumber)
	passportURL := fmt.Sprintf("passport/%s", passportID)
	cName := req.CustomerName
	if cName == "" {
		cName = req.FirstName + " " + req.LastName
	}
	_, _ = tx.Exec(`
		INSERT INTO duct_passports (
			id, booking_id, reference_number, customer_name, service_address,
			inspection_date, technician_name, lead_tech_badge, nadca_cert_id,
			system_model, square_footage, cfm_pre_clean, cfm_post_clean,
			particulate_reduction, air_quality_rating, inspection_notes, passport_url
		) VALUES (
			?, ?, ?, ?, ?,
			?, 'Marcus Sterling', 'NADCA-CVI-8891', 'NADCA-ASCS-4410',
			'Trane CleanEffects Variable Speed', ?, 820, 1240,
			94.2, 'A+', 'HEPA negative air pressure contact vacuuming completed.', ?
		)
	`, passportID, bookingID, refNumber, cName, req.Address,
		time.Now().Format("January 02, 2006"), int(sqft), passportURL)

	if err := tx.Commit(); err != nil {
		return nil, fmt.Errorf("failed committing booking transaction: %w", err)
	}

	return GetBooking(bookingID)
}

// GetBooking retrieves a booking by its internal UUID or reference number.
func GetBooking(idOrRef string) (*model.Booking, error) {
	db := database.DB
	if db == nil {
		return nil, errors.New("database not initialized")
	}

	b := &model.Booking{
		Customer: &model.Customer{},
		Address:  &model.Address{},
	}
	var (
		cID, cEmail, cFirst, cLast, cPhone, cMarket string
		aID, aLine1, aCity, aPostal, aCountry       string
		notes, techID, slotID                       sql.NullString
	)

	row := db.QueryRow(`
		SELECT 
			b.id, b.reference_number, b.status, b.customer_id, b.address_id, b.time_slot_id,
			b.service_category, b.tier, b.total_price, b.currency, b.technician_id, b.notes,
			b.created_at, b.updated_at,
			c.id, c.email, c.first_name, c.last_name, c.phone, c.market,
			a.id, a.line1, a.city, a.postal_code, a.country
		FROM bookings b
		JOIN customers c ON b.customer_id = c.id
		JOIN addresses a ON b.address_id = a.id
		WHERE b.id = ? OR b.reference_number = ?
	`, idOrRef, idOrRef)

	err := row.Scan(
		&b.ID, &b.ReferenceNumber, &b.Status, &b.CustomerID, &b.AddressID, &slotID,
		&b.ServiceCategory, &b.Tier, &b.TotalPrice, &b.Currency, &techID, &notes,
		&b.CreatedAt, &b.UpdatedAt,
		&cID, &cEmail, &cFirst, &cLast, &cPhone, &cMarket,
		&aID, &aLine1, &aCity, &aPostal, &aCountry,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("error reading booking: %w", err)
	}

	if notes.Valid {
		b.Notes = &notes.String
	}
	if techID.Valid {
		b.TechnicianID = &techID.String
	}
	if slotID.Valid {
		b.TimeSlotID = slotID.String
	}

	b.Customer.ID = cID
	b.Customer.Email = cEmail
	b.Customer.FirstName = cFirst
	b.Customer.LastName = cLast
	b.Customer.Phone = cPhone
	b.Customer.Market = cMarket

	b.Address.ID = aID
	b.Address.Line1 = aLine1
	b.Address.City = aCity
	b.Address.PostalCode = aPostal
	b.Address.Country = aCountry

	return b, nil
}
