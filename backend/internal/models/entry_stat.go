package models

import "time"

type EntryStat struct {
	EntryID   string    `json:"entry_id"   gorm:"primaryKey"`
	ViewCount int64     `json:"view_count" gorm:"not null;default:0"`
	UpdatedAt time.Time `json:"updated_at"`
}
