package models

import "time"

type Favorite struct {
	ID        uint      `json:"id"         gorm:"primaryKey"`
	UserID    uint      `json:"user_id"    gorm:"uniqueIndex:idx_user_entry;not null"`
	EntryID   string    `json:"entry_id"   gorm:"uniqueIndex:idx_user_entry;not null"`
	CreatedAt time.Time `json:"created_at"`
}
