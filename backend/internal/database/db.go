package database

import (
	"github.com/songgeng/tradi-map/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	err = db.AutoMigrate(
		&models.User{},
		&models.Favorite{},
		&models.EntryStat{},
	)
	return db, err
}
