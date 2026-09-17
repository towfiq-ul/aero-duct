package pricing_test

import (
	"testing"

	"github.com/aeroduct/api/internal/pricing"
)

func TestChicagoResidentialBasic(t *testing.T) {
	result, err := pricing.Calculate(pricing.Input{
		Market:        pricing.MarketChicago,
		Category:      pricing.CategoryResidentialDuct,
		SquareFootage: 1200,
		FurnaceCount:  1,
		VentCount:     12,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.Currency != pricing.CurrencyUSD {
		t.Errorf("expected USD, got %s", result.Currency)
	}
	if result.TotalPrice <= 0 {
		t.Errorf("expected positive price, got %f", result.TotalPrice)
	}
	t.Logf("Chicago basic: $%.2f (%s) — %d min", result.TotalPrice, result.Tier, result.EstimatedDurationMinutes)
}

func TestChicagoWithDryerVent(t *testing.T) {
	result, err := pricing.Calculate(pricing.Input{
		Market:        pricing.MarketChicago,
		Category:      pricing.CategoryResidentialDuct,
		SquareFootage: 2500,
		FurnaceCount:  2,
		VentCount:     22,
		AddDryerVent:  true,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	// Should include dryer vent line item
	found := false
	for _, item := range result.LineItems {
		if item.Label == "Dryer vent cleaning" {
			found = true
			if item.Price != 79.0 {
				t.Errorf("expected dryer vent $79, got $%f", item.Price)
			}
		}
	}
	if !found {
		t.Error("dryer vent line item not found")
	}
	t.Logf("Chicago +dryer: $%.2f (%s)", result.TotalPrice, result.Tier)
}

func TestIndiaCommercialKitchen(t *testing.T) {
	result, err := pricing.Calculate(pricing.Input{
		Market:        pricing.MarketIndia,
		Category:      pricing.CategoryCommercialKitchen,
		SquareFootage: 3000,
		FurnaceCount:  4,
		VentCount:     0,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.Currency != pricing.CurrencyINR {
		t.Errorf("expected INR, got %s", result.Currency)
	}
	// 4 units * 4500 = 18000 < min charge 12000 — should be 18000
	if result.TotalPrice != 18000 {
		t.Errorf("expected 18000 INR, got %.2f", result.TotalPrice)
	}
	t.Logf("India kitchen: ₹%.2f (%s)", result.TotalPrice, result.Tier)
}

func TestIndiaMinimumCharge(t *testing.T) {
	result, err := pricing.Calculate(pricing.Input{
		Market:        pricing.MarketIndia,
		Category:      pricing.CategoryCorporateHVAC,
		SquareFootage: 1000,
		FurnaceCount:  1, // 1 * 3500 = 3500 < 12000 min
		VentCount:     0,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.TotalPrice != 12000 {
		t.Errorf("expected min charge 12000, got %.2f", result.TotalPrice)
	}
}

func TestValidationErrors(t *testing.T) {
	cases := []struct {
		name  string
		input pricing.Input
	}{
		{
			name: "zero square footage",
			input: pricing.Input{Market: pricing.MarketChicago, SquareFootage: 0, FurnaceCount: 1, VentCount: 10},
		},
		{
			name: "negative furnace count",
			input: pricing.Input{Market: pricing.MarketChicago, SquareFootage: 1000, FurnaceCount: -1, VentCount: 10},
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			_, err := pricing.Calculate(tc.input)
			if err == nil {
				t.Error("expected error, got nil")
			}
		})
	}
}
