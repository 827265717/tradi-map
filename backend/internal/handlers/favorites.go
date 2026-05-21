package handlers

import (
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/songgeng/tradi-map/backend/internal/models"
	"gorm.io/gorm"
)

func ListFavorites(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.MustGet("userID").(uint)

		var favorites []models.Favorite
		db.Where("user_id = ?", userID).Find(&favorites)

		ids := make([]string, len(favorites))
		for i, f := range favorites {
			ids[i] = f.EntryID
		}
		c.JSON(http.StatusOK, gin.H{"favorites": ids})
	}
}

func AddFavorite(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.MustGet("userID").(uint)

		var req struct {
			EntryID string `json:"entry_id" binding:"required"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		fav := models.Favorite{UserID: userID, EntryID: req.EntryID}
		if err := db.Create(&fav).Error; err != nil {
			c.JSON(http.StatusConflict, gin.H{"error": "已收藏"})
			return
		}

		c.JSON(http.StatusCreated, fav)
	}
}

func RemoveFavorite(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.MustGet("userID").(uint)

		entryID, err := url.PathUnescape(c.Param("entry_id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "非法 entry_id"})
			return
		}

		result := db.Where("user_id = ? AND entry_id = ?", userID, entryID).Delete(&models.Favorite{})
		if result.RowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "收藏不存在"})
			return
		}

		c.Status(http.StatusNoContent)
	}
}
