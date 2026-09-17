package config

import (
	"os"
	"strconv"
)

// Config holds all runtime configuration loaded from environment variables.
type Config struct {
	Port            string
	DatabaseURL     string
	AllowedOrigins  string
	JWTSecret       string
	AWSRegion       string
	AWSS3Bucket     string
	AWSAccessKey    string
	AWSSecretKey    string
	CloudFrontDomain string
	StripeSecretKey string
	StripeWebhookSecret string
	RazorpayKeyID   string
	RazorpaySecret  string
	SendGridAPIKey  string
	GinMode         string
}

// Load reads configuration from environment variables.
func Load() *Config {
	return &Config{
		Port:            getEnv("PORT", "8080"),
		DatabaseURL:     getEnv("DATABASE_URL", ""),
		AllowedOrigins:  getEnv("ALLOWED_ORIGINS", "http://localhost:3000"),
		JWTSecret:       getEnv("JWT_SECRET", "dev-secret-change-in-production"),
		AWSRegion:       getEnv("AWS_REGION", "us-east-1"),
		AWSS3Bucket:     getEnv("AWS_S3_BUCKET", ""),
		AWSAccessKey:    getEnv("AWS_ACCESS_KEY_ID", ""),
		AWSSecretKey:    getEnv("AWS_SECRET_ACCESS_KEY", ""),
		CloudFrontDomain: getEnv("CLOUDFRONT_DOMAIN", ""),
		StripeSecretKey: getEnv("STRIPE_SECRET_KEY", ""),
		StripeWebhookSecret: getEnv("STRIPE_WEBHOOK_SECRET", ""),
		RazorpayKeyID:   getEnv("RAZORPAY_KEY_ID", ""),
		RazorpaySecret:  getEnv("RAZORPAY_KEY_SECRET", ""),
		SendGridAPIKey:  getEnv("SENDGRID_API_KEY", ""),
		GinMode:         getEnv("GIN_MODE", "debug"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if i, err := strconv.Atoi(v); err == nil {
			return i
		}
	}
	return fallback
}
