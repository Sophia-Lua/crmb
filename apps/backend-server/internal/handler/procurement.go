package handler

import (
	"fmt"
	"net/http"
	"time"

	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListProcSuppliers(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var suppliers []model.ProcSupplier
		if db != nil {
			page, pageSize := paginate(c)
			q := db.Model(&model.ProcSupplier{})
			if c.Query("qualificationStatus") != "" {
				q = q.Where("qualification_status = ?", c.Query("qualificationStatus"))
			}
			if c.Query("rating") != "" {
				q = q.Where("rating = ?", c.Query("rating"))
			}
			if c.Query("category") != "" {
				q = q.Where("category = ?", c.Query("category"))
			}
			var total int64
			q.Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&suppliers)
			c.JSON(http.StatusOK, paginatedResult(suppliers, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GetProcSupplier(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Supplier not found"})
			return
		}
		var s model.ProcSupplier
		if db.Where("id = ?", id).First(&s).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Supplier not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": s})
	}
}

func CreateProcSupplier(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var s model.ProcSupplier
		c.ShouldBindJSON(&s)
		s.ID = newID()
		s.QualificationStatus = "pending"
		s.Rating = "C"
		if db != nil {
			db.Create(&s)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": s})
	}
}

func UpdateProcSupplier(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req map[string]interface{}
		c.ShouldBindJSON(&req)
		if db != nil {
			db.Model(&model.ProcSupplier{}).Where("id = ?", id).Updates(req)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "updatedAt": time.Now().Format(time.RFC3339)}})
	}
}

func AuditProcSupplier(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			QualificationStatus string `json:"qualificationStatus"`
		}
		c.ShouldBindJSON(&req)
		if req.QualificationStatus == "" { req.QualificationStatus = "qualified" }
		if db != nil {
			db.Model(&model.ProcSupplier{}).Where("id = ?", id).Update("qualification_status", req.QualificationStatus)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "qualificationStatus": req.QualificationStatus}})
	}
}

func GetProcSupplierRating(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		data := gin.H{"id": id, "rating": "C", "deliveryRate": 0.0, "qualityRate": 0.0, "cooperationCount": 0, "compositeRating": 0.0}
		if db != nil {
			var s model.ProcSupplier
			if db.Where("id = ?", id).First(&s).Error == nil {
				var orderCount int64
				var deliveredOnTimeCount int64
				var qualifiedCount int64
				var cooperationCount int64
				db.Model(&model.PurchaseOrder{}).Where("supplier_id = ?", id).Count(&orderCount)
				db.Model(&model.PurchaseOrder{}).Where("supplier_id = ? AND status = ?", id, "delivered").Where("delivery_date >= created_at").Count(&deliveredOnTimeCount)
				db.Model(&model.PurchaseOrder{}).Where("supplier_id = ? AND status = ?", id, "qualified").Count(&qualifiedCount)
				cooperationCount = orderCount
				deliveryRate := 0.0
				if orderCount > 0 {
					deliveryRate = float64(deliveredOnTimeCount) / float64(orderCount) * 100
				}
				qualityRate := 0.0
				if orderCount > 0 {
					qualityRate = float64(qualifiedCount) / float64(orderCount) * 100
				}
				compositeRating := deliveryRate * 0.4 + qualityRate * 0.3 + float64(min(cooperationCount, 100)) * 0.3
				data = gin.H{
					"id": id, "rating": s.Rating, "deliveryRate": deliveryRate,
					"qualityRate": qualityRate, "cooperationCount": cooperationCount, "compositeRating": compositeRating,
				}
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": data})
	}
}

func ListPurchaseRequests(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.PurchaseRequest
		if db != nil {
			page, pageSize := paginate(c)
			q := db.Model(&model.PurchaseRequest{})
			if c.Query("status") != "" {
				q = q.Where("status = ?", c.Query("status"))
			}
			var total int64
			q.Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func CreatePurchaseRequest(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var pr model.PurchaseRequest
		c.ShouldBindJSON(&pr)
		pr.ID = newID()
		now := time.Now()
		pr.RequestNo = fmt.Sprintf("PR%d%s", now.Year(), fmt.Sprintf("%06d", now.Unix()%1000000))
		pr.Status = "pending"
		if db != nil {
			db.Create(&pr)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": pr})
	}
}

func ApprovePurchaseRequest(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Model(&model.PurchaseRequest{}).Where("id = ?", id).Updates(gin.H{"status": "approved", "approved_at": time.Now().Format(time.RFC3339)})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "approved"}})
	}
}

func ListPurchaseOrders(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.PurchaseOrder
		if db != nil {
			page, pageSize := paginate(c)
			q := db.Model(&model.PurchaseOrder{})
			if c.Query("approvalStatus") != "" {
				q = q.Where("approval_status = ?", c.Query("approvalStatus"))
			}
			if c.Query("status") != "" {
				q = q.Where("status = ?", c.Query("status"))
			}
			var total int64
			q.Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func CreatePurchaseOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var po model.PurchaseOrder
		c.ShouldBindJSON(&po)
		po.ID = newID()
		now := time.Now()
		po.OrderNo = fmt.Sprintf("PO%d%s", now.Year(), fmt.Sprintf("%06d", now.Unix()%1000000))
		po.ApprovalStatus = "pending"
		po.Status = "pending"
		if db != nil {
			db.Create(&po)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": po})
	}
}

func ApprovePurchaseOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			ApprovalStatus string `json:"approvalStatus"`
		}
		c.ShouldBindJSON(&req)
		if req.ApprovalStatus == "" { req.ApprovalStatus = "approved" }
		if db != nil {
			db.Model(&model.PurchaseOrder{}).Where("id = ?", id).Updates(gin.H{"approval_status": req.ApprovalStatus, "approved_at": time.Now().Format(time.RFC3339)})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "approvalStatus": req.ApprovalStatus}})
	}
}

func TrackPurchaseOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		data := gin.H{"id": id, "tracking": []gin.H{}, "shipmentInfo": gin.H{}}
		if db != nil {
			var po model.PurchaseOrder
			if db.Where("id = ?", id).First(&po).Error == nil {
				tracking := []gin.H{}
				if po.Status != "" {
					tracking = append(tracking, gin.H{"step": "order_created", "status": "completed", "timestamp": po.CreatedAt})
				}
				if po.ApprovalStatus == "approved" {
					tracking = append(tracking, gin.H{"step": "approved", "status": "completed", "timestamp": po.ApprovedAt})
				}
				if po.Status == "shipped" || po.Status == "delivered" {
					tracking = append(tracking, gin.H{"step": "shipping", "status": "completed"})
				} else if po.ApprovalStatus == "approved" {
					tracking = append(tracking, gin.H{"step": "shipping", "status": "in_progress"})
				}
				if po.Status == "delivered" {
					tracking = append(tracking, gin.H{"step": "received", "status": "completed"})
				} else {
					tracking = append(tracking, gin.H{"step": "received", "status": "pending"})
				}
				var shipment model.SupplierShipment
				shipmentInfo := gin.H{}
				if db.Where("order_id = ?", id).First(&shipment).Error == nil {
					shipmentInfo = gin.H{
						"shipmentNo": shipment.ShipmentNo, "logisticsCompany": shipment.LogisticsCompany, "status": shipment.Status,
					}
				}
				data = gin.H{"id": id, "orderStatus": po.Status, "tracking": tracking, "shipmentInfo": shipmentInfo}
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": data})
	}
}

func ListPayableAccounts(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.PayableAccount
		if db != nil {
			page, pageSize := paginate(c)
			q := db.Model(&model.PayableAccount{})
			if c.Query("status") != "" {
				q = q.Where("status = ?", c.Query("status"))
			}
			var total int64
			q.Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GenerateReconciliation(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			SupplierID string `json:"supplierId"`
			Period     string `json:"period"`
		}
		c.ShouldBindJSON(&req)
		recon := model.ProcReconciliation{
			ReconciliationNo: fmt.Sprintf("RECON%d%s", time.Now().Year(), fmt.Sprintf("%06d", time.Now().Unix()%1000000)),
			SupplierID: req.SupplierID, Period: req.Period, Status: "pending",
		}
		recon.ID = newID()
		if db != nil {
			db.Create(&recon)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": recon})
	}
}

func ConfirmReconciliation(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Model(&model.ProcReconciliation{}).Where("id = ?", id).Update("status", "confirmed")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "confirmed"}})
	}
}

func CreatePaymentRequest(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			PayableAccountID string  `json:"payableAccountId"`
			Amount           float64 `json:"amount"`
			Payee            string  `json:"payee"`
		}
		c.ShouldBindJSON(&req)
		pr := model.ProcPaymentRequest{PayableAccountID: req.PayableAccountID, Amount: req.Amount, Payee: req.Payee, Status: "pending"}
		pr.ID = newID()
		if db != nil {
			db.Create(&pr)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": pr})
	}
}

func ApprovePaymentRequest(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Model(&model.ProcPaymentRequest{}).Where("id = ?", id).Update("status", "approved")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "approved"}})
	}
}

func ExecutePaymentRequest(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db != nil {
			db.Model(&model.ProcPaymentRequest{}).Where("id = ?", id).Update("status", "executed")
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "executed"}})
	}
}