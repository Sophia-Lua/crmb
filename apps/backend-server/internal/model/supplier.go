package model

type SupplierOrder struct {
	BaseModel
	OrderNo     string  `gorm:"size:32;uniqueIndex" json:"orderNo"`
	SupplierID  string  `gorm:"size:64" json:"supplierId"`
	TotalAmount float64 `json:"totalAmount"`
	Status      string  `gorm:"size:16;default:pending" json:"status"`
}

type SupplierOrderItem struct {
	ID          string  `gorm:"primaryKey;size:64" json:"id"`
	OrderID     string  `gorm:"size:64;index" json:"orderId"`
	Sku         string  `gorm:"size:64" json:"sku"`
	ProductName string  `gorm:"size:128" json:"productName"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
}

type SupplierShipment struct {
	BaseModel
	OrderID      string `gorm:"size:64;index" json:"orderId"`
	ShipmentNo   string `gorm:"size:32" json:"shipmentNo"`
	LogisticsCompany string `gorm:"size:64" json:"logisticsCompany"`
	Status       string `gorm:"size:16;default:pending" json:"status"`
}

type SupplierReconciliation struct {
	BaseModel
	SupplierID string  `gorm:"size:64" json:"supplierId"`
	Period     string  `gorm:"size:20" json:"period"`
	TotalAmount float64 `json:"totalAmount"`
	Status     string  `gorm:"size:16;default:pending" json:"status"`
}