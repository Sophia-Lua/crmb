package handler

import (
	"net/http"
	"time"

	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListCSOrders(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var orders []model.CSOrder
		if db != nil {
			page, pageSize := paginate(c)
			status := c.Query("status")
			q := db.Model(&model.CSOrder{})
			if status != "" {
				q = q.Where("status = ?", status)
			}
			var total int64
			q.Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&orders)
			c.JSON(http.StatusOK, paginatedResult(orders, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GetCSOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Order not found"})
			return
		}
		var order model.CSOrder
		if db.Where("id = ?", id).First(&order).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Order not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": order})
	}
}

func ConfirmCSOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Model(&model.CSOrder{}).Where("id = ?", id).Update("status", "confirmed")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "confirmed", "updatedAt": time.Now().Format(time.RFC3339)}})
	}
}

func CancelCSOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Model(&model.CSOrder{}).Where("id = ?", id).Update("status", "cancelled")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "cancelled", "updatedAt": time.Now().Format(time.RFC3339)}})
	}
}

func CSOrderRemark(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			Remark string `json:"remark"`
		}
		c.ShouldBindJSON(&req)
		if db != nil {
			db.Model(&model.CSOrder{}).Where("id = ?", id).Update("remark", req.Remark)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "remark": req.Remark, "updatedAt": time.Now().Format(time.RFC3339)}})
	}
}

func ListCSAfterSales(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.CSAfterSale
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.CSAfterSale{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GetCSAfterSale(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "After sale not found"})
			return
		}
		var as model.CSAfterSale
		if db.Where("id = ?", id).First(&as).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "After sale not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": as})
	}
}

func ApproveCSAfterSale(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Model(&model.CSAfterSale{}).Where("id = ?", id).Update("status", "approved")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "approved", "updatedAt": time.Now().Format(time.RFC3339)}})
	}
}

func ReceiveCSAfterSale(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Model(&model.CSAfterSale{}).Where("id = ?", id).Update("status", "received")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "received", "updatedAt": time.Now().Format(time.RFC3339)}})
	}
}

func RefundCSAfterSale(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Model(&model.CSAfterSale{}).Where("id = ?", id).Update("status", "refunded")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "refunded", "updatedAt": time.Now().Format(time.RFC3339)}})
	}
}

func ListCSComplaints(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.CSComplaint
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.CSComplaint{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GetCSComplaint(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Complaint not found"})
			return
		}
		var item model.CSComplaint
		if db.Where("id = ?", id).First(&item).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Complaint not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": item})
	}
}

func AcceptCSComplaint(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Model(&model.CSComplaint{}).Where("id = ?", id).Update("status", "accepted")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "accepted", "updatedAt": time.Now().Format(time.RFC3339)}})
	}
}

func ProcessCSComplaint(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Model(&model.CSComplaint{}).Where("id = ?", id).Update("status", "processing")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "processing", "updatedAt": time.Now().Format(time.RFC3339)}})
	}
}

func CloseCSComplaint(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		now := time.Now().Format(time.RFC3339)
		if db != nil {
			db.Model(&model.CSComplaint{}).Where("id = ?", id).Updates(gin.H{"status": "closed", "closed_at": now})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "closed", "closedAt": now}})
	}
}

func ListCSReviews(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.CSReview
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.CSReview{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func ReplyCSReview(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			Reply string `json:"reply"`
		}
		c.ShouldBindJSON(&req)
		now := time.Now().Format(time.RFC3339)
		if db != nil {
			db.Model(&model.CSReview{}).Where("id = ?", id).Updates(gin.H{"reply": req.Reply, "reply_at": now, "status": "replied"})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "reply": req.Reply, "replyAt": now, "status": "replied"}})
	}
}

func ListCSFeedbacks(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.Feedback
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.Feedback{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func ListCSInvoices(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.CSInvoice
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.CSInvoice{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}