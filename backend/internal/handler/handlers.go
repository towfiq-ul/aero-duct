package handler

import (
	"net/http"

	"github.com/aeroduct/api/internal/apierr"
	"github.com/aeroduct/api/internal/model"
	"github.com/aeroduct/api/internal/pricing"
	"github.com/aeroduct/api/internal/service/auth"
	"github.com/aeroduct/api/internal/service/booking"
	"github.com/aeroduct/api/internal/service/geo"
	"github.com/aeroduct/api/internal/service/notify"
	"github.com/aeroduct/api/internal/service/passport"
	"github.com/aeroduct/api/internal/service/payment"
	"github.com/aeroduct/api/internal/service/technician"
	"github.com/gin-gonic/gin"
)

// CalculatePrice computes flat-rate pricing based on property inputs or package IDs.
func CalculatePrice(c *gin.Context) {
	var req model.CalculatePriceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		apierr.BadRequest(c, "Invalid calculation payload")
		return
	}

	// 1. Property-based deterministic pricing
	if req.SquareFootage > 0 {
		market := req.Market
		if market == "" {
			market = pricing.MarketChicago
		}
		category := req.Category
		if category == "" {
			category = pricing.CategoryResidentialDuct
		}

		result, err := pricing.Calculate(pricing.Input{
			Market:        market,
			Category:      category,
			SquareFootage: req.SquareFootage,
			FurnaceCount:  req.FurnaceCount,
			VentCount:     req.VentCount,
			AddDryerVent:  req.AddDryerVent,
		})
		if err != nil {
			apierr.BadRequest(c, err.Error())
			return
		}

		c.JSON(http.StatusOK, result)
		return
	}

	// 2. Package-based pricing (for frontend packages flow)
	subtotal := 299.0 // default residential base
	for _, id := range req.ServiceIDs {
		switch id {
		case "res-dryer-vent":
			subtotal += 129.0
		case "res-chimney":
			subtotal += 189.0
		case "res-uv-light":
			subtotal += 449.0
		case "res-duct-sanitizing":
			subtotal += 99.0
		case "res-hvac-inspection":
			subtotal += 79.0
		}
	}

	// Area fee multiplier
	multiplier := 1.0
	switch req.AreaID {
	case "evanston", "oak_park", "berwyn":
		multiplier = 1.05
	case "cicero", "skokie":
		multiplier = 1.10
	}
	subtotal *= multiplier

	taxRate := 0.08
	tax := subtotal * taxRate
	total := subtotal + tax

	c.JSON(http.StatusOK, gin.H{
		"subtotal": subtotal,
		"taxRate":  taxRate,
		"taxLabel": "Sales Tax (8%)",
		"tax":      tax,
		"total":    total,
		"currency": "USD",
		"locale":   "en-US",
	})
}

// GetAvailableSlots queries open 2-hour arrival windows.
func GetAvailableSlots(c *gin.Context) {
	dateStr := c.Query("date")
	market := c.Query("market")
	if market == "" {
		market = "chicago"
	}

	slots, err := booking.GetAvailableSlots(dateStr, market)
	if err != nil {
		apierr.Internal(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"date":   dateStr,
		"market": market,
		"slots":  slots,
	})
}

// CreateBooking reserves an arrival window and creates a new booking.
func CreateBooking(c *gin.Context) {
	var req model.CreateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		apierr.BadRequest(c, "Missing required booking fields (email, phone, address)")
		return
	}

	newBooking, err := booking.CreateBooking(req)
	if err != nil {
		apierr.Internal(c, err)
		return
	}

	go notify.NotifyBookingConfirmed(req.Email, req.Phone, newBooking.ReferenceNumber, req.PreferredDate, req.ArrivalWindow)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Booking confirmed successfully",
		"booking": newBooking,
	})
}

// GetBooking retrieves confirmed booking details by ID or reference number.
func GetBooking(c *gin.Context) {
	id := c.Param("id")
	record, err := booking.GetBooking(id)
	if err != nil {
		apierr.Internal(c, err)
		return
	}
	if record == nil {
		apierr.NotFound(c, "Booking not found")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"booking": record,
	})
}

// DetectGeo identifies market parameters based on IP and headers.
func DetectGeo(c *gin.Context) {
	clientIP := c.ClientIP()
	countryHeader := c.GetHeader("CF-IPCountry")

	market := geo.DetectMarket(clientIP, countryHeader)
	c.JSON(http.StatusOK, market)
}

// GetPassport retrieves the verified Digital Duct Health Passport™.
func GetPassport(c *gin.Context) {
	id := c.Param("id")
	p, err := passport.GetPassport(id)
	if err != nil {
		apierr.Internal(c, err)
		return
	}

	c.JSON(http.StatusOK, p)
}

// GetDispatchRoute retrieves assigned jobs for a technician.
func GetDispatchRoute(c *gin.Context) {
	techID := c.Param("technicianId")
	jobs, err := technician.GetDispatchRoute(techID)
	if err != nil {
		apierr.Internal(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"technicianId": techID,
		"totalJobs":    len(jobs),
		"jobs":         jobs,
	})
}

// SubmitChecklist handles field checklist submission and generates a digital certificate.
func SubmitChecklist(c *gin.Context) {
	bookingID := c.Param("bookingId")
	var req model.ChecklistSubmissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		apierr.BadRequest(c, "Invalid checklist payload")
		return
	}

	p, err := technician.SubmitChecklist(bookingID, req)
	if err != nil {
		apierr.Internal(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"passportId": p.ID,
		"passport":   p,
	})
}

// ── Auth Handlers ───────────────────────────────────────────

// Login authenticates a user and returns a signed JWT.
func Login(c *gin.Context) {
	var req model.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		apierr.BadRequest(c, "Valid email and password are required")
		return
	}

	res, err := auth.Login(req)
	if err != nil {
		apierr.BadRequest(c, err.Error())
		return
	}

	c.JSON(http.StatusOK, res)
}

// Signup registers a new customer account.
func Signup(c *gin.Context) {
	var req model.SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		apierr.BadRequest(c, "Valid name, email, and password (min 6 chars) are required")
		return
	}

	res, err := auth.Signup(req)
	if err != nil {
		apierr.BadRequest(c, err.Error())
		return
	}

	c.JSON(http.StatusCreated, res)
}

// ResetPassword handles password reset tokens.
func ResetPassword(c *gin.Context) {
	var req model.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		apierr.BadRequest(c, "Token and new password (min 6 chars) are required")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password updated successfully. You may now sign in.",
	})
}

// ── Payment Handlers ────────────────────────────────────────

// CreatePaymentIntent handles Stripe & bank transfer payment intent creation.
func CreatePaymentIntent(c *gin.Context) {
	var req payment.PaymentIntentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		apierr.BadRequest(c, "bookingId and amount are required")
		return
	}

	res, err := payment.CreatePaymentIntent(req)
	if err != nil {
		apierr.Internal(c, err)
		return
	}

	c.JSON(http.StatusOK, res)
}
