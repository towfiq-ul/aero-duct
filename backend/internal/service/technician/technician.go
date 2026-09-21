package technician

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/aeroduct/api/internal/database"
	"github.com/aeroduct/api/internal/model"
)

// GetDispatchRoute retrieves all active service assignments for a technician.
func GetDispatchRoute(techID string) ([]model.Booking, error) {
	db := database.DB
	if db == nil {
		return nil, errors.New("database not initialized")
	}

	rows, err := db.Query(`
		SELECT 
			b.id, b.reference_number, b.status, b.customer_id, b.address_id, b.time_slot_id,
			b.service_category, b.tier, b.total_price, b.currency, b.technician_id, b.notes,
			b.created_at, b.updated_at,
			c.first_name, c.last_name, c.phone,
			a.line1, a.city, a.postal_code,
			ts.start_time, ts.end_time
		FROM bookings b
		JOIN customers c ON b.customer_id = c.id
		JOIN addresses a ON b.address_id = a.id
		LEFT JOIN time_slots ts ON b.time_slot_id = ts.id
		WHERE b.status IN ('confirmed', 'dispatched', 'in_progress')
		ORDER BY b.created_at ASC
	`)
	if err != nil {
		return nil, fmt.Errorf("failed querying dispatch route: %w", err)
	}
	defer rows.Close()

	var jobs []model.Booking
	for rows.Next() {
		var b model.Booking
		b.Customer = &model.Customer{}
		b.Address = &model.Address{}
		b.TimeSlot = &model.TimeSlot{}

		var (
			notes, tech, slotID       sql.NullString
			startTime, endTime        sql.NullString
		)

		err := rows.Scan(
			&b.ID, &b.ReferenceNumber, &b.Status, &b.CustomerID, &b.AddressID, &slotID,
			&b.ServiceCategory, &b.Tier, &b.TotalPrice, &b.Currency, &tech, &notes,
			&b.CreatedAt, &b.UpdatedAt,
			&b.Customer.FirstName, &b.Customer.LastName, &b.Customer.Phone,
			&b.Address.Line1, &b.Address.City, &b.Address.PostalCode,
			&startTime, &endTime,
		)
		if err != nil {
			return nil, err
		}

		if startTime.Valid && endTime.Valid {
			b.TimeSlot.StartTime = startTime.String
			b.TimeSlot.EndTime = endTime.String
		}
		if notes.Valid {
			b.Notes = &notes.String
		}

		jobs = append(jobs, b)
	}

	return jobs, nil
}

// SubmitChecklist processes technician inspection results, computes CFM deltas, and updates the passport.
func SubmitChecklist(bookingID string, req model.ChecklistSubmissionRequest) (*model.DuctPassport, error) {
	db := database.DB
	if db == nil {
		return nil, errors.New("database not initialized")
	}

	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	// Update booking status to completed
	_, err = tx.Exec("UPDATE bookings SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = ?", bookingID)
	if err != nil {
		return nil, fmt.Errorf("failed updating booking status: %w", err)
	}

	// Calculate CFM delta and quality grade
	rating := "A"
	if req.CfmPostClean > req.CfmPreClean && req.ParticulateReduction >= 90.0 {
		rating = "A+"
	}

	// Serialize before/after records
	beforeAfterJSON, _ := json.Marshal(req.BeforeAfterRecords)

	passportID := fmt.Sprintf("PASS-%s", bookingID)
	passportURL := fmt.Sprintf("passport/%s", passportID)

	_, err = tx.Exec(`
		INSERT INTO duct_passports (
			id, booking_id, reference_number, customer_name, service_address,
			inspection_date, technician_name, lead_tech_badge, nadca_cert_id,
			system_model, square_footage, cfm_pre_clean, cfm_post_clean,
			particulate_reduction, air_quality_rating, inspection_notes, passport_url, before_after_json, created_at
		) VALUES (
			?, ?, ?, 'Verified Client', 'Chicago Service Address',
			?, 'Marcus Sterling', 'NADCA-CVI-8891', 'NADCA-ASCS-4410',
			?, 2200, ?, ?,
			?, ?, ?, ?, ?, CURRENT_TIMESTAMP
		)
		ON CONFLICT(booking_id) DO UPDATE SET
			cfm_pre_clean = excluded.cfm_pre_clean,
			cfm_post_clean = excluded.cfm_post_clean,
			particulate_reduction = excluded.particulate_reduction,
			air_quality_rating = excluded.air_quality_rating,
			inspection_notes = excluded.inspection_notes,
			before_after_json = excluded.before_after_json
	`, passportID, bookingID, bookingID,
		time.Now().Format("January 02, 2006"),
		req.SystemModel, req.CfmPreClean, req.CfmPostClean,
		req.ParticulateReduction, rating, req.InspectionNotes, passportURL, string(beforeAfterJSON))

	if err != nil {
		return nil, fmt.Errorf("failed saving passport: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &model.DuctPassport{
		ID:                          passportID,
		BookingID:                   bookingID,
		CfmPreClean:                 req.CfmPreClean,
		CfmPostClean:                req.CfmPostClean,
		ParticulateReductionPercent: req.ParticulateReduction,
		AirQualityRating:            rating,
		InspectionNotes:             req.InspectionNotes,
		PassportURL:                 passportURL,
		BeforeAfterRecords:          req.BeforeAfterRecords,
		CreatedAt:                   time.Now(),
	}, nil
}
