package model

type Product struct {
	BaseModel
	Sku          string  `gorm:"size:64;uniqueIndex;not null" json:"sku"`
	Name         string  `gorm:"size:128;not null" json:"name"`
	CategoryID   string  `gorm:"size:64" json:"categoryId"`
	CategoryName string  `gorm:"size:64" json:"categoryName"`
	Price        float64 `gorm:"not null" json:"price"`
	VipPrice     float64 `json:"vipPrice"`
	SuperVipPrice float64 `json:"superVipPrice"`
	Stock        int     `gorm:"default:0" json:"stock"`
	Status       string  `gorm:"size:16;default:on_sale" json:"status"`
	SalesCount   int     `gorm:"default:0" json:"salesCount"`
	Description  string  `gorm:"type:text" json:"description"`
}

type ProductImage struct {
	ID        string `gorm:"primaryKey;size:64" json:"id"`
	URL       string `gorm:"size:512" json:"url"`
	ProductID string `gorm:"size:64;index" json:"productId"`
	SortOrder int    `json:"sortOrder"`
}

type ProductTag struct {
	ID        string `gorm:"primaryKey;size:64" json:"id"`
	Tag       string `gorm:"size:32" json:"tag"`
	ProductID string `gorm:"size:64;index" json:"productId"`
}

type Category struct {
	BaseModel
	Code       string `gorm:"size:32;uniqueIndex" json:"code"`
	Name       string `gorm:"size:64;not null" json:"name"`
	ParentID   string `gorm:"size:64" json:"parentId"`
	Icon       string `gorm:"size:256" json:"icon"`
	SortOrder  int    `gorm:"default:0" json:"sortOrder"`
	Status     string `gorm:"size:16;default:active" json:"status"`
}

type Cart struct {
	BaseModel
	UserID        string `gorm:"size:64;not null;uniqueIndex" json:"userId"`
	TotalAmount   float64 `json:"totalAmount"`
}

type CartItem struct {
	ID          string  `gorm:"primaryKey;size:64" json:"id"`
	CartID      string  `gorm:"size:64;index" json:"cartId"`
	ProductID   string  `gorm:"size:64" json:"productId"`
	Sku         string  `gorm:"size:64" json:"sku"`
	ProductName string  `gorm:"size:128" json:"productName"`
	Image       string  `gorm:"size:512" json:"image"`
	Price       float64 `json:"price"`
	Quantity    int     `json:"quantity"`
	Selected    bool    `gorm:"default:true" json:"selected"`
}

type Order struct {
	BaseModel
	OrderNo         string  `gorm:"size:32;uniqueIndex;not null" json:"orderNo"`
	UserID          string  `gorm:"size:64;not null" json:"userId"`
	TotalAmount     float64 `json:"totalAmount"`
	DiscountAmount  float64 `json:"discountAmount"`
	Freight         float64 `json:"freight"`
	PayAmount       float64 `json:"payAmount"`
	Status          string  `gorm:"size:16;default:pending" json:"status"`
	PayType         string  `gorm:"size:16" json:"payType"`
	PayTime         string  `gorm:"size:30" json:"payTime"`
	CouponID        string  `gorm:"size:64" json:"couponId"`
	CouponDiscount  float64 `json:"couponDiscount"`
	Remark          string  `gorm:"size:256" json:"remark"`
	PaidAt          string  `gorm:"size:30" json:"paidAt"`
	ShippedAt       string  `gorm:"size:30" json:"shippedAt"`
	DeliveredAt     string  `gorm:"size:30" json:"deliveredAt"`
	CompletedAt     string  `gorm:"size:30" json:"completedAt"`
}

type OrderItem struct {
	ID          string  `gorm:"primaryKey;size:64" json:"id"`
	OrderID     string  `gorm:"size:64;index" json:"orderId"`
	ProductID   string  `gorm:"size:64" json:"productId"`
	Sku         string  `gorm:"size:64" json:"sku"`
	ProductName string  `gorm:"size:128" json:"productName"`
	Image       string  `gorm:"size:512" json:"image"`
	Price       float64 `json:"price"`
	Quantity    int     `json:"quantity"`
}

type ShippingAddress struct {
	ID        string `gorm:"primaryKey;size:64" json:"id"`
	OrderID   string `gorm:"size:64;index" json:"orderId"`
	Name      string `gorm:"size:64" json:"name"`
	Phone     string `gorm:"size:20" json:"phone"`
	Province  string `gorm:"size:32" json:"province"`
	City      string `gorm:"size:32" json:"city"`
	District  string `gorm:"size:32" json:"district"`
	Address   string `gorm:"size:256" json:"address"`
	IsDefault bool   `gorm:"default:false" json:"isDefault"`
}

type AfterSale struct {
	BaseModel
	AfterSaleNo string  `gorm:"size:32;uniqueIndex" json:"afterSaleNo"`
	OrderID     string  `gorm:"size:64" json:"orderId"`
	OrderNo     string  `gorm:"size:32" json:"orderNo"`
	Type        string  `gorm:"size:16" json:"type"`
	Reason      string  `gorm:"size:256" json:"reason"`
	Description string  `gorm:"type:text" json:"description"`
	Status      string  `gorm:"size:16;default:pending" json:"status"`
	RefundAmount float64 `json:"refundAmount"`
}

type AfterSaleImage struct {
	ID          string `gorm:"primaryKey;size:64" json:"id"`
	URL         string `gorm:"size:512" json:"url"`
	AfterSaleID string `gorm:"size:64;index" json:"afterSaleId"`
}

type VipPackage struct {
	BaseModel
	Name         string  `gorm:"size:64;not null" json:"name"`
	Level        string  `gorm:"size:16;not null" json:"level"`
	Price        float64 `json:"price"`
	OriginalPrice float64 `json:"originalPrice"`
	Duration     int     `json:"duration"`
	Status       string  `gorm:"size:16;default:active" json:"status"`
}

type VipPackageBenefit struct {
	ID          string `gorm:"primaryKey;size:64" json:"id"`
	Benefit     string `gorm:"size:128" json:"benefit"`
	PackageID   string `gorm:"size:64;index" json:"packageId"`
}

type UserVip struct {
	ID        string `gorm:"primaryKey;size:64" json:"id"`
	UserID    string `gorm:"size:64;not null;uniqueIndex" json:"userId"`
	Level     string `gorm:"size:16" json:"level"`
	StartDate string `gorm:"size:30" json:"startDate"`
	EndDate   string `gorm:"size:30" json:"endDate"`
	AutoRenew bool   `gorm:"default:false" json:"autoRenew"`
}

type Banner struct {
	BaseModel
	ImageUrl   string `gorm:"size:512" json:"imageUrl"`
	LinkUrl    string `gorm:"size:512" json:"linkUrl"`
	SortOrder  int    `gorm:"default:0" json:"sortOrder"`
	Status     string `gorm:"size:16;default:active" json:"status"`
}

type Announcement struct {
	BaseModel
	Title      string `gorm:"size:128" json:"title"`
	Content    string `gorm:"type:text" json:"content"`
	Type       string `gorm:"size:16" json:"type"`
	Status     string `gorm:"size:16;default:draft" json:"status"`
	PublishAt  string `gorm:"size:30" json:"publishAt"`
}

type Feedback struct {
	BaseModel
	UserID     string `gorm:"size:64" json:"userId"`
	UserName   string `gorm:"size:64" json:"userName"`
	UserPhone  string `gorm:"size:20" json:"userPhone"`
	Content    string `gorm:"type:text" json:"content"`
	Status     string `gorm:"size:16;default:pending" json:"status"`
}

type FeedbackImage struct {
	ID         string `gorm:"primaryKey;size:64" json:"id"`
	URL        string `gorm:"size:512" json:"url"`
	FeedbackID string `gorm:"size:64;index" json:"feedbackId"`
}