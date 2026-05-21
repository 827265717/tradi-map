package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/songgeng/tradi-map/backend/internal/config"
	"github.com/songgeng/tradi-map/backend/internal/database"
	"github.com/songgeng/tradi-map/backend/internal/handlers"
	"github.com/songgeng/tradi-map/backend/internal/middleware"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg.DSN)
	if err != nil {
		log.Fatalf("数据库连接失败: %v", err)
	}

	r := gin.Default()

	// CORS 必须在路由注册前挂载
	r.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.AllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})

		v1.POST("/register", handlers.Register(db, cfg.JWTSecret))
		v1.POST("/login", handlers.Login(db, cfg.JWTSecret))

		auth := v1.Group("/", middleware.AuthRequired(cfg.JWTSecret))
		{
			auth.GET("/favorites", handlers.ListFavorites(db))
			auth.POST("/favorites", handlers.AddFavorite(db))
			auth.DELETE("/favorites/:entry_id", handlers.RemoveFavorite(db))
		}

		v1.POST("/entries/:entry_id/view", handlers.RecordView(db))
		v1.GET("/entries/:entry_id/stats", handlers.GetStats(db))
	}

	log.Printf("服务启动在 :%s", cfg.Port)
	r.Run(":" + cfg.Port)
}
