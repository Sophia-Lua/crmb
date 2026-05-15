package model

type FinTransaction struct {
	BaseModel
	Type        string  `gorm:"size:16;not null" json:"type"`
	Amount      float64 `json:"amount"`
	Description string  `gorm:"size:256" json:"description"`
	OrderNo     string  `gorm:"size:32" json:"orderNo"`
	Status      string  `gorm:"size:16;default:pending" json:"status"`
}

type FinReconciliation struct {
	BaseModel
	ReconciliationNo string  `gorm:"size:32;uniqueIndex" json:"reconciliationNo"`
	Type             string  `gorm:"size:16" json:"type"`
	Period           string  `gorm:"size:20" json:"period"`
	TotalAmount      float64 `json:"totalAmount"`
	Status           string  `gorm:"size:16;default:pending" json:"status"`
}

type FinReport struct {
	BaseModel
	ReportNo string  `gorm:"size:32;uniqueIndex" json:"reportNo"`
	Type     string  `gorm:"size:16" json:"type"`
	Period   string  `gorm:"size:16" json:"period"`
	Status   string  `gorm:"size:16;default:draft" json:"status"`
}

type FinReportData struct {
	ID            string `gorm:"primaryKey;size:64" json:"id"`
	ReportID      string `gorm:"size:64;index" json:"reportId"`
	TotalIncome   float64 `json:"totalIncome"`
	TotalExpense  float64 `json:"totalExpense"`
	NetProfit     float64 `json:"netProfit"`
	OrderCount    int    `json:"orderCount"`
	CustomerCount int    `json:"customerCount"`
}