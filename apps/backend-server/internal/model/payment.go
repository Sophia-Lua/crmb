package model

type PayMerchant struct {
	BaseModel
	Name             string  `gorm:"size:128;not null" json:"name"`
	ContactName      string  `gorm:"size:64" json:"contactName"`
	ContactPhone     string  `gorm:"size:20" json:"contactPhone"`
	FeeRate          float64 `json:"feeRate"`
	SettlementAccount string `gorm:"size:64" json:"settlementAccount"`
	SettlementBank   string  `gorm:"size:64" json:"settlementBank"`
	Status           string  `gorm:"size:16;default:pending" json:"status"`
}

type PayReceipt struct {
	BaseModel
	MerchantID  string  `gorm:"size:64" json:"merchantId"`
	Amount      float64 `json:"amount"`
	PayMethod   string  `gorm:"size:16" json:"payMethod"`
	Status      string  `gorm:"size:16;default:pending" json:"status"`
	AbnormalReason string `gorm:"size:256" json:"abnormalReason"`
	ProcessResult string `gorm:"size:256" json:"processResult"`
}

type PaySettlementConfig struct {
	ID          string `gorm:"primaryKey;size:64" json:"id"`
	Frequency   string `gorm:"size:16" json:"frequency"`
	Time        string `gorm:"size:10" json:"time"`
	MinAmount   float64 `json:"minAmount"`
}

type PaySettlementReport struct {
	BaseModel
	MerchantID  string  `gorm:"size:64" json:"merchantId"`
	Amount      float64 `json:"amount"`
	Status      string  `gorm:"size:16;default:pending" json:"status"`
}