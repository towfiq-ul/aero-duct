package middleware

import (
	"strings"

	"github.com/aeroduct/api/internal/apierr"
	"github.com/aeroduct/api/internal/config"
	"github.com/aeroduct/api/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// AuthRequired validates the JWT bearer token from the Authorization header.
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			apierr.Unauthorized(c)
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			apierr.Unauthorized(c)
			return
		}

		tokenStr := parts[1]
		cfg := config.Load()

		claims := &model.Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			apierr.Unauthorized(c)
			return
		}

		c.Set("claims", claims)
		c.Set("userId", claims.UserID)
		c.Set("role", claims.Role)
		c.Next()
	}
}

// RequireRole ensures the authenticated caller has one of the required roles.
func RequireRole(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleVal, exists := c.Get("role")
		if !exists {
			apierr.Forbidden(c)
			return
		}

		role, ok := roleVal.(string)
		if !ok {
			apierr.Forbidden(c)
			return
		}

		for _, r := range allowedRoles {
			if r == role {
				c.Next()
				return
			}
		}

		apierr.Forbidden(c)
	}
}
