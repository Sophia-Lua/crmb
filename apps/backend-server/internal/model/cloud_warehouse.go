package model

type CWInventory struct {
	BaseModel
	Sku          string  `gorm:"size:64;not null" json:"sku"`
	ProductName  string  `gorm:"size:128" json:"productName"`
	Quantity     int     `gorm:"default:0" json:"quantity"`
	Location     string  `gorm:"size:64" json:"location"`
	WarehouseID  string  `gorm:"size:64" json:"warehouseId"`
	Status       string  `gorm:"size:16;default:normal" json:"status"`
}

type CWInboundOrder struct {
	BaseModel
	OrderNo     string `gorm:"size:32;uniqueIndex" json:"orderNo"`
	Type        string `gorm:"size:16" json:"type"`
	WarehouseID string `gorm:"size:64" json:"warehouseId"`
	OperatorID  string `gorm:"size:64" json:"operatorId"`
	Status      string `gorm:"size:16;default:pending" json:"status"`
}

type CWInboundItem struct {
	ID         string `gorm:"primaryKey;size:64" json:"id"`
	OrderID    string `gorm:"size:64;index" json:"orderId"`
	Sku        string `gorm:"size:64" json:"sku"`
	ProductName string `gorm:"size:128" json:"productName"`
	Quantity   int    `json:"quantity"`
}

type CWOutboundOrder struct {
	BaseModel
	OrderNo     string `gorm:"size:32;uniqueIndex" json:"orderNo"`
	Type        string `gorm:"size:16" json:"type"`
	WarehouseID string `gorm:"size:64" json:"warehouseId"`
	OperatorID  string `gorm:"size:64" json:"operatorId"`
	Status      string `gorm:"size:16;default:pending" json:"status"`
}

type CWOutboundItem struct {
	ID          string `gorm:"primaryKey;size:64" json:"id"`
	OrderID     string `gorm:"size:64;index" json:"orderId"`
	Sku         string `gorm:"size:64" json:"sku"`
	ProductName string `gorm:"size:128" json:"productName"`
	Quantity    int    `json:"quantity"`
}

type CWInventoryCheck struct {
	BaseModel
	Sku            string `gorm:"size:64" json:"sku"`
	Location       string `gorm:"size:64" json:"location"`
	ActualQuantity int    `json:"actualQuantity"`
	SystemQuantity int    `json:"systemQuantity"`
	Difference     int    `json:"difference"`
	CheckedBy      string `gorm:"size:64" json:"checkedBy"`
}

type CWUnloadingTask struct {
	BaseModel
	SupplierID   string `gorm:"size:64" json:"supplierId"`
	SupplierName string `gorm:"size:128" json:"supplierName"`
	Status       string `gorm:"size:16;default:pending" json:"status"`
	PlannedTime  string `gorm:"size:30" json:"plannedTime"`
}

type CWUnloadingItem struct {
	ID          string `gorm:"primaryKey;size:64" json:"id"`
	TaskID      string `gorm:"size:64;index" json:"taskId"`
	Sku         string `gorm:"size:64" json:"sku"`
	ProductName string `gorm:"size:128" json:"productName"`
	Quantity    int    `json:"quantity"`
}