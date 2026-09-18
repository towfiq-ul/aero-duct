package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Health godoc
// @Summary Health check
// @Description Returns service health and timestamp
// @Tags system
// @Produce json
// @Success 200 {object} map[string]any
// @Router /health [get]
func Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"service": "aeroduct-api",
		"time":    time.Now().UTC().Format(time.RFC3339),
	})
}
