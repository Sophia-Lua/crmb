package handler

import (
	"net/http"
	"time"

	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListSupplierOrders(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.SupplierOrder
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.SupplierOrder{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GetSupplierOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Order not found"})
			return
		}
		var o model.SupplierOrder
		if db.Where("id = ?", id).First(&o).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Order not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": o})
	}
}

func ShipSupplierOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Model(&model.SupplierOrder{}).Where("id = ?", id).Update("status", "shipped")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "shipped"}})
	}
}

func ListSupplierReconciliations(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.SupplierReconciliation
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.SupplierReconciliation{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func ConfirmSupplierOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		now := time.Now().Format(time.RFC3339)
		if db != nil {
			db.Model(&model.SupplierOrder{}).Where("id = ?", id).Updates(gin.H{"status": "confirmed", "confirmed_at": now})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "confirmed", "confirmedAt": now}})
	}
}

func CreateSupplierShipment(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			OrderID        string `json:"orderId"`
			ShipmentNo     string `json:"shipmentNo"`
			LogisticsCompany string `json:"logisticsCompany"`
		}
		c.ShouldBindJSON(&req)
		shipment := model.SupplierShipment{
			OrderID:        req.OrderID,
			ShipmentNo:     req.ShipmentNo,
			LogisticsCompany: req.LogisticsCompany,
			Status:         "shipped",
		}
		shipment.ID = newID()
		if db != nil {
			db.Create(&shipment)
			db.Model(&model.SupplierOrder{}).Where("id = ?", req.OrderID).Update("status", "shipped")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": shipment})
	}
}

func ConfirmSupplierReconciliation(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		now := time.Now().Format(time.RFC3339)
		if db != nil {
			db.Model(&model.SupplierReconciliation{}).Where("id = ?", id).Update("status", "confirmed")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "confirmed", "confirmedAt": now}})
	}
}