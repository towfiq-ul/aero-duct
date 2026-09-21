package main

import (
	"log"
	"os"

	"github.com/aeroduct/api/internal/config"
	"github.com/aeroduct/api/internal/database"
	"github.com/aeroduct/api/internal/router"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env in development
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	cfg := config.Load()

	// Set Gin mode from environment
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.DebugMode)
	}

	// Initialize Database
	if _, err := database.Init(cfg.DatabaseURL); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Build and run the router
	r := router.New()

	port := cfg.Port
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 AeroDuct API starting on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
