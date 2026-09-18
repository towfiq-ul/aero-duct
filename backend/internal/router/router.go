package router

import (
	"github.com/aeroduct/api/internal/handler"
	"github.com/aeroduct/api/internal/middleware"
	"github.com/gin-gonic/gin"
)

// New creates and configures the main Gin router.
func New() *gin.Engine {
	r := gin.New()

	// Global middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.CORS())
	r.Use(middleware.RequestID())

	// Health check (no versioning)
	r.GET("/health", handler.Health)

	// API v1
	v1 := r.Group("/api/v1")
	{
		// Pricing
		pricing := v1.Group("/pricing")
		{
			pricing.POST("/calculate", handler.CalculatePrice)
		}

		// Bookings
		bookings := v1.Group("/bookings")
		{
			bookings.GET("/slots", handler.GetAvailableSlots)
			bookings.POST("", handler.CreateBooking)
			bookings.GET("/:id", handler.GetBooking)
		}

		// Geo
		geo := v1.Group("/geo")
		{
			geo.GET("/detect", handler.DetectGeo)
		}

		// Passport (Digital Duct Health Passport™)
		passport := v1.Group("/passport")
		{
			passport.GET("/:id", handler.GetPassport)
		}

		// Technician (internal / PWA)
		tech := v1.Group("/technician")
		{
			tech.GET("/dispatch/:technicianId", handler.GetDispatchRoute)
			tech.POST("/checklist/:bookingId", handler.SubmitChecklist)
		}
	}

	return r
}
