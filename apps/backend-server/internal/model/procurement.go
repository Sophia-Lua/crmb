package model

type ProcSupplier struct {
	BaseModel
	Name              string `gorm:"size:128;not null" json:"name"`
	ContactName       string `gorm:"size:64" json:"contactName"`
	ContactPhone      string `gorm:"size:20" json:"contactPhone"`
	Address           string `gorm:"size:256" json:"address"`
	Category          string `gorm:"size:32" json:"category"`
	QualificationStatus string `gorm:"size:16;default:pending" json:"qualificationStatus"`
	Rating            string `gorm:"size:4;default:C" json:"rating"`
	BankAccount       string `gorm:"size:64" json:"bankAccount"`
	BankName          string `gorm:"size:64" json:"bankName"`
}

type PurchaseRequest struct {
	BaseModel
	RequestNo      string `gorm:"size:32;uniqueIndex" json:"requestNo"`
	ProductName    string `gorm:"size:128" json:"productName"`
	Sku            string `gorm:"size:64" json:"sku"`
	Quantity       int    `json:"quantity"`
	Unit           string `gorm:"size:16;default:kg" json:"unit"`
	RequesterID    string `gorm:"size:64" json:"requesterId"`
	RequesterName  string `gorm:"size:64" json:"requesterName"`
	ExpectedDate   string `gorm:"size:20" json:"expectedDate"`
	Reason         string `gorm:"size:256" json:"reason"`
	Status         string `gorm:"size:16;default:pending" json:"status"`
	ApprovedBy     string `gorm:"size:64" json:"approvedBy"`
	ApprovedAt     string `gorm:"size:30" json:"approvedAt"`
}

type PurchaseOrder struct {
	BaseModel
	OrderNo        string  `gorm:"size:32;uniqueIndex" json:"orderNo"`
	SupplierID     string  `gorm:"size:64" json:"supplierId"`
	SupplierName   string  `gorm:"size:128" json:"supplierName"`
	TotalAmount    float64 `json:"totalAmount"`
	DeliveryDate   string  `gorm:"size:20" json:"deliveryDate"`
	ApprovalStatus string  `gorm:"size:16;default:pending" json:"approvalStatus"`
	ApprovedBy     string  `gorm:"size:64" json:"approvedBy"`
	ApprovedAt     string  `gorm:"size:30" json:"approvedAt"`
	Status         string  `gorm:"size:16;default:pending" json:"status"`
}

type PurchaseOrderItem struct {
	ID          string  `gorm:"primaryKey;size:64" json:"id"`
	OrderID     string  `gorm:"size:64;index" json:"orderId"`
	Sku         string  `gorm:"size:64" json:"sku"`
	ProductName string  `gorm:"size:128" json:"productName"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
}

type PayableAccount struct {
	BaseModel
	SupplierID    string  `gorm:"size:64" json:"supplierId"`
	SupplierName  string  `gorm:"size:128" json:"supplierName"`
	Amount        float64 `json:"amount"`
	PaidAmount    float64 `json:"paidAmount"`
	Status        string  `gorm:"size:16;default:pending" json:"status"`
}

type ProcReconciliation struct {
	BaseModel
	ReconciliationNo string  `gorm:"size:32;uniqueIndex" json:"reconciliationNo"`
	SupplierID       string  `gorm:"size:64" json:"supplierId"`
	Period           string  `gorm:"size:20" json:"period"`
	TotalPurchaseAmount float64 `json:"totalPurchaseAmount"`
	TotalPaidAmount  float64 `json:"totalPaidAmount"`
	Difference       float64 `json:"difference"`
	Status           string  `gorm:"size:16;default:pending" json:"status"`
}

type ProcPaymentRequest struct {
	BaseModel
	PayableAccountID string  `gorm:"size:64" json:"payableAccountId"`
	Amount           float64 `json:"amount"`
	Payee            string  `gorm:"size:128" json:"payee"`
	Status           string  `gorm:"size:16;default:pending" json:"status"`
	ApprovedBy       string  `gorm:"size:64" json:"approvedBy"`
	ApprovedAt       string  `gorm:"size:30" json:"approvedAt"`
}