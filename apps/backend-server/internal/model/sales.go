package model

type Visit struct {
	BaseModel
	CustomerID   string `gorm:"size:64;not null" json:"customerId"`
	CustomerName string `gorm:"size:128;not null" json:"customerName"`
	CustomerType string `gorm:"size:16;not null" json:"customerType"`
	VisitType    string `gorm:"size:16;not null" json:"visitType"`
	VisitMethod  string `gorm:"size:16;not null" json:"visitMethod"`
	PlanDate     string `gorm:"size:20;not null" json:"planDate"`
	PlanTime     string `gorm:"size:10" json:"planTime"`
	Subject      string `gorm:"size:256;not null" json:"subject"`
	Content      string `gorm:"type:text" json:"content"`
	Feedback     string `gorm:"type:text" json:"feedback"`
	FollowUpPlan string `gorm:"type:text" json:"followUpPlan"`
	Status       string `gorm:"size:16;default:pending" json:"status"`
	CreatedBy    string `gorm:"size:64" json:"createdBy"`
}

type VisitImage struct {
	ID    string `gorm:"primaryKey;size:64" json:"id"`
	URL   string `gorm:"size:512" json:"url"`
	Name  string `gorm:"size:128" json:"name"`
	Size  int64  `json:"size"`
	Type  string `gorm:"size:64" json:"type"`
	VisitID string `gorm:"size:64;index" json:"visitId"`
}

type Store struct {
	BaseModel
	StoreName    string `gorm:"size:128;not null" json:"storeName"`
	StoreType    string `gorm:"size:32;not null" json:"storeType"`
	Address      string `gorm:"size:256" json:"address"`
	Province     string `gorm:"size:32" json:"province"`
	City         string `gorm:"size:32" json:"city"`
	District     string `gorm:"size:32" json:"district"`
	Latitude     float64 `json:"latitude"`
	Longitude    float64 `json:"longitude"`
	Area         float64 `json:"area"`
	ContactName  string `gorm:"size:64" json:"contactName"`
	ContactPhone string `gorm:"size:20" json:"contactPhone"`
	Status       string `gorm:"size:16;default:unclaimed" json:"status"`
	ClaimBy      string `gorm:"size:64" json:"claimBy"`
	ClaimedAt    string `gorm:"size:30" json:"claimedAt"`
	AssignedTo   string `gorm:"size:64" json:"assignedTo"`
	AssignedAt   string `gorm:"size:30" json:"assignedAt"`
	ReviewBy     string `gorm:"size:64" json:"reviewBy"`
	ReviewedAt   string `gorm:"size:30" json:"reviewedAt"`
	RejectReason string `gorm:"size:256" json:"rejectReason"`
}

type StoreLicense struct {
	ID        string `gorm:"primaryKey;size:64" json:"id"`
	URL       string `gorm:"size:512" json:"url"`
	Name      string `gorm:"size:128" json:"name"`
	Type      string `gorm:"size:64" json:"type"`
	ExpiryDate string `gorm:"size:20" json:"expiryDate"`
	StoreID   string `gorm:"size:64;index" json:"storeId"`
}

type Customer struct {
	BaseModel
	CustomerName   string `gorm:"size:128;not null" json:"customerName"`
	CustomerType   string `gorm:"size:16;default:public" json:"customerType"`
	StoreType      string `gorm:"size:32" json:"storeType"`
	Address        string `gorm:"size:256" json:"address"`
	Province       string `gorm:"size:32" json:"province"`
	City           string `gorm:"size:32" json:"city"`
	District       string `gorm:"size:32" json:"district"`
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
	Area           float64 `json:"area"`
	ContactName    string `gorm:"size:64" json:"contactName"`
	ContactPhone   string `gorm:"size:20" json:"contactPhone"`
	BusinessHours  string `gorm:"size:64" json:"businessHours"`
	Grade          string `gorm:"size:4" json:"grade"`
	AssignedTo     string `gorm:"size:64" json:"assignedTo"`
	LastVisitDate  string `gorm:"size:20" json:"lastVisitDate"`
	TotalOrderAmount float64 `json:"totalOrderAmount"`
	Status         string `gorm:"size:16;default:active" json:"status"`
}

type SpecialStockRequest struct {
	BaseModel
	RequestID    string `gorm:"size:64;not null" json:"requestId"`
	CustomerID   string `gorm:"size:64;not null" json:"customerId"`
	CustomerName string `gorm:"size:128" json:"customerName"`
	ProductName  string `gorm:"size:128" json:"productName"`
	Sku          string `gorm:"size:64" json:"sku"`
	Quantity     int    `json:"quantity"`
	Reason       string `gorm:"size:256" json:"reason"`
	Status       string `gorm:"size:16;default:pending" json:"status"`
	ApprovedBy   string `gorm:"size:64" json:"approvedBy"`
	FulfilledBy  string `gorm:"size:64" json:"fulfilledBy"`
}

type BlacklistCustomer struct {
	ID            string `gorm:"primaryKey;size:64" json:"id"`
	CustomerID    string `gorm:"size:64;not null" json:"customerId"`
	CustomerName  string `gorm:"size:128;not null" json:"customerName"`
	Reason        string `gorm:"size:256;not null" json:"reason"`
	BlacklistedBy string `gorm:"size:64" json:"blacklistedBy"`
	BlacklistedAt string `gorm:"size:30" json:"blacklistedAt"`
	Notes         string `gorm:"size:256" json:"notes"`
}