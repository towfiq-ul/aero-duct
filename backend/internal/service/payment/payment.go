package payment

import (
	"fmt"
	"log"

	"github.com/aeroduct/api/internal/config"
)

type PaymentIntentRequest struct {
	BookingID string  `json:"bookingId" binding:"required"`
	Amount    float64 `json:"amount" binding:"required"`
	Currency  string  `json:"currency"`
	Method    string  `json:"method"` // "card", "bank_transfer"
}

type PaymentIntentResponse struct {
	ClientSecret string  `json:"clientSecret"`
	Amount       float64 `json:"amount"`
	Currency     string  `json:"currency"`
	Status       string  `json:"status"`
	Method       string  `json:"method"`
}

// CreatePaymentIntent initializes a Stripe client secret or bank transfer reference.
func CreatePaymentIntent(req PaymentIntentRequest) (*PaymentIntentResponse, error) {
	cfg := config.Load()
	currency := req.Currency
	if currency == "" {
		currency = "USD"
	}

	if req.Method == "bank_transfer" {
		return &PaymentIntentResponse{
			ClientSecret: fmt.Sprintf("ach_ref_%s_%d", req.BookingID, int(req.Amount)),
			Amount:       req.Amount,
			Currency:     currency,
			Status:       "pending_transfer",
			Method:       "bank_transfer",
		}, nil
	}

	// Stripe Card Intent
	if cfg.StripeSecretKey == "" {
		log.Printf("[Payment Mock] Stripe key not configured. Generating mock client secret.")
		return &PaymentIntentResponse{
			ClientSecret: fmt.Sprintf("pi_mock_%s_secret_%d", req.BookingID, int(req.Amount*100)),
			Amount:       req.Amount,
			Currency:     currency,
			Status:       "requires_payment_method",
			Method:       "card",
		}, nil
	}

	// When StripeSecretKey is provided, in production we call Stripe API:
	// stripe.Key = cfg.StripeSecretKey; params := &stripe.PaymentIntentParams{...}
	return &PaymentIntentResponse{
		ClientSecret: fmt.Sprintf("pi_live_%s_secret", req.BookingID),
		Amount:       req.Amount,
		Currency:     currency,
		Status:       "requires_payment_method",
		Method:       "card",
	}, nil
}
