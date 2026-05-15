package model

type DDRoute struct {
	BaseModel
	Name             string `gorm:"size:128" json:"name"`
	DeliveryPersonID string `gorm:"size:64" json:"deliveryPersonId"`
	DeliveryPersonName string `gorm:"size:64" json:"deliveryPersonName"`
	EstimatedTime    int    `json:"estimatedTime"`
	Status           string `gorm:"size:16;default:active" json:"status"`
}

type DDRouteStation struct {
	ID        string `gorm:"primaryKey;size:64" json:"id"`
	RouteID   string `gorm:"size:64;index" json:"routeId"`
	StationID string `gorm:"size:64" json:"stationId"`
	SortOrder int    `json:"sortOrder"`
}

type DDStation struct {
	BaseModel
	Name      string  `gorm:"size:128" json:"name"`
	Address   string  `gorm:"size:256" json:"address"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	SortOrder int     `gorm:"default:1" json:"sortOrder"`
	Status    string  `gorm:"size:16;default:active" json:"status"`
}

type DDDeliveryTask struct {
	BaseModel
	RouteID           string `gorm:"size:64" json:"routeId"`
	DeliveryPersonID  string `gorm:"size:64" json:"deliveryPersonId"`
	DeliveryPersonName string `gorm:"size:64" json:"deliveryPersonName"`
	Status            string `gorm:"size:16;default:pending" json:"status"`
	CompletedTime     string `gorm:"size:30" json:"completedTime"`
}

type DDDeliveryTaskItem struct {
	ID        string `gorm:"primaryKey;size:64" json:"id"`
	TaskID    string `gorm:"size:64;index" json:"taskId"`
	StationID string `gorm:"size:64" json:"stationId"`
	OrderID   string `gorm:"size:64" json:"orderId"`
	Status    string `gorm:"size:16;default:pending" json:"status"`
}

type DDTrackPoint struct {
	ID        string  `gorm:"primaryKey;size:64" json:"id"`
	TaskID    string  `gorm:"size:64;index" json:"taskId"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type DDException struct {
	BaseModel
	TaskID        string `gorm:"size:64;index" json:"taskId"`
	ExceptionType string `gorm:"size:32" json:"exceptionType"`
	Description   string `gorm:"size:256" json:"description"`
}