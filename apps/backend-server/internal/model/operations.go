package model

type OpsProduct struct {
	BaseModel
	Sku          string  `gorm:"size:64" json:"sku"`
	Name         string  `gorm:"size:128;not null" json:"name"`
	CategoryID   string  `gorm:"size:64" json:"categoryId"`
	CategoryName string  `gorm:"size:64" json:"categoryName"`
	Price        float64 `json:"price"`
	VipPrice     float64 `json:"vipPrice"`
	Stock        int     `json:"stock"`
	Status       string  `gorm:"size:16;default:off_sale" json:"status"`
	Image        string  `gorm:"size:512" json:"image"`
}

type OpsCategory struct {
	BaseModel
	Name      string `gorm:"size:64;not null" json:"name"`
	ParentID  string `gorm:"size:64" json:"parentId"`
	Level     int    `gorm:"default:1" json:"level"`
	Icon      string `gorm:"size:256" json:"icon"`
	SortOrder int    `gorm:"default:0" json:"sortOrder"`
	Status    string `gorm:"size:16;default:active" json:"status"`
}

type OpsPromotion struct {
	BaseModel
	Name               string `gorm:"size:128" json:"name"`
	Type               string `gorm:"size:16" json:"type"`
	Rule               string `gorm:"size:256" json:"rule"`
	StartDate          string `gorm:"size:20" json:"startDate"`
	EndDate            string `gorm:"size:20" json:"endDate"`
	Status             string `gorm:"size:16;default:upcoming" json:"status"`
}

type OpsPromotionCategory struct {
	ID           string `gorm:"primaryKey;size:64" json:"id"`
	PromotionID  string `gorm:"size:64;index" json:"promotionId"`
	CategoryID   string `gorm:"size:64" json:"categoryId"`
}

type OpsCoupon struct {
	BaseModel
	Name       string  `gorm:"size:128" json:"name"`
	Type       string  `gorm:"size:16" json:"type"`
	Amount     float64 `json:"amount"`
	MinPurchase float64 `json:"minPurchase"`
	ValidFrom  string  `gorm:"size:20" json:"validFrom"`
	ValidTo    string  `gorm:"size:20" json:"validTo"`
	TotalCount int     `gorm:"default:100" json:"totalCount"`
	UsedCount  int     `gorm:"default:0" json:"usedCount"`
	Status     string  `gorm:"size:16;default:active" json:"status"`
}

type OpsSeckillConfig struct {
	ID                string `gorm:"primaryKey;size:64" json:"id"`
	Enabled           bool   `gorm:"default:true" json:"enabled"`
	StartTime         string `gorm:"size:10" json:"startTime"`
	EndTime           string `gorm:"size:10" json:"endTime"`
	MaxQuantityPerUser int    `gorm:"default:3" json:"maxQuantityPerUser"`
}

type OpsSeckillProduct struct {
	ID          string  `gorm:"primaryKey;size:64" json:"id"`
	ConfigID    string  `gorm:"size:64;index" json:"configId"`
	Sku         string  `gorm:"size:64" json:"sku"`
	SeckillPrice float64 `json:"seckillPrice"`
	TotalStock   int     `json:"totalStock"`
}

type OpsMerchantApplication struct {
	BaseModel
	MerchantName    string `gorm:"size:128" json:"merchantName"`
	ContactName     string `gorm:"size:64" json:"contactName"`
	ContactPhone    string `gorm:"size:20" json:"contactPhone"`
	ReviewStatus    string `gorm:"size:16;default:pending" json:"reviewStatus"`
	ReviewedBy      string `gorm:"size:64" json:"reviewedBy"`
	ReviewedAt      string `gorm:"size:30" json:"reviewedAt"`
	ReviewRemark    string `gorm:"size:256" json:"reviewRemark"`
}