package handler

import (
	"fmt"
	"net/http"
	"time"

	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListCWInventory(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.CWInventory
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.CWInventory{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func ListCWOutbound(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.CWOutboundOrder
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.CWOutboundOrder{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func ListCWInbound(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.CWInboundOrder
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.CWInboundOrder{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func CreateCWOutbound(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var order model.CWOutboundOrder
		c.ShouldBindJSON(&order)
		order.ID = newID()
		now := time.Now()
		order.OrderNo = fmt.Sprintf("OUT%d%s", now.Year(), fmt.Sprintf("%06d", now.Unix()%1000000))
		order.Status = "pending"
		if db != nil {
			db.Create(&order)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": order})
	}
}

func CreateCWInbound(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var order model.CWInboundOrder
		c.ShouldBindJSON(&order)
		order.ID = newID()
		now := time.Now()
		order.OrderNo = fmt.Sprintf("IN%d%s", now.Year(), fmt.Sprintf("%06d", now.Unix()%1000000))
		order.Status = "pending"
		if db != nil {
			db.Create(&order)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": order})
	}
}

func CWInventoryCheck(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Sku            string `json:"sku"`
			Location       string `json:"location"`
			ActualQuantity int    `json:"actualQuantity"`
		}
		c.ShouldBindJSON(&req)
		check := model.CWInventoryCheck{
			Sku: req.Sku, Location: req.Location,
			ActualQuantity: req.ActualQuantity,
		}
		check.ID = newID()
		if db != nil {
			var inv model.CWInventory
			db.Where("sku = ? AND location = ?", req.Sku, req.Location).First(&inv)
			check.SystemQuantity = inv.Quantity
			check.Difference = req.ActualQuantity - inv.Quantity
			db.Create(&check)
			if check.Difference != 0 {
				db.Model(&model.CWInventory{}).Where("id = ?", inv.ID).Update("quantity", req.ActualQuantity)
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": check})
	}
}

func ListCWUnloading(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var tasks []model.CWUnloadingTask
		if db != nil {
			db.Where("status = ?", "pending").Find(&tasks)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"list": tasks, "total": len(tasks)}})
	}
}