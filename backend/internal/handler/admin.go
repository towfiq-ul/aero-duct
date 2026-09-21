package handler

import (
	"net/http"

	"github.com/aeroduct/api/internal/apierr"
	"github.com/aeroduct/api/internal/model"
	"github.com/aeroduct/api/internal/service/admin"
	"github.com/gin-gonic/gin"
)

// ── Settings ────────────────────────────────────────────────

func GetAdminSettings(c *gin.Context) {
	settings, err := admin.GetSettings()
	if err != nil {
		apierr.Internal(c, err)
		return
	}
	c.JSON(http.StatusOK, settings)
}

func UpdateAdminSettings(c *gin.Context) {
	var s model.AdminSettings
	if err := c.ShouldBindJSON(&s); err != nil {
		apierr.BadRequest(c, "Invalid settings payload")
		return
	}

	if err := admin.UpdateSettings(s); err != nil {
		apierr.Internal(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Admin settings saved successfully",
	})
}

// ── Service Areas ───────────────────────────────────────────

func GetAdminServiceAreas(c *gin.Context) {
	areas, err := admin.GetServiceAreas()
	if err != nil {
		apierr.Internal(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"serviceAreas": areas})
}

func SaveAdminServiceArea(c *gin.Context) {
	var a model.ServiceAreaAdmin
	if err := c.ShouldBindJSON(&a); err != nil {
		apierr.BadRequest(c, "Invalid service area payload")
		return
	}
	if err := admin.SaveServiceArea(a); err != nil {
		apierr.Internal(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

func DeleteAdminServiceArea(c *gin.Context) {
	id := c.Param("id")
	if err := admin.DeleteServiceArea(id); err != nil {
		apierr.Internal(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

// ── Services ────────────────────────────────────────────────

func GetAdminServices(c *gin.Context) {
	services, err := admin.GetServices()
	if err != nil {
		apierr.Internal(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"services": services})
}

func SaveAdminService(c *gin.Context) {
	var s model.ServiceAdmin
	if err := c.ShouldBindJSON(&s); err != nil {
		apierr.BadRequest(c, "Invalid service payload")
		return
	}
	if err := admin.SaveService(s); err != nil {
		apierr.Internal(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

func DeleteAdminService(c *gin.Context) {
	id := c.Param("id")
	if err := admin.DeleteService(id); err != nil {
		apierr.Internal(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

// ── FAQs ────────────────────────────────────────────────────

func GetAdminFAQs(c *gin.Context) {
	faqs, err := admin.GetFAQs()
	if err != nil {
		apierr.Internal(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"faqs": faqs})
}

func SaveAdminFAQ(c *gin.Context) {
	var f model.FAQItem
	if err := c.ShouldBindJSON(&f); err != nil {
		apierr.BadRequest(c, "Invalid FAQ payload")
		return
	}
	if err := admin.SaveFAQ(f); err != nil {
		apierr.Internal(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

func DeleteAdminFAQ(c *gin.Context) {
	id := c.Param("id")
	if err := admin.DeleteFAQ(id); err != nil {
		apierr.Internal(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}
