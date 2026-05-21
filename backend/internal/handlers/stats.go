package handlers

import (
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/songgeng/tradi-map/backend/internal/models"
	"gorm.io/gorm"
)

func RecordView(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		entryID, err := url.PathUnescape(c.Param("entry_id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "非法 entry_id"})
			return
		}

		// 原子 upsert，避免读-改-写竞争
		db.Exec(`
			INSERT INTO entry_stats (entry_id, view_count, updated_at)
			VALUES (?, 1, NOW())
			ON CONFLICT (entry_id) DO UPDATE
			SET view_count = entry_stats.view_count + 1,
			    updated_at = NOW()
		`, entryID)

		var stat models.EntryStat
		db.First(&stat, "entry_id = ?", entryID)
		c.JSON(http.StatusOK, stat)
	}
}

func GetStats(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		entryID, err := url.PathUnescape(c.Param("entry_id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "非法 entry_id"})
			return
		}

		var stat models.EntryStat
		if err := db.First(&stat, "entry_id = ?", entryID).Error; err != nil {
			// 从未被浏览过，返回 0
			c.JSON(http.StatusOK, gin.H{"entry_id": entryID, "view_count": 0})
			return
		}
		c.JSON(http.StatusOK, stat)
	}
}
