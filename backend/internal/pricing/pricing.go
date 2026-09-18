// Package pricing implements the AeroDuct flat-rate pricing calculator.
//
// Pricing is computed deterministically from property inputs so customers
// always see the same quote before and after booking — no bait-and-switch.
package pricing

import (
	"errors"
	"math"
)

// Market identifies which geographic service region applies.
type Market string

const (
	MarketChicago Market = "chicago"
	MarketIndia   Market = "india"
)

// ServiceCategory is the type of HVAC / duct cleaning service.
type ServiceCategory string

const (
	CategoryResidentialDuct  ServiceCategory = "residential_duct"
	CategoryDryerVent        ServiceCategory = "dryer_vent"
	CategoryCommercialKitchen ServiceCategory = "commercial_kitchen"
	CategoryHospitalHVAC     ServiceCategory = "hospital_hvac"
	CategoryCorporateHVAC    ServiceCategory = "corporate_hvac"
	CategoryRoboticDuct      ServiceCategory = "robotic_duct"
)

// ServiceTier determines the service level and price bracket.
type ServiceTier string

const (
	TierBasic      ServiceTier = "basic"
	TierStandard   ServiceTier = "standard"
	TierPremium    ServiceTier = "premium"
	TierEnterprise ServiceTier = "enterprise"
)

// Currency is the billing currency for a market.
type Currency string

const (
	CurrencyUSD Currency = "USD"
	CurrencyINR Currency = "INR"
)

// Input captures all the customer-provided property details.
type Input struct {
	Market        Market
	Category      ServiceCategory
	SquareFootage float64
	FurnaceCount  int
	VentCount     int
	AddDryerVent  bool
}

// LineItem is a single price component.
type LineItem struct {
	Label    string   `json:"label"`
	Price    float64  `json:"price"`
	Currency Currency `json:"currency"`
}

// Result is the complete pricing output.
type Result struct {
	Tier                    ServiceTier `json:"tier"`
	Currency                Currency    `json:"currency"`
	BasePrice               float64     `json:"basePrice"`
	LineItems               []LineItem  `json:"lineItems"`
	TotalPrice              float64     `json:"totalPrice"`
	EstimatedDurationMinutes int        `json:"estimatedDurationMinutes"`
}

// ──────────────────────────────────────────────────────────
// Rate tables
// ──────────────────────────────────────────────────────────

// Chicago (USD) residential duct cleaning
var chicagoResidentialRates = struct {
	basePer1000sqft float64 // base per 1 000 sq ft
	furnaceAddon    float64 // per furnace
	ventAddon       float64 // per vent beyond 10
	dryerVentAddon  float64
	premiumMult     float64
}{
	basePer1000sqft: 89,
	furnaceAddon:    45,
	ventAddon:       8,
	dryerVentAddon:  79,
	premiumMult:     1.35,
}

// India (INR) commercial rates — per HVAC unit / flat
var indiaCommercialRates = struct {
	kitchenPerUnit   float64
	hospitalPerUnit  float64
	corporatePerUnit float64
	roboticPerUnit   float64
	minCharge        float64
}{
	kitchenPerUnit:   4500,
	hospitalPerUnit:  6500,
	corporatePerUnit: 3500,
	roboticPerUnit:   8500,
	minCharge:        12000,
}

// ──────────────────────────────────────────────────────────
// Calculate
// ──────────────────────────────────────────────────────────

// Calculate computes a deterministic flat-rate price.
func Calculate(in Input) (*Result, error) {
	if err := validate(in); err != nil {
		return nil, err
	}

	switch in.Market {
	case MarketChicago:
		return calcChicago(in)
	case MarketIndia:
		return calcIndia(in)
	default:
		return nil, errors.New("unsupported market")
	}
}

// ── Chicago ───────────────────────────────────────────────

func calcChicago(in Input) (*Result, error) {
	rates := chicagoResidentialRates
	var items []LineItem
	currency := CurrencyUSD

	// Base: square footage component
	sqftUnits := in.SquareFootage / 1000
	base := math.Ceil(sqftUnits) * rates.basePer1000sqft
	items = append(items, LineItem{
		Label:    "Base rate (per 1,000 sq ft)",
		Price:    base,
		Currency: currency,
	})

	// Furnace add-on
	furnaceTotal := float64(in.FurnaceCount) * rates.furnaceAddon
	if furnaceTotal > 0 {
		items = append(items, LineItem{
			Label:    formatFurnaceLabel(in.FurnaceCount),
			Price:    furnaceTotal,
			Currency: currency,
		})
	}

	// Extra vents (first 10 included)
	extraVents := in.VentCount - 10
	var ventTotal float64
	if extraVents > 0 {
		ventTotal = float64(extraVents) * rates.ventAddon
		items = append(items, LineItem{
			Label:    formatVentLabel(extraVents),
			Price:    ventTotal,
			Currency: currency,
		})
	}

	// Dryer vent add-on
	if in.AddDryerVent {
		items = append(items, LineItem{
			Label:    "Dryer vent cleaning",
			Price:    rates.dryerVentAddon,
			Currency: currency,
		})
	}

	subtotal := base + furnaceTotal + ventTotal
	if in.AddDryerVent {
		subtotal += rates.dryerVentAddon
	}

	// Determine tier and apply multiplier
	tier, mult := chicagoTier(subtotal)
	if mult > 1 {
		bonus := subtotal * (mult - 1)
		items = append(items, LineItem{
			Label:    "Premium service upgrade",
			Price:    roundCents(bonus),
			Currency: currency,
		})
		subtotal = subtotal * mult
	}
	subtotal = roundCents(subtotal)

	return &Result{
		Tier:                    tier,
		Currency:                currency,
		BasePrice:               base,
		LineItems:               items,
		TotalPrice:              subtotal,
		EstimatedDurationMinutes: chicagoDuration(in),
	}, nil
}

func chicagoTier(subtotal float64) (ServiceTier, float64) {
	switch {
	case subtotal < 200:
		return TierBasic, 1.0
	case subtotal < 350:
		return TierStandard, 1.0
	case subtotal < 550:
		return TierPremium, 1.35
	default:
		return TierEnterprise, 1.35
	}
}

func chicagoDuration(in Input) int {
	// Empirical formula: 30 min base + 10 min/furnace + 3 min/vent
	d := 30 + (in.FurnaceCount * 10) + (in.VentCount * 3)
	if in.AddDryerVent {
		d += 25
	}
	return d
}

// ── India ─────────────────────────────────────────────────

func calcIndia(in Input) (*Result, error) {
	rates := indiaCommercialRates
	currency := CurrencyINR

	// Determine rate per unit based on category
	var ratePerUnit float64
	var label string
	switch in.Category {
	case CategoryCommercialKitchen:
		ratePerUnit = rates.kitchenPerUnit
		label = "Commercial kitchen exhaust unit"
	case CategoryHospitalHVAC:
		ratePerUnit = rates.hospitalPerUnit
		label = "Hospital HVAC unit"
	case CategoryCorporateHVAC:
		ratePerUnit = rates.corporatePerUnit
		label = "Corporate HVAC unit"
	case CategoryRoboticDuct:
		ratePerUnit = rates.roboticPerUnit
		label = "Robotic duct cleaning unit"
	default:
		ratePerUnit = rates.corporatePerUnit
		label = "HVAC unit"
	}

	units := in.FurnaceCount // reuse furnaceCount as HVAC unit count for India
	if units < 1 {
		units = 1
	}

	unitTotal := float64(units) * ratePerUnit
	items := []LineItem{{
		Label:    label,
		Price:    unitTotal,
		Currency: currency,
	}}

	// sq ft surcharge for large premises
	var sqftSurcharge float64
	if in.SquareFootage > 5000 {
		sqftSurcharge = math.Floor((in.SquareFootage-5000)/1000) * 1500
		items = append(items, LineItem{
			Label:    "Large premises surcharge",
			Price:    sqftSurcharge,
			Currency: currency,
		})
	}

	total := unitTotal + sqftSurcharge
	if total < rates.minCharge {
		items = append(items, LineItem{
			Label:    "Minimum service charge adjustment",
			Price:    rates.minCharge - total,
			Currency: currency,
		})
		total = rates.minCharge
	}

	tier := indiaTier(total)

	return &Result{
		Tier:                    tier,
		Currency:                currency,
		BasePrice:               unitTotal,
		LineItems:               items,
		TotalPrice:              total,
		EstimatedDurationMinutes: indiaDuration(in),
	}, nil
}

func indiaTier(total float64) ServiceTier {
	switch {
	case total < 20000:
		return TierBasic
	case total < 50000:
		return TierStandard
	case total < 150000:
		return TierPremium
	default:
		return TierEnterprise
	}
}

func indiaDuration(in Input) int {
	base := 60
	units := in.FurnaceCount
	if units < 1 {
		units = 1
	}
	return base + (units * 45)
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

func validate(in Input) error {
	if in.SquareFootage <= 0 {
		return errors.New("squareFootage must be greater than 0")
	}
	if in.FurnaceCount < 0 {
		return errors.New("furnaceCount cannot be negative")
	}
	if in.VentCount < 0 {
		return errors.New("ventCount cannot be negative")
	}
	return nil
}

func roundCents(v float64) float64 {
	return math.Round(v*100) / 100
}

func formatFurnaceLabel(n int) string {
	if n == 1 {
		return "Furnace / air handler (1 unit)"
	}
	return "Furnaces / air handlers (" + itoa(n) + " units)"
}

func formatVentLabel(extra int) string {
	return "Additional vents (" + itoa(extra) + " @ $8 each)"
}

func itoa(n int) string {
	b := make([]byte, 0, 10)
	if n == 0 {
		return "0"
	}
	for n > 0 {
		b = append([]byte{byte('0' + n%10)}, b...)
		n /= 10
	}
	return string(b)
}
