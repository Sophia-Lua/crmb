package handler

import (
	"net/http"
	"time"

	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListPayMerchants(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var merchants []model.PayMerchant
		if db != nil {
			page, pageSize := paginate(c)
			q := db.Model(&model.PayMerchant{})
			if c.Query("status") != "" {
				q = q.Where("status = ?", c.Query("status"))
			}
			var total int64
			q.Count(&total)
			q.Offset((page-1)*pageSize).Limit(pageSize).Find(&merchants)
			c.JSON(http.StatusOK, paginatedResult(merchants, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GetPayMerchant(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Merchant not found"})
			return
		}
		var m model.PayMerchant
		if db.Where("id = ?", id).First(&m).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Merchant not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": m})
	}
}

func CreatePayMerchant(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var m model.PayMerchant
		c.ShouldBindJSON(&m)
		m.ID = newID()
		m.Status = "pending"
		if db != nil {
			db.Create(&m)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": m})
	}
}

func UpdatePayMerchant(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req map[string]interface{}
		c.ShouldBindJSON(&req)
		if db != nil {
			db.Model(&model.PayMerchant{}).Where("id = ?", id).Updates(req)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "updatedAt": time.Now().Format(time.RFC3339)}})
	}
}

func UpdatePayMerchantFeeRate(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			FeeRate float64 `json:"feeRate"`
		}
		c.ShouldBindJSON(&req)
		if db != nil {
			db.Model(&model.PayMerchant{}).Where("id = ?", id).Update("fee_rate", req.FeeRate)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "feeRate": req.FeeRate}})
	}
}

func UpdatePayMerchantSettlement(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			SettlementAccount string `json:"settlementAccount"`
			SettlementBank    string `json:"settlementBank"`
		}
		c.ShouldBindJSON(&req)
		if db != nil {
			db.Model(&model.PayMerchant{}).Where("id = ?", id).Updates(gin.H{"settlement_account": req.SettlementAccount, "settlement_bank": req.SettlementBank})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id}})
	}
}

func ListPayReceipts(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.PayReceipt
		if db != nil {
			page, pageSize := paginate(c)
			q := db.Model(&model.PayReceipt{})
			if c.Query("status") != "" { q = q.Where("status = ?", c.Query("status")) }
			if c.Query("payMethod") != "" { q = q.Where("pay_method = ?", c.Query("payMethod")) }
			if c.Query("merchantId") != "" { q = q.Where("merchant_id = ?", c.Query("merchantId")) }
			var total int64
			q.Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GetPayReceipt(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if db == nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Receipt not found"})
			return
		}
		var r model.PayReceipt
		if db.Where("id = ?", id).First(&r).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Receipt not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": r})
	}
}

func PayReceiptDailySummary(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		date := c.DefaultQuery("date", time.Now().Format("2006-01-02"))
		start, _ := time.Parse("2006-01-02", date)
		end := start.AddDate(0, 0, 1)

		type summaryRow struct {
			PayMethod   string
			TotalAmount float64
			TotalCount  int64
		}
		var rows []summaryRow
		result := gin.H{
			"date": date, "totalAmount": float64(0), "totalCount": int64(0),
			"wechatAmount": float64(0), "alipayAmount": float64(0), "bankCardAmount": float64(0),
		}

		if db != nil {
			db.Model(&model.PayReceipt{}).
				Select("pay_method, SUM(amount) as total_amount, COUNT(*) as total_count").
				Where("created_at >= ? AND created_at < ?", start, end).
				Group("pay_method").
				Find(&rows)

			var totalAmount float64
			var totalCount int64
			for _, row := range rows {
				totalAmount += row.TotalAmount
				totalCount += row.TotalCount
				switch row.PayMethod {
				case "wechat":
					result["wechatAmount"] = row.TotalAmount
				case "alipay":
					result["alipayAmount"] = row.TotalAmount
				case "bankCard":
					result["bankCardAmount"] = row.TotalAmount
				}
			}
			result["totalAmount"] = totalAmount
			result["totalCount"] = totalCount
		}

		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": result})
	}
}

func PayReceiptMonthlySummary(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		month := c.DefaultQuery("month", time.Now().Format("2006-01"))
		start, _ := time.Parse("2006-01", month)
		end := start.AddDate(0, 1, 0)

		type summaryRow struct {
			PayMethod   string
			TotalAmount float64
			TotalCount  int64
		}
		var rows []summaryRow
		result := gin.H{
			"month": month, "totalAmount": float64(0), "totalCount": int64(0),
			"wechatAmount": float64(0), "alipayAmount": float64(0), "bankCardAmount": float64(0),
		}

		if db != nil {
			db.Model(&model.PayReceipt{}).
				Select("pay_method, SUM(amount) as total_amount, COUNT(*) as total_count").
				Where("created_at >= ? AND created_at < ?", start, end).
				Group("pay_method").
				Find(&rows)

			var totalAmount float64
			var totalCount int64
			for _, row := range rows {
				totalAmount += row.TotalAmount
				totalCount += row.TotalCount
				switch row.PayMethod {
				case "wechat":
					result["wechatAmount"] = row.TotalAmount
				case "alipay":
					result["alipayAmount"] = row.TotalAmount
				case "bankCard":
					result["bankCardAmount"] = row.TotalAmount
				}
			}
			result["totalAmount"] = totalAmount
			result["totalCount"] = totalCount
		}

		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": result})
	}
}

func MarkPayReceiptAbnormal(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			AbnormalReason string `json:"abnormalReason"`
		}
		c.ShouldBindJSON(&req)
		if db != nil {
			db.Model(&model.PayReceipt{}).Where("id = ?", id).Updates(gin.H{"status": "abnormal", "abnormal_reason": req.AbnormalReason})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "abnormal"}})
	}
}

func ProcessPayReceiptAbnormal(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			ProcessResult string `json:"processResult"`
		}
		c.ShouldBindJSON(&req)
		if db != nil {
			db.Model(&model.PayReceipt{}).Where("id = ?", id).Updates(gin.H{"status": "normal", "process_result": req.ProcessResult})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "normal"}})
	}
}

func GetPaySettlementConfig(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var config model.PaySettlementConfig
		if db != nil {
			db.First(&config)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": config})
	}
}

func ListPaySettlementReports(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.PaySettlementReport
		if db != nil {
			page, pageSize := paginate(c)
			q := db.Model(&model.PaySettlementReport{})
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

func ExecutePaySettlement(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			MerchantID string  `json:"merchantId"`
			Amount     float64 `json:"amount"`
		}
		c.ShouldBindJSON(&req)
		report := model.PaySettlementReport{}
		report.ID = newID()
		report.MerchantID = req.MerchantID
		report.Amount = req.Amount
		report.Status = "processing"
		if db != nil {
			db.Create(&report)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": report})
	}
}

func NotifyPaySettlement(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			SettlementID string  `json:"settlementId"`
			Status       string  `json:"status"`
			Amount       float64 `json:"amount"`
		}
		c.ShouldBindJSON(&req)
		if db != nil {
			db.Model(&model.PaySettlementReport{}).Where("id = ?", req.SettlementID).Updates(gin.H{"status": req.Status, "amount": req.Amount})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"settlementId": req.SettlementID, "status": req.Status, "amount": req.Amount}})
	}
}