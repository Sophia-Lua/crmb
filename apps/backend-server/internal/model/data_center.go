package model

type DCQuery struct {
	ID       string `gorm:"primaryKey;size:64" json:"id"`
	Module   string `gorm:"size:32" json:"module"`
	Metrics  string `gorm:"size:256" json:"metrics"`
	StartDate string `gorm:"size:20" json:"startDate"`
	EndDate  string `gorm:"size:20" json:"endDate"`
}

type DCRealtimeData struct {
	ID            string  `gorm:"primaryKey;size:64" json:"id"`
	CurrentSales  float64 `json:"currentSales"`
	CurrentOrders int     `json:"currentOrders"`
	ActiveUsers   int     `json:"activeUsers"`
	OnlineMerchants int   `json:"onlineMerchants"`
}

type DCSalesAnalysis struct {
	BaseModel
	TotalSales    float64 `json:"totalSales"`
	OrderCount    int     `json:"orderCount"`
	AvgOrderAmount float64 `json:"avgOrderAmount"`
}

type DCUserAnalysis struct {
	BaseModel
	TotalUsers    int     `json:"totalUsers"`
	NewUsers      int     `json:"newUsers"`
	ActiveUsers   int     `json:"activeUsers"`
}

type DCProductAnalysis struct {
	BaseModel
	TopProducts string `gorm:"type:text" json:"topProducts"`
}

type DCChannelAnalysis struct {
	BaseModel
	Channels string `gorm:"type:text" json:"channels"`
}

type DCReportTemplate struct {
	BaseModel
	Name string `gorm:"size:128" json:"name"`
	Type string `gorm:"size:16" json:"type"`
}

type DCReport struct {
	BaseModel
	TemplateID   string `gorm:"size:64" json:"templateId"`
	TemplateName string `gorm:"size:128" json:"templateName"`
	Type         string `gorm:"size:16" json:"type"`
	StartDate    string `gorm:"size:20" json:"startDate"`
	EndDate      string `gorm:"size:20" json:"endDate"`
	Status       string `gorm:"size:16;default:generating" json:"status"`
}

type DCAutoExportConfig struct {
	ID          string `gorm:"primaryKey;size:64" json:"id"`
	Enabled     bool   `gorm:"default:true" json:"enabled"`
	Frequency   string `gorm:"size:16;default:daily" json:"frequency"`
	Time        string `gorm:"size:10;default:08:00" json:"time"`
	Recipients  string `gorm:"size:256" json:"recipients"`
	Format      string `gorm:"size:16;default:excel" json:"format"`
	LastExportAt string `gorm:"size:30" json:"lastExportAt"`
}