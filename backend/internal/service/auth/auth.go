package auth

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/aeroduct/api/internal/config"
	"github.com/aeroduct/api/internal/database"
	"github.com/aeroduct/api/internal/model"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// GenerateToken creates a signed JWT for the given user.
func GenerateToken(user *model.Customer) (string, time.Time, error) {
	cfg := config.Load()
	expiresAt := time.Now().Add(24 * time.Hour)

	claims := &model.Claims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		Market: user.Market,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   user.ID,
			Issuer:    "aeroduct-api",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte(cfg.JWTSecret))
	if err != nil {
		return "", time.Time{}, fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenStr, expiresAt, nil
}

// Signup creates a new customer and returns an auth token.
func Signup(req model.SignupRequest) (*model.AuthResponse, error) {
	db := database.DB
	if db == nil {
		return nil, errors.New("database not initialized")
	}

	// Check if email already registered
	var existing string
	err := db.QueryRow("SELECT id FROM customers WHERE email = ?", req.Email).Scan(&existing)
	if err == nil {
		return nil, errors.New("email already in use")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	market := req.Market
	if market == "" {
		market = "chicago"
	}
	role := req.Role
	if role == "" {
		role = "customer"
	}

	user := model.Customer{
		ID:        uuid.New().String(),
		Email:     req.Email,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Phone:     req.Phone,
		Market:    market,
		Role:      role,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	_, err = db.Exec(`
		INSERT INTO customers (id, email, first_name, last_name, phone, market, password_hash, role, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, user.ID, user.Email, user.FirstName, user.LastName, user.Phone, user.Market, string(hash), user.Role, user.CreatedAt, user.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to persist user: %w", err)
	}

	token, expiresAt, err := GenerateToken(&user)
	if err != nil {
		return nil, err
	}

	return &model.AuthResponse{
		Token:     token,
		ExpiresAt: expiresAt,
		User:      user,
	}, nil
}

// Login authenticates an existing user by email and password.
func Login(req model.LoginRequest) (*model.AuthResponse, error) {
	db := database.DB
	if db == nil {
		return nil, errors.New("database not initialized")
	}

	var user model.Customer
	var passwordHash string

	row := db.QueryRow(`
		SELECT id, email, first_name, last_name, phone, market, password_hash, role, created_at, updated_at
		FROM customers WHERE email = ?
	`, req.Email)

	err := row.Scan(&user.ID, &user.Email, &user.FirstName, &user.LastName, &user.Phone, &user.Market, &passwordHash, &user.Role, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("invalid email or password")
		}
		return nil, fmt.Errorf("database query error: %w", err)
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid email or password")
	}

	token, expiresAt, err := GenerateToken(&user)
	if err != nil {
		return nil, err
	}

	return &model.AuthResponse{
		Token:     token,
		ExpiresAt: expiresAt,
		User:      user,
	}, nil
}
