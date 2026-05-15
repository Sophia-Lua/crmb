package handler

import (
	"net/http"
	"time"

	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListOpsProducts(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var products []model.OpsProduct
		if db != nil {
			page, pageSize := paginate(c)
			q := db.Model(&model.OpsProduct{})
			if c.Query("status") != "" { q = q.Where("status = ?", c.Query("status")) }
			if c.Query("categoryId") != "" { q = q.Where("category_id = ?", c.Query("categoryId")) }
			var total int64
			q.Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&products)
			c.JSON(http.StatusOK, paginatedResult(products, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GetOpsProduct(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Product not found"})
			return
		}
		var p model.OpsProduct
		if db.Where("id = ?", id).First(&p).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Product not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": p})
	}
}

func CreateOpsProduct(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var p model.OpsProduct
		c.ShouldBindJSON(&p)
		p.ID = newID()
		p.Status = "off_sale"
		if db != nil { db.Create(&p) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": p})
	}
}

func UpdateOpsProduct(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req map[string]interface{}
		c.ShouldBindJSON(&req)
		if db != nil { db.Model(&model.OpsProduct{}).Where("id = ?", id).Updates(req) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "updatedAt": time.Now().Format(time.RFC3339)}})
	}
}

func UpdateOpsProductStatus(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct { Status string `json:"status"` }
		c.ShouldBindJSON(&req)
		if req.Status == "" { req.Status = "on_sale" }
		if db != nil { db.Model(&model.OpsProduct{}).Where("id = ?", id).Update("status", req.Status) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": req.Status}})
	}
}

func ListOpsCategories(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var categories []model.OpsCategory
		if db != nil { db.Find(&categories) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"list": categories, "total": len(categories)}})
	}
}

func CreateOpsCategory(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var cat model.OpsCategory
		c.ShouldBindJSON(&cat)
		cat.ID = newID()
		cat.Status = "active"
		if db != nil { db.Create(&cat) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": cat})
	}
}

func UpdateOpsCategory(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req map[string]interface{}
		c.ShouldBindJSON(&req)
		if db != nil { db.Model(&model.OpsCategory{}).Where("id = ?", id).Updates(req) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id}})
	}
}

func ListOpsPromotions(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.OpsPromotion
		if db != nil {
			page, pageSize := paginate(c)
			q := db.Model(&model.OpsPromotion{})
			if c.Query("status") != "" { q = q.Where("status = ?", c.Query("status")) }
			var total int64
			q.Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func CreateOpsPromotion(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var p model.OpsPromotion
		c.ShouldBindJSON(&p)
		p.ID = newID()
		p.Status = "upcoming"
		if db != nil { db.Create(&p) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": p})
	}
}

func UpdateOpsPromotion(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req map[string]interface{}
		c.ShouldBindJSON(&req)
		if db != nil { db.Model(&model.OpsPromotion{}).Where("id = ?", id).Updates(req) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id}})
	}
}

func OpsPromotionStatistics(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		data := gin.H{
			"promotionId": id, "totalOrders": 0, "totalRevenue": 0.0,
			"totalDiscount": 0.0, "avgOrderAmount": 0.0, "couponUsedCount": 0,
		}
		if db != nil {
			var totalOrders int64
			var totalRevenue float64
			var totalDiscount float64
			var couponUsedCount int64
			db.Model(&model.Order{}).Where("coupon_id IS NOT NULL AND coupon_id != ''").Count(&totalOrders)
			db.Model(&model.Order{}).Where("coupon_id IS NOT NULL AND coupon_id != ''").Select("COALESCE(SUM(pay_amount), 0)").Scan(&totalRevenue)
			db.Model(&model.Order{}).Where("coupon_id IS NOT NULL AND coupon_id != ''").Select("COALESCE(SUM(discount_amount), 0)").Scan(&totalDiscount)
			db.Model(&model.OpsCoupon{}).Where("status = ?", "active").Select("COALESCE(SUM(used_count), 0)").Scan(&couponUsedCount)
			avgOrderAmount := 0.0
			if totalOrders > 0 {
				avgOrderAmount = totalRevenue / float64(totalOrders)
			}
			data = gin.H{
				"promotionId": id, "totalOrders": totalOrders, "totalRevenue": totalRevenue,
				"totalDiscount": totalDiscount, "avgOrderAmount": avgOrderAmount, "couponUsedCount": couponUsedCount,
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": data})
	}
}

func ListOpsCoupons(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.OpsCoupon
		if db != nil {
			page, pageSize := paginate(c)
			q := db.Model(&model.OpsCoupon{})
			if c.Query("status") != "" { q = q.Where("status = ?", c.Query("status")) }
			var total int64
			q.Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func CreateOpsCoupon(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var coupon model.OpsCoupon
		c.ShouldBindJSON(&coupon)
		coupon.ID = newID()
		coupon.Status = "active"
		coupon.UsedCount = 0
		if db != nil { db.Create(&coupon) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": coupon})
	}
}

func GetOpsSeckillConfig(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		data := gin.H{
			"enabled": true, "startTime": "", "endTime": "", "maxQuantityPerUser": 3,
			"products": []gin.H{},
		}
		if db != nil {
			var config model.OpsSeckillConfig
			db.First(&config)
			var products []model.OpsSeckillProduct
			if config.ID != "" {
				db.Where("config_id = ?", config.ID).Find(&products)
			}
			productList := make([]gin.H, 0, len(products))
			for _, p := range products {
				productList = append(productList, gin.H{
					"sku": p.Sku, "seckillPrice": p.SeckillPrice, "totalStock": p.TotalStock,
				})
			}
			data = gin.H{
				"enabled": config.Enabled, "startTime": config.StartTime, "endTime": config.EndTime,
				"maxQuantityPerUser": config.MaxQuantityPerUser, "products": productList,
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": data})
	}
}

func ListOpsMerchantApplications(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.OpsMerchantApplication
		if db != nil {
			page, pageSize := paginate(c)
			q := db.Model(&model.OpsMerchantApplication{})
			if c.Query("reviewStatus") != "" { q = q.Where("review_status = ?", c.Query("reviewStatus")) }
			var total int64
			q.Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GetOpsMerchantApplication(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Application not found"})
			return
		}
		var a model.OpsMerchantApplication
		if db.Where("id = ?", id).First(&a).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Application not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": a})
	}
}

func ReviewOpsMerchantApplication(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			ReviewStatus string `json:"reviewStatus"`
			ReviewRemark string `json:"reviewRemark"`
		}
		c.ShouldBindJSON(&req)
		if req.ReviewStatus == "" { req.ReviewStatus = "approved" }
		if db != nil {
			db.Model(&model.OpsMerchantApplication{}).Where("id = ?", id).Updates(gin.H{
				"review_status": req.ReviewStatus, "review_remark": req.ReviewRemark, "reviewed_at": time.Now().Format(time.RFC3339),
			})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
			"id": id, "reviewStatus": req.ReviewStatus, "reviewRemark": req.ReviewRemark,
		}})
	}
}