package handler

import (
	"fmt"
	"net/http"
	"time"

	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListProducts(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var products []model.Product
		if db != nil {
			page, pageSize := paginate(c)
			status := c.Query("status")
			q := db.Model(&model.Product{})
			if status != "" {
				q = q.Where("status = ?", status)
			}
			var total int64
			q.Count(&total)
			db.Where("status = ?", status).Offset((page-1)*pageSize).Limit(pageSize).Find(&products)
			c.JSON(http.StatusOK, paginatedResult(products, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GetProduct(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Product not found"})
			return
		}
		var product model.Product
		if db.Where("id = ?", id).First(&product).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Product not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": product})
	}
}

func ListCategories(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var categories []model.Category
		if db != nil {
			db.Where("status = ?", "active").Find(&categories)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"list": categories, "total": len(categories)}})
	}
}

func ListBanners(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var banners []model.Banner
		if db != nil {
			db.Where("status = ?", "active").Order("sort_order ASC").Find(&banners)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"list": banners, "total": len(banners)}})
	}
}

func ListAnnouncements(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var announcements []model.Announcement
		if db != nil {
			db.Where("status = ?", "published").Order("created_at DESC").Find(&announcements)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"list": announcements, "total": len(announcements)}})
	}
}

func RecommendProducts(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var products []model.Product
		if db != nil {
			db.Where("status = ?", "on_sale").Order("sales_count DESC").Limit(6).Find(&products)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"list": products, "total": len(products)}})
	}
}

func GetCart(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, _ := c.Get("userId")
		if db == nil {
			c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
				"id": "", "userId": userId, "items": []interface{}{}, "totalAmount": 0, "updatedAt": time.Now().Format(time.RFC3339),
			}})
			return
		}
		var cart model.Cart
		if db.Where("user_id = ?", userId).First(&cart).Error != nil {
			c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
				"id": "", "userId": userId, "items": []interface{}{}, "totalAmount": 0, "updatedAt": time.Now().Format(time.RFC3339),
			}})
			return
		}
		var items []model.CartItem
		db.Where("cart_id = ?", cart.ID).Find(&items)
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
			"id": cart.ID, "userId": cart.UserID, "items": items, "totalAmount": cart.TotalAmount, "updatedAt": cart.UpdatedAt.Format(time.RFC3339),
		}})
	}
}

func AddCartItem(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			ProductID string `json:"productId"`
			Quantity  int    `json:"quantity"`
		}
		c.ShouldBindJSON(&req)
		if req.Quantity == 0 { req.Quantity = 1 }
		if db == nil {
			c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
				"id": newID(), "productId": req.ProductID, "quantity": req.Quantity, "selected": true,
			}})
			return
		}
		userId, _ := c.Get("userId")
		var cart model.Cart
		if db.Where("user_id = ?", userId).First(&cart).Error != nil {
			cart = model.Cart{UserID: userId.(string)}
			cart.ID = newID()
			db.Create(&cart)
		}
		var product model.Product
		if db.Where("id = ?", req.ProductID).First(&product).Error != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Product not found"})
			return
		}
		item := model.CartItem{
			ID:          newID(),
			CartID:      cart.ID,
			ProductID:   product.ID,
			Sku:         product.Sku,
			ProductName: product.Name,
			Price:       product.Price,
			Quantity:    req.Quantity,
			Selected:    true,
		}
		db.Create(&item)
		var items []model.CartItem
		db.Where("cart_id = ?", cart.ID).Find(&items)
		var totalAmount float64
		for _, ci := range items {
			totalAmount += ci.Price * float64(ci.Quantity)
		}
		db.Model(&cart).Update("total_amount", totalAmount)
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": item})
	}
}

func UpdateCartItem(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Quantity int `json:"quantity"`
		}
		c.ShouldBindJSON(&req)
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
				"id": id, "quantity": req.Quantity, "updatedAt": time.Now().Format(time.RFC3339),
			}})
			return
		}
		var item model.CartItem
		if db.Where("id = ?", id).First(&item).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Cart item not found"})
			return
		}
		db.Model(&item).Update("quantity", req.Quantity)
		var items []model.CartItem
		db.Where("cart_id = ?", item.CartID).Find(&items)
		var totalAmount float64
		for _, ci := range items {
			totalAmount += ci.Price * float64(ci.Quantity)
		}
		db.Model(&model.Cart{}).Where("id = ?", item.CartID).Update("total_amount", totalAmount)
		db.Where("id = ?", id).First(&item)
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": item})
	}
}

func DeleteCartItem(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success"})
			return
		}
		var item model.CartItem
		if db.Where("id = ?", id).First(&item).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Cart item not found"})
			return
		}
		db.Delete(&item)
		var items []model.CartItem
		db.Where("cart_id = ?", item.CartID).Find(&items)
		var totalAmount float64
		for _, ci := range items {
			totalAmount += ci.Price * float64(ci.Quantity)
		}
		db.Model(&model.Cart{}).Where("id = ?", item.CartID).Update("total_amount", totalAmount)
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success"})
	}
}

func ListMallOrders(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var orders []model.Order
		if db != nil {
			page, pageSize := paginate(c)
			userId, _ := c.Get("userId")
			var total int64
			db.Model(&model.Order{}).Where("user_id = ?", userId).Count(&total)
			db.Where("user_id = ?", userId).Offset((page-1)*pageSize).Limit(pageSize).Find(&orders)
			c.JSON(http.StatusOK, paginatedResult(orders, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GetMallOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Order not found"})
			return
		}
		var order model.Order
		if db.Where("id = ?", id).First(&order).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Order not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": order})
	}
}

func CreateMallOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, _ := c.Get("userId")
		now := time.Now()
		orderNo := fmt.Sprintf("ORD%d%s", now.Year(), fmt.Sprintf("%06d", now.Unix()%1000000))
		order := model.Order{
			OrderNo: orderNo,
			UserID:  userId.(string),
			Status:  "pending",
		}
		order.ID = newID()
		c.ShouldBindJSON(&order)
		if db != nil {
			db.Create(&order)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": order})
	}
}

func PayOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			PayType string `json:"payType"`
		}
		c.ShouldBindJSON(&req)
		now := time.Now().Format(time.RFC3339)
		if db != nil {
			db.Model(&model.Order{}).Where("id = ?", id).Updates(gin.H{"status": "paid", "pay_type": req.PayType, "pay_time": now, "paid_at": now})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "paid", "payType": req.PayType, "payTime": now}})
	}
}

func ListMallAfterSales(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.AfterSale
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.AfterSale{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func CreateMallAfterSale(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var as model.AfterSale
		c.ShouldBindJSON(&as)
		as.ID = newID()
		as.Status = "pending"
		now := time.Now()
		as.AfterSaleNo = fmt.Sprintf("AS%d%s", now.Year(), fmt.Sprintf("%06d", now.Unix()%1000000))
		if db != nil {
			db.Create(&as)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": as})
	}
}

func PurchaseVip(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			PackageID string `json:"packageId"`
		}
		c.ShouldBindJSON(&req)
		userId, _ := c.Get("userId")
		now := time.Now()
		if db == nil {
			c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
				"userId": userId, "level": "vip", "startDate": now.Format(time.RFC3339), "endDate": now.AddDate(0, 0, 30).Format(time.RFC3339), "autoRenew": false,
			}})
			return
		}
		var pkg model.VipPackage
		if db.Where("id = ? AND status = ?", req.PackageID, "active").First(&pkg).Error != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Vip package not found"})
			return
		}
		endDate := now.AddDate(0, 0, pkg.Duration)
		userVip := model.UserVip{
			ID:        newID(),
			UserID:    userId.(string),
			Level:     pkg.Level,
			StartDate: now.Format(time.RFC3339),
			EndDate:   endDate.Format(time.RFC3339),
			AutoRenew: false,
		}
		db.Create(&userVip)
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": userVip})
	}
}

func GetVipInfo(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var packages []model.VipPackage
		var userVip *model.UserVip
		if db != nil {
			db.Where("status = ?", "active").Find(&packages)
			userId, _ := c.Get("userId")
			var uv model.UserVip
			if db.Where("user_id = ?", userId).First(&uv).Error == nil {
				userVip = &uv
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"packages": packages, "userVip": userVip}})
	}
}

func GetCSPhone() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"phone": "400-123-4567", "serviceHours": "9:00-18:00"}})
	}
}

func CreateFeedback(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, _ := c.Get("userId")
		var req struct {
			Content string   `json:"content"`
			Images  []string `json:"images"`
		}
		c.ShouldBindJSON(&req)
		fb := model.Feedback{UserID: userId.(string), Content: req.Content, Status: "pending"}
		fb.ID = newID()
		if db != nil {
			db.Create(&fb)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": fb})
	}
}