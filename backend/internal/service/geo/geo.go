package geo

import (
	"strings"
)

type GeoMarket struct {
	Market            string   `json:"market"`
	City              string   `json:"city"`
	Country           string   `json:"country"`
	Currency          string   `json:"currency"`
	DefaultTaxRate    float64  `json:"defaultTaxRate"`
	SupportedServices []string `json:"supportedServices"`
}

// DetectMarket resolves the client geographic market based on IP and headers.
func DetectMarket(ip string, countryHeader string) GeoMarket {
	country := strings.ToUpper(strings.TrimSpace(countryHeader))

	if country == "IN" || country == "IND" {
		return GeoMarket{
			Market:         "india",
			City:           "National Commercial Market",
			Country:        "India",
			Currency:       "INR",
			DefaultTaxRate: 0.18,
			SupportedServices: []string{
				"commercial_kitchen",
				"hospital_hvac",
				"corporate_hvac",
				"robotic_duct",
			},
		}
	}

	// Default to Chicago, IL market (US)
	return GeoMarket{
		Market:         "chicago",
		City:           "Chicago",
		Country:        "USA",
		Currency:       "USD",
		DefaultTaxRate: 0.08,
		SupportedServices: []string{
			"residential_duct",
			"dryer_vent",
			"chimney_sweep",
			"uv_light_purification",
			"duct_sanitizing",
		},
	}
}
