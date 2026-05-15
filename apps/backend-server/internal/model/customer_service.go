package model

type CSOrder struct {
	BaseModel
	OrderNo       string  `gorm:"size:32;uniqueIndex" json:"orderNo"`
	CustomerID    string  `gorm:"size:64" json:"customerId"`
	CustomerName  string  `gorm:"size:128" json:"customerName"`
	TotalAmount   float64 `json:"totalAmount"`
	PayAmount     float64 `json:"payAmount"`
	Status        string  `gorm:"size:16;default:pending" json:"status"`
	PayType       string  `gorm:"size:16" json:"payType"`
	PayTime       string  `gorm:"size:30" json:"payTime"`
	DeliveryAddress string `gorm:"size:512" json:"deliveryAddress"`
	Remark        string  `gorm:"size:256" json:"remark"`
}

type CSOrderItem struct {
	ID          string  `gorm:"primaryKey;size:64" json:"id"`
	OrderID     string  `gorm:"size:64;index" json:"orderId"`
	ProductID   string  `gorm:"size:64" json:"productId"`
	ProductName string  `gorm:"size:128" json:"productName"`
	Sku         string  `gorm:"size:64" json:"sku"`
	Price       float64 `json:"price"`
	Quantity    int     `json:"quantity"`
}

type CSAfterSale struct {
	BaseModel
	AfterSaleNo  string  `gorm:"size:32;uniqueIndex" json:"afterSaleNo"`
	OrderID      string  `gorm:"size:64" json:"orderId"`
	OrderNo      string  `gorm:"size:32" json:"orderNo"`
	Type         string  `gorm:"size:16" json:"type"`
	Reason       string  `gorm:"size:256" json:"reason"`
	Description  string  `gorm:"type:text" json:"description"`
	Status       string  `gorm:"size:16;default:pending" json:"status"`
	RefundAmount float64 `json:"refundAmount"`
}

type CSComplaint struct {
	BaseModel
	ComplaintNo   string `gorm:"size:32;uniqueIndex" json:"complaintNo"`
	CustomerID    string `gorm:"size:64" json:"customerId"`
	CustomerName  string `gorm:"size:128" json:"customerName"`
	RelatedOrderID string `gorm:"size:64" json:"relatedOrderId"`
	Type          string `gorm:"size:16" json:"type"`
	Priority      string `gorm:"size:16;default:medium" json:"priority"`
	Content       string `gorm:"type:text" json:"content"`
	Status        string `gorm:"size:16;default:pending" json:"status"`
	AssigneeID    string `gorm:"size:64" json:"assigneeId"`
	AssigneeName  string `gorm:"size:64" json:"assigneeName"`
	Satisfaction  int    `json:"satisfaction"`
	ClosedAt      string `gorm:"size:30" json:"closedAt"`
}

type CSComplaintProcess struct {
	ID            string `gorm:"primaryKey;size:64" json:"id"`
	ComplaintID   string `gorm:"size:64;index" json:"complaintId"`
	Action        string `gorm:"size:64" json:"action"`
	OperatorID    string `gorm:"size:64" json:"operatorId"`
	OperatorName  string `gorm:"size:64" json:"operatorName"`
	Content       string `gorm:"type:text" json:"content"`
}

type CSReview struct {
	BaseModel
	OrderID     string  `gorm:"size:64" json:"orderId"`
	UserID      string  `gorm:"size:64" json:"userId"`
	UserName    string  `gorm:"size:64" json:"userName"`
	Rating      int     `json:"rating"`
	Content     string  `gorm:"type:text" json:"content"`
	Reply       string  `gorm:"type:text" json:"reply"`
	ReplyBy     string  `gorm:"size:64" json:"replyBy"`
	ReplyAt     string  `gorm:"size:30" json:"replyAt"`
	Status      string  `gorm:"size:16;default:pending" json:"status"`
}

type CSInvoice struct {
	BaseModel
	OrderID      string  `gorm:"size:64" json:"orderId"`
	OrderNo      string  `gorm:"size:32" json:"orderNo"`
	Type         string  `gorm:"size:16" json:"type"`
	Title        string  `gorm:"size:128" json:"title"`
	Amount       float64 `json:"amount"`
	Status       string  `gorm:"size:16;default:pending" json:"status"`
}