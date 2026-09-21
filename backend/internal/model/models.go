package model

import (
	"time"

	"github.com/aeroduct/api/internal/pricing"
	"github.com/golang-jwt/jwt/v5"
)

// Customer represents a residential or commercial client.
type Customer struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Phone     string    `json:"phone"`
	Market    string    `json:"market"` // "chicago" or "india"
	Password  string    `json:"-"`
	Role      string    `json:"role"` // "customer", "technician", "admin"
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// Address represents a customer's physical service site.
type Address struct {
	ID            string   `json:"id"`
	CustomerID    string   `json:"customerId"`
	Line1         string   `json:"line1"`
	Line2         *string  `json:"line2,omitempty"`
	City          string   `json:"city"`
	State         *string  `json:"state,omitempty"`
	PostalCode    string   `json:"postalCode"`
	Country       string   `json:"country"`
	SquareFootage *float64 `json:"squareFootage,omitempty"`
	FurnaceCount  *int     `json:"furnaceCount,omitempty"`
	VentCount     *int     `json:"ventCount,omitempty"`
}

// TimeSlot represents a guaranteed 2-hour technician arrival window.
type TimeSlot struct {
	ID        string    `json:"id"`
	Date      time.Time `json:"date"`
	StartTime string    `json:"startTime"` // e.g. "08:00 AM" or "08:00"
	EndTime   string    `json:"endTime"`   // e.g. "10:00 AM" or "10:00"
	Available bool      `json:"available"`
	Market    string    `json:"market"` // "chicago", "india"
	CreatedAt time.Time `json:"createdAt"`
}

// Booking represents a confirmed or scheduled service appointment.
type Booking struct {
	ID              string       `json:"id"`
	ReferenceNumber string       `json:"referenceNumber"`
	Status          string       `json:"status"` // "pending", "confirmed", "dispatched", "in_progress", "completed", "cancelled"
	CustomerID      string       `json:"customerId"`
	AddressID       string       `json:"addressId"`
	TimeSlotID      string       `json:"timeSlotId"`
	ServiceCategory string       `json:"serviceCategory"`
	Tier            string       `json:"tier"`
	TotalPrice      float64      `json:"totalPrice"`
	Currency        string       `json:"currency"`
	TechnicianID    *string      `json:"technicianId,omitempty"`
	Notes           *string      `json:"notes,omitempty"`
	CreatedAt       time.Time    `json:"createdAt"`
	UpdatedAt       time.Time    `json:"updatedAt"`
	Customer        *Customer    `json:"customer,omitempty"`
	Address         *Address     `json:"address,omitempty"`
	TimeSlot        *TimeSlot    `json:"timeSlot,omitempty"`
	Technician      *Technician  `json:"technician,omitempty"`
	Passport        *DuctPassport `json:"passport,omitempty"`
}

// Technician represents a certified NADCA field specialist.
type Technician struct {
	ID                   string    `json:"id"`
	FirstName            string    `json:"firstName"`
	LastName             string    `json:"lastName"`
	Phone                string    `json:"phone"`
	Market               string    `json:"market"`
	Status               string    `json:"status"` // "available", "dispatched", "on_job", "off_duty"
	NadcaCertificationID string    `json:"nadcaCertificationId"`
	BadgeNumber          string    `json:"badgeNumber"`
	CreatedAt            time.Time `json:"createdAt"`
	UpdatedAt            time.Time `json:"updatedAt"`
}

// BorescopeMediaRecord represents a before/after visual inspection record.
type BorescopeMediaRecord struct {
	ID          string `json:"id"`
	Section     string `json:"section"`
	Description string `json:"description"`
	BeforeImage string `json:"beforeImage"`
	AfterImage  string `json:"afterImage"`
	CleanedAt   string `json:"cleanedAt"`
}

// DuctPassport represents the Digital Duct Health Passport™.
type DuctPassport struct {
	ID                           string                 `json:"id"`
	BookingID                    string                 `json:"bookingId"`
	ReferenceNumber              string                 `json:"referenceNumber"`
	CustomerName                 string                 `json:"customerName"`
	ServiceAddress               string                 `json:"serviceAddress"`
	InspectionDate               string                 `json:"inspectionDate"`
	TechnicianName               string                 `json:"technicianName"`
	LeadTechBadge                string                 `json:"leadTechBadge"`
	NadcaCertificationID         string                 `json:"nadcaCertificationId"`
	SystemModel                  string                 `json:"systemModel"`
	SquareFootage                int                    `json:"squareFootage"`
	CfmPreClean                  int                    `json:"cfmPreClean"`
	CfmPostClean                 int                    `json:"cfmPostClean"`
	ParticulateReductionPercent  float64                `json:"particulateReductionPercent"`
	AirQualityRating             string                 `json:"airQualityRating"`
	InspectionNotes              string                 `json:"inspectionNotes"`
	PassportURL                  string                 `json:"passportUrl"`
	BeforeAfterRecords           []BorescopeMediaRecord `json:"beforeAfterRecords"`
	CreatedAt                    time.Time              `json:"createdAt"`
}

// ComplianceCert represents a formal hygiene or safety compliance certificate.
type ComplianceCert struct {
	ID          string    `json:"id"`
	BookingID   string    `json:"bookingId"`
	Type        string    `json:"type"` // "nadca", "epa", "fire_safety"
	IssuedAt    time.Time `json:"issuedAt"`
	ValidUntil  time.Time `json:"validUntil"`
	DownloadURL string    `json:"downloadUrl"`
}

// ── Request & Response Payloads ─────────────────────────────

// CalculatePriceRequest captures price calculation parameters.
type CalculatePriceRequest struct {
	Market        pricing.Market          `json:"market"`
	Category      pricing.ServiceCategory `json:"category"`
	SquareFootage float64                 `json:"squareFootage"`
	FurnaceCount  int                     `json:"furnaceCount"`
	VentCount     int                     `json:"ventCount"`
	AddDryerVent  bool                    `json:"addDryerVent"`

	// Frontend package calculation parameters
	AreaID     string   `json:"areaId"`
	ServiceIDs []string `json:"serviceIds"`
}

// CreateBookingRequest captures booking creation payload.
type CreateBookingRequest struct {
	CustomerName    string   `json:"customerName"`
	FirstName       string   `json:"firstName"`
	LastName        string   `json:"lastName"`
	Email           string   `json:"email" binding:"required"`
	Phone           string   `json:"phone" binding:"required"`
	Address         string   `json:"address" binding:"required"`
	City            string   `json:"city"`
	PostalCode      string   `json:"postalCode"`
	ServiceAreaID   string   `json:"serviceAreaId"`
	SelectedPackage string   `json:"selectedPackage"`
	PreferredDate   string   `json:"preferredDate"`
	ArrivalWindow   string   `json:"arrivalWindow"`
	SquareFootage   float64  `json:"squareFootage"`
	FurnaceCount    int      `json:"furnaceCount"`
	VentCount       int      `json:"ventCount"`
	AccessNotes     string   `json:"accessNotes"`
	Market          string   `json:"market"`
}

// ChecklistSubmissionRequest captures technician field checklist report.
type ChecklistSubmissionRequest struct {
	BookingID            string                 `json:"bookingId"`
	TechnicianID         string                 `json:"technicianId"`
	CfmPreClean          int                    `json:"cfmPreClean"`
	CfmPostClean         int                    `json:"cfmPostClean"`
	StaticPressurePre    float64                `json:"staticPressurePre"`
	StaticPressurePost   float64                `json:"staticPressurePost"`
	SystemModel          string                 `json:"systemModel"`
	ParticulateReduction float64                `json:"particulateReduction"`
	InspectionNotes      string                 `json:"inspectionNotes"`
	BeforeAfterRecords   []BorescopeMediaRecord `json:"beforeAfterRecords"`
}

// Auth Requests & JWT Claims
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type SignupRequest struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
	Phone     string `json:"phone"`
	Market    string `json:"market"`
	Role      string `json:"role"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required,min=6"`
}

type AuthResponse struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expiresAt"`
	User      Customer  `json:"user"`
}

type Claims struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	Market string `json:"market"`
	jwt.RegisteredClaims
}

// ── Admin Domain Models ─────────────────────────────────────

type AdminSettings struct {
	ID                     string    `json:"id"`
	ContactEmail           string    `json:"contactEmail"`
	ContactPhone           string    `json:"contactPhone"`
	ServiceAddress         string    `json:"serviceAddress"`
	OfficeHours            string    `json:"officeHours"`
	GooglePlacesAPIKey     string    `json:"googlePlacesApiKey"`
	GooglePlaceID          string    `json:"googlePlaceId"`
	GoogleReviewsMinRating float64   `json:"googleReviewsMinRating"`
	StripePublishableKey   string    `json:"stripePublishableKey"`
	StripeSecretKey        string    `json:"stripeSecretKey"`
	StripeWebhookSecret    string    `json:"stripeWebhookSecret"`
	StripeEnabled          bool      `json:"stripeEnabled"`
	BankName               string    `json:"bankName"`
	BankAccountNumber      string    `json:"bankAccountNumber"`
	BankRoutingNumber      string    `json:"bankRoutingNumber"`
	BankWireNotes          string    `json:"bankWireNotes"`
	BankTransferEnabled    bool      `json:"bankTransferEnabled"`
	UpdatedAt              time.Time `json:"updatedAt"`
}

type ServiceAreaAdmin struct {
	ID            string  `json:"id"`
	Name          string  `json:"name"`
	FeeMultiplier float64 `json:"feeMultiplier"`
	Active        bool    `json:"active"`
}

type ServiceAdmin struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Category    string `json:"category"` // "residential", "commercial", "package"
	Price       string `json:"price"`
	Description string `json:"description"`
	IsPackage   bool   `json:"isPackage"`
	Active      bool   `json:"active"`
}

type FAQItem struct {
	ID           string `json:"id"`
	Question     string `json:"question"`
	Answer       string `json:"answer"`
	DisplayOrder int    `json:"displayOrder"`
}
