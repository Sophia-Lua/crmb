package handler

import (
	"net/http"
	"strconv"
	"time"

	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func paginate(c *gin.Context) (page, pageSize int) {
	page, _ = strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ = strconv.Atoi(c.DefaultQuery("pageSize", "20"))
	if page < 1 { page = 1 }
	if pageSize < 1 { pageSize = 20 }
	return page, pageSize
}

func paginatedResult(data interface{}, total, page, pageSize int) gin.H {
	return gin.H{"code": 200, "message": "success", "data": gin.H{
		"list": data, "total": total, "page": page, "pageSize": pageSize,
	}}
}

func listVisits(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if db == nil {
			c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
			return
		}
		page, pageSize := paginate(c)
		var total int64
		var visits []model.Visit
		db.Model(&model.Visit{}).Count(&total)
		db.Order("created_at DESC").Offset((page-1)*pageSize).Limit(pageSize).Find(&visits)
		c.JSON(http.StatusOK, paginatedResult(visits, int(total), page, pageSize))
	}
}

func ListVisits(db *gorm.DB) gin.HandlerFunc { return listVisits(db) }

func VisitStatistics(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		now := time.Now()
		today := now.Format("2006-01-02")
		weekStart := now.AddDate(0, 0, -int(now.Weekday())).Format("2006-01-02")
		monthStart := now.Format("2006-01") + "-01"

		stats := gin.H{"today": 0, "thisWeek": 0, "thisMonth": 0, "total": 0}
		if db != nil {
			var total int64
			db.Model(&model.Visit{}).Count(&total)
			stats["total"] = total
			db.Model(&model.Visit{}).Where("plan_date = ?", today).Count(&total)
			stats["today"] = total
			db.Model(&model.Visit{}).Where("plan_date >= ?", weekStart).Count(&total)
			stats["thisWeek"] = total
			db.Model(&model.Visit{}).Where("plan_date >= ?", monthStart).Count(&total)
			stats["thisMonth"] = total
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": stats})
	}
}

func GetVisit(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Visit not found"})
			return
		}
		var visit model.Visit
		if db.Where("id = ?", id).First(&visit).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Visit not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": visit})
	}
}

func CreateVisit(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var visit model.Visit
		if err := c.ShouldBindJSON(&visit); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid request"})
			return
		}
		visit.ID = newID()
		visit.Status = "pending"
		userId, _ := c.Get("userId")
		visit.CreatedBy = userId.(string)
		if db != nil {
			db.Create(&visit)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": visit})
	}
}

func UpdateVisit(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req map[string]interface{}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid request"})
			return
		}
		if db != nil {
			db.Model(&model.Visit{}).Where("id = ?", id).Updates(req)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "updatedAt": time.Now().Format(time.RFC3339)}})
	}
}

func DeleteVisit(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Where("id = ?", id).Delete(&model.Visit{})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success"})
	}
}

func ListStores(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if db == nil {
			c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
			return
		}
		page, pageSize := paginate(c)
		var total int64
		var stores []model.Store
		db.Model(&model.Store{}).Count(&total)
		db.Order("created_at DESC").Offset((page-1)*pageSize).Limit(pageSize).Find(&stores)
		c.JSON(http.StatusOK, paginatedResult(stores, int(total), page, pageSize))
	}
}

func UnclaimedStores(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var stores []model.Store
		if db != nil {
			db.Where("status = ?", "unclaimed").Find(&stores)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"list": stores, "total": len(stores)}})
	}
}

func ReviewStores(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var stores []model.Store
		if db != nil {
			db.Where("status = ?", "pending").Find(&stores)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"list": stores, "total": len(stores)}})
	}
}

func GetStore(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Store not found"})
			return
		}
		var store model.Store
		if db.Where("id = ?", id).First(&store).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Store not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": store})
	}
}

func ClaimStore(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		userId, _ := c.Get("userId")
		now := time.Now().Format(time.RFC3339)
		if db != nil {
			db.Model(&model.Store{}).Where("id = ?", id).Updates(gin.H{"status": "pending", "claim_by": userId, "claimed_at": now})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "pending", "claimBy": userId, "claimedAt": now}})
	}
}

func ReviewStore(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			Status       string `json:"status"`
			RejectReason string `json:"rejectReason"`
		}
		c.ShouldBindJSON(&req)
		userId, _ := c.Get("userId")
		now := time.Now().Format(time.RFC3339)
		if db != nil {
			db.Model(&model.Store{}).Where("id = ?", id).Updates(gin.H{"status": req.Status, "review_by": userId, "reviewed_at": now, "reject_reason": req.RejectReason})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": req.Status, "reviewBy": userId, "reviewedAt": now}})
	}
}

func AssignStore(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			AssignedTo string `json:"assignedTo"`
		}
		c.ShouldBindJSON(&req)
		now := time.Now().Format(time.RFC3339)
		if db != nil {
			db.Model(&model.Store{}).Where("id = ?", id).Updates(gin.H{"assigned_to": req.AssignedTo, "assigned_at": now})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "assignedTo": req.AssignedTo, "assignedAt": now}})
	}
}

func StoreStatistics(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		stats := gin.H{"unclaimed": 0, "pending": 0, "approved": 0, "total": 0}
		if db != nil {
			var total, unclaimed, pending, approved int64
			db.Model(&model.Store{}).Count(&total)
			db.Model(&model.Store{}).Where("status = ?", "unclaimed").Count(&unclaimed)
			db.Model(&model.Store{}).Where("status = ?", "pending").Count(&pending)
			db.Model(&model.Store{}).Where("status = ?", "approved").Count(&approved)
			stats["total"] = total
			stats["unclaimed"] = unclaimed
			stats["pending"] = pending
			stats["approved"] = approved
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": stats})
	}
}

func PublicCustomers(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var customers []model.Customer
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.Customer{}).Where("customer_type = ?", "public").Count(&total)
			db.Where("customer_type = ?", "public").Offset((page-1)*pageSize).Limit(pageSize).Find(&customers)
			c.JSON(http.StatusOK, paginatedResult(customers, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func PrivateCustomers(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var customers []model.Customer
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.Customer{}).Where("customer_type = ?", "private").Count(&total)
			db.Where("customer_type = ?", "private").Offset((page-1)*pageSize).Limit(pageSize).Find(&customers)
			c.JSON(http.StatusOK, paginatedResult(customers, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func SearchCustomers(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		keyword := c.Query("keyword")
		var customers []model.Customer
		if db != nil && keyword != "" {
			page, pageSize := paginate(c)
			var total int64
			q := db.Model(&model.Customer{}).Where("customer_name LIKE ? OR contact_phone LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
			q.Count(&total)
			q.Offset((page-1)*pageSize).Limit(pageSize).Find(&customers)
			c.JSON(http.StatusOK, paginatedResult(customers, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GetCustomer(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Customer not found"})
			return
		}
		var customer model.Customer
		if db.Where("id = ?", id).First(&customer).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Customer not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": customer})
	}
}

func ClaimCustomer(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		userId, _ := c.Get("userId")
		now := time.Now().Format(time.RFC3339)
		if db != nil {
			db.Model(&model.Customer{}).Where("id = ?", id).Updates(gin.H{"customer_type": "private", "assigned_to": userId})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "customerType": "private", "assignedTo": userId, "claimedAt": now}})
	}
}

func ReturnCustomer(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		now := time.Now().Format(time.RFC3339)
		if db != nil {
			db.Model(&model.Customer{}).Where("id = ?", id).Updates(gin.H{"customer_type": "public", "assigned_to": ""})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "customerType": "public", "assignedTo": nil, "returnedAt": now}})
	}
}

func TransferCustomer(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			AssignedTo string `json:"assignedTo"`
		}
		c.ShouldBindJSON(&req)
		now := time.Now().Format(time.RFC3339)
		if db != nil {
			db.Model(&model.Customer{}).Where("id = ?", id).Updates(gin.H{"assigned_to": req.AssignedTo})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "assignedTo": req.AssignedTo, "transferredAt": now}})
	}
}

func ListSpecialStockRequests(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.SpecialStockRequest
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.SpecialStockRequest{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func ListBlacklist(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.BlacklistCustomer
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.BlacklistCustomer{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}