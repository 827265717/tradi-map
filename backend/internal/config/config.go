package config

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	DSN            string
	JWTSecret      string
	Port           string
	AllowedOrigins []string
}

func Load() *Config {
	// 开发环境加载 .env，生产环境若文件不存在则静默忽略
	_ = godotenv.Load()

	return &Config{
		DSN:            mustEnv("DATABASE_URL"),
		JWTSecret:      mustEnv("JWT_SECRET"),
		Port:           getEnv("PORT", "8080"),
		AllowedOrigins: strings.Split(getEnv("ALLOWED_ORIGINS", "http://localhost:5173"), ","),
	}
}

func mustEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("环境变量 %s 未设置", key)
	}
	return v
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
