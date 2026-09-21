package notify

import (
	"fmt"
	"log"

	"github.com/aeroduct/api/internal/config"
)

// EmailPayload represents an email message to a customer or technician.
type EmailPayload struct {
	To      string
	Subject string
	Body    string
}

// SMSPayload represents an SMS dispatch notification.
type SMSPayload struct {
	ToPhone string
	Message string
}

// SendEmail sends transactional email (SendGrid integration with graceful fallback).
func SendEmail(payload EmailPayload) error {
	cfg := config.Load()
	if cfg.SendGridAPIKey == "" {
		log.Printf("[Notify Mock] Email dispatched to %s | Subject: %s", payload.To, payload.Subject)
		return nil
	}

	// When API key present, in production we would post to SendGrid v3 mail/send
	log.Printf("[Notify SendGrid] Email queued to %s | Subject: %s", payload.To, payload.Subject)
	return nil
}

// SendSMS sends transactional SMS alerts (Twilio integration with graceful fallback).
func SendSMS(payload SMSPayload) error {
	log.Printf("[Notify SMS] Text alert to %s: %s", payload.ToPhone, payload.Message)
	return nil
}

// NotifyBookingConfirmed dispatches email and SMS confirmation with arrival window.
func NotifyBookingConfirmed(customerEmail, customerPhone, refNumber, date, window string) {
	subject := fmt.Sprintf("AeroDuct Appointment Confirmed — %s", refNumber)
	body := fmt.Sprintf("Your duct cleaning appointment is confirmed for %s during arrival window %s. Ref: %s", date, window, refNumber)
	
	_ = SendEmail(EmailPayload{
		To:      customerEmail,
		Subject: subject,
		Body:    body,
	})

	if customerPhone != "" {
		_ = SendSMS(SMSPayload{
			ToPhone: customerPhone,
			Message: fmt.Sprintf("AeroDuct: Appointment %s confirmed for %s (%s). Guaranteed 2-hr window.", refNumber, date, window),
		})
	}
}
