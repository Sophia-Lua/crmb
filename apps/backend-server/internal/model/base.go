package model

import (
	"time"
)

type BaseModel struct {
	ID        string    `gorm:"primaryKey;size:64" json:"id"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}

type User struct {
	BaseModel
	Username   string `gorm:"size:64;uniqueIndex;not null" json:"username"`
	Password   string `gorm:"size:256;not null" json:"-"`
	Name       string `gorm:"size:64" json:"name"`
	Role       string `gorm:"size:32;not null" json:"role"`
	Department string `gorm:"size:64" json:"department"`
	Phone      string `gorm:"size:20" json:"phone"`
	Email      string `gorm:"size:128" json:"email"`
	Status     string `gorm:"size:16;default:active" json:"status"`
}