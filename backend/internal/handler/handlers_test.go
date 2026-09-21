package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/aeroduct/api/internal/database"
	"github.com/aeroduct/api/internal/model"
	"github.com/aeroduct/api/internal/router"
	"github.com/gin-gonic/gin"
)

func setupTestRouter(t *testing.T) *gin.Engine {
	gin.SetMode(gin.TestMode)
	os.Setenv("JWT_SECRET", "test-secret-key-12345")

	// Use in-memory SQLite for testing
	_, err := database.Init("file::memory:?cache=shared")
	if err != nil {
		t.Fatalf("failed to init test database: %v", err)
	}

	return router.New()
}

func TestHealth(t *testing.T) {
	r := setupTestRouter(t)

	req, _ := http.NewRequest(http.MethodGet, "/health", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}
}

func TestCalculatePrice_Property(t *testing.T) {
	r := setupTestRouter(t)

	body := map[string]any{
		"market":        "chicago",
		"category":      "residential_duct",
		"squareFootage": 2400,
		"furnaceCount":  1,
		"ventCount":     15,
		"addDryerVent":  true,
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/pricing/calculate", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}

	var res map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed parsing response: %v", err)
	}

	totalPrice, ok := res["totalPrice"].(float64)
	if !ok || totalPrice <= 0 {
		t.Fatalf("expected positive totalPrice, got %v", res["totalPrice"])
	}
}

func TestCalculatePrice_Packages(t *testing.T) {
	r := setupTestRouter(t)

	body := map[string]any{
		"areaId":     "chicago",
		"serviceIds": []string{"res-air-duct", "res-dryer-vent"},
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/pricing/calculate", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}

	var res map[string]any
	_ = json.Unmarshal(w.Body.Bytes(), &res)
	if res["currency"] != "USD" {
		t.Errorf("expected USD, got %v", res["currency"])
	}
}

func TestGetAvailableSlots(t *testing.T) {
	r := setupTestRouter(t)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/bookings/slots?market=chicago", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var res map[string]any
	_ = json.Unmarshal(w.Body.Bytes(), &res)
	slots, ok := res["slots"].([]any)
	if !ok || len(slots) == 0 {
		t.Fatalf("expected seeded slots, got %v", res["slots"])
	}
}

func TestBookingFlow(t *testing.T) {
	r := setupTestRouter(t)

	bookingReq := model.CreateBookingRequest{
		CustomerName:    "Sarah Connor",
		Email:           "sarah.c@example.com",
		Phone:           "(312) 555-0199",
		Address:         "123 Tech Drive",
		City:            "Chicago",
		PostalCode:      "60601",
		SelectedPackage: "residential_duct",
		SquareFootage:   2100,
		FurnaceCount:    1,
		VentCount:       14,
	}
	jsonBody, _ := json.Marshal(bookingReq)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/bookings", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("expected status 201, got %d: %s", w.Code, w.Body.String())
	}

	var createRes struct {
		Booking model.Booking `json:"booking"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &createRes); err != nil {
		t.Fatalf("failed decoding booking response: %v", err)
	}

	bookingID := createRes.Booking.ID
	if bookingID == "" {
		t.Fatalf("expected non-empty booking ID")
	}

	// Lookup booking by ID
	lookupReq, _ := http.NewRequest(http.MethodGet, "/api/v1/bookings/"+bookingID, nil)
	lookupW := httptest.NewRecorder()
	r.ServeHTTP(lookupW, lookupReq)

	if lookupW.Code != http.StatusOK {
		t.Fatalf("expected status 200 on lookup, got %d", lookupW.Code)
	}
}

func TestDetectGeo(t *testing.T) {
	r := setupTestRouter(t)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/geo/detect", nil)
	req.Header.Set("CF-IPCountry", "US")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var res map[string]any
	_ = json.Unmarshal(w.Body.Bytes(), &res)
	if res["market"] != "chicago" {
		t.Errorf("expected chicago market, got %v", res["market"])
	}
}

func TestGetPassport(t *testing.T) {
	r := setupTestRouter(t)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/passport/AD-99120", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var p model.DuctPassport
	if err := json.Unmarshal(w.Body.Bytes(), &p); err != nil {
		t.Fatalf("failed parsing passport: %v", err)
	}
	if p.AirQualityRating != "A+" {
		t.Errorf("expected A+ rating, got %s", p.AirQualityRating)
	}
}

func TestTechnicianChecklist(t *testing.T) {
	r := setupTestRouter(t)

	submission := model.ChecklistSubmissionRequest{
		TechnicianID:         "tech-8891",
		CfmPreClean:          780,
		CfmPostClean:         1220,
		SystemModel:          "Trane 4.0-Ton",
		ParticulateReduction: 94.5,
		InspectionNotes:      "Field test checklist complete.",
	}
	jsonBody, _ := json.Marshal(submission)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/technician/checklist/b-test-99", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestAuthFlow(t *testing.T) {
	r := setupTestRouter(t)

	// 1. Signup
	signupReq := model.SignupRequest{
		FirstName: "John",
		LastName:  "Doe",
		Email:     "john.auth@example.com",
		Password:  "SecretPass123!",
		Phone:     "312-555-0188",
	}
	signupJSON, _ := json.Marshal(signupReq)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/signup", bytes.NewBuffer(signupJSON))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("expected status 201 on signup, got %d: %s", w.Code, w.Body.String())
	}

	// 2. Login
	loginReq := model.LoginRequest{
		Email:    "john.auth@example.com",
		Password: "SecretPass123!",
	}
	loginJSON, _ := json.Marshal(loginReq)

	loginHttpReq, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewBuffer(loginJSON))
	loginHttpReq.Header.Set("Content-Type", "application/json")
	loginW := httptest.NewRecorder()
	r.ServeHTTP(loginW, loginHttpReq)

	if loginW.Code != http.StatusOK {
		t.Fatalf("expected status 200 on login, got %d: %s", loginW.Code, loginW.Body.String())
	}

	var authRes model.AuthResponse
	if err := json.Unmarshal(loginW.Body.Bytes(), &authRes); err != nil {
		t.Fatalf("failed unmarshaling auth response: %v", err)
	}

	if authRes.Token == "" {
		t.Fatalf("expected valid JWT token")
	}
}

func TestPaymentIntent(t *testing.T) {
	r := setupTestRouter(t)

	body := map[string]any{
		"bookingId": "b-test-1234",
		"amount":    349.50,
		"currency":  "USD",
		"method":    "card",
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/payments/intent", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}

	var res map[string]any
	_ = json.Unmarshal(w.Body.Bytes(), &res)
	if res["clientSecret"] == "" {
		t.Fatalf("expected clientSecret in response")
	}
}
