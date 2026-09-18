// Package apierr defines standard API error codes and response helpers.
package apierr

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ErrorCode represents a machine-readable API error code.
type ErrorCode string

const (
	ErrBadRequest       ErrorCode = "BAD_REQUEST"
	ErrValidation       ErrorCode = "VALIDATION_ERROR"
	ErrNotFound         ErrorCode = "NOT_FOUND"
	ErrUnauthorized     ErrorCode = "UNAUTHORIZED"
	ErrForbidden        ErrorCode = "FORBIDDEN"
	ErrConflict         ErrorCode = "CONFLICT"
	ErrInternal         ErrorCode = "INTERNAL_SERVER_ERROR"
	ErrServiceUnavailable ErrorCode = "SERVICE_UNAVAILABLE"
)

// APIError represents a structured API error response.
type APIError struct {
	Code    ErrorCode         `json:"code"`
	Message string            `json:"message"`
	Details map[string][]string `json:"details,omitempty"`
}

// respond writes a JSON error response.
func respond(c *gin.Context, status int, code ErrorCode, message string, details ...map[string][]string) {
	body := APIError{Code: code, Message: message}
	if len(details) > 0 {
		body.Details = details[0]
	}
	c.AbortWithStatusJSON(status, gin.H{"error": body})
}

// BadRequest writes a 400 response.
func BadRequest(c *gin.Context, message string) {
	respond(c, http.StatusBadRequest, ErrBadRequest, message)
}

// Validation writes a 400 response with field-level details.
func Validation(c *gin.Context, details map[string][]string) {
	respond(c, http.StatusBadRequest, ErrValidation, "Validation failed", details)
}

// NotFound writes a 404 response.
func NotFound(c *gin.Context, message string) {
	respond(c, http.StatusNotFound, ErrNotFound, message)
}

// Unauthorized writes a 401 response.
func Unauthorized(c *gin.Context) {
	respond(c, http.StatusUnauthorized, ErrUnauthorized, "Authentication required")
}

// Forbidden writes a 403 response.
func Forbidden(c *gin.Context) {
	respond(c, http.StatusForbidden, ErrForbidden, "Access denied")
}

// Conflict writes a 409 response.
func Conflict(c *gin.Context, message string) {
	respond(c, http.StatusConflict, ErrConflict, message)
}

// Internal writes a 500 response.
func Internal(c *gin.Context, err error) {
	// In production, don't leak error details
	respond(c, http.StatusInternalServerError, ErrInternal, "An unexpected error occurred")
}

// OK writes a 200 JSON response with data envelope.
func OK(c *gin.Context, data any) {
	c.JSON(http.StatusOK, gin.H{"data": data})
}

// Created writes a 201 JSON response.
func Created(c *gin.Context, data any) {
	c.JSON(http.StatusCreated, gin.H{"data": data})
}

// Paginated writes a 200 JSON response with pagination metadata.
func Paginated(c *gin.Context, data any, page, pageSize, total int) {
	totalPages := total / pageSize
	if total%pageSize != 0 {
		totalPages++
	}
	c.JSON(http.StatusOK, gin.H{
		"data": data,
		"pagination": gin.H{
			"page":       page,
			"pageSize":   pageSize,
			"total":      total,
			"totalPages": totalPages,
		},
	})
}
