package handler

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func DCQuery(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Module    string   `json:"module"`
			Metrics   []string `json:"metrics"`
			StartDate string   `json:"startDate"`
			EndDate   string   `json:"endDate"`
		}
		c.ShouldBindJSON(&req)
		results := gin.H{}
		if db != nil {
			switch req.Module {
			case "sales":
				var totalSales float64
				var orderCount int64
				db.Model(&model.Order{}).Where("created_at BETWEEN ? AND ?", req.StartDate, req.EndDate).Select("COALESCE(SUM(pay_amount), 0)").Scan(&totalSales)
				db.Model(&model.Order{}).Where("created_at BETWEEN ? AND ?", req.StartDate, req.EndDate).Count(&orderCount)
				avg := 0.0
				if orderCount > 0 {
					avg = totalSales / float64(orderCount)
				}
				results = gin.H{"totalSales": totalSales, "orderCount": orderCount, "avgOrderAmount": avg}
			case "user":
				var totalUsers int64
				var newUsers int64
				db.Model(&model.User{}).Count(&totalUsers)
				db.Model(&model.User{}).Where("created_at BETWEEN ? AND ?", req.StartDate, req.EndDate).Count(&newUsers)
				results = gin.H{"totalUsers": totalUsers, "newUsers": newUsers}
			case "product":
				var productCount int64
				var totalSalesCount int64
				db.Model(&model.Product{}).Where("status = ?", "on_sale").Count(&productCount)
				db.Model(&model.Product{}).Select("COALESCE(SUM(sales_count), 0)").Scan(&totalSalesCount)
				results = gin.H{"productCount": productCount, "totalSalesCount": totalSalesCount}
			default:
				results = gin.H{}
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
			"module": req.Module, "metrics": req.Metrics, "startDate": req.StartDate, "endDate": req.EndDate,
			"results": results,
		}})
	}
}

func DCRealtime(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		data := gin.H{
			"currentSales": 0, "currentOrders": 0, "activeUsers": 0, "onlineMerchants": 0,
			"timestamp": time.Now().Format(time.RFC3339),
		}
		if db != nil {
			today := time.Now().Format("2006-01-02")
			var currentSales float64
			var currentOrders int64
			db.Model(&model.Order{}).Where("DATE(created_at) = ?", today).Select("COALESCE(SUM(pay_amount), 0)").Scan(&currentSales)
			db.Model(&model.Order{}).Where("DATE(created_at) = ?", today).Count(&currentOrders)
			var activeUsers int64
			db.Model(&model.User{}).Where("status = ?", "active").Count(&activeUsers)
			var onlineMerchants int64
			db.Model(&model.Store{}).Where("status = ?", "approved").Count(&onlineMerchants)
			data = gin.H{
				"currentSales": currentSales, "currentOrders": currentOrders,
				"activeUsers": activeUsers, "onlineMerchants": onlineMerchants,
				"timestamp": time.Now().Format(time.RFC3339),
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": data})
	}
}

func DCHistory(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		startDate := c.DefaultQuery("startDate", "2025-05-01")
		endDate := c.DefaultQuery("endDate", "2025-05-10")
		module := c.DefaultQuery("module", "sales")
		records := []gin.H{}
		if db != nil {
			type DayVal struct {
				Date  string
				Value float64
			}
			var results []DayVal
			if module == "user" {
				db.Model(&model.User{}).
					Where("created_at BETWEEN ? AND ?", startDate, endDate).
					Select("DATE(created_at) as date, COUNT(*) as value").
					Group("DATE(created_at)").Scan(&results)
			} else {
				db.Model(&model.Order{}).
					Where("created_at BETWEEN ? AND ?", startDate, endDate).
					Select("DATE(created_at) as date, COALESCE(SUM(pay_amount), 0) as value").
					Group("DATE(created_at)").Scan(&results)
			}
			for _, r := range results {
				records = append(records, gin.H{"date": r.Date, "value": r.Value})
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
			"startDate": startDate, "endDate": endDate, "module": module, "records": records,
		}})
	}
}

func DCSalesAnalysis(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		data := gin.H{"totalSales": 0, "orderCount": 0, "avgOrderAmount": 0, "topProducts": []gin.H{}}
		if db != nil {
			var totalSales float64
			var orderCount int64
			db.Model(&model.Order{}).Select("COALESCE(SUM(pay_amount), 0)").Scan(&totalSales)
			db.Model(&model.Order{}).Count(&orderCount)
			avg := 0.0
			if orderCount > 0 {
				avg = totalSales / float64(orderCount)
			}
			type TopProduct struct {
				Sku   string
				Name  string
				Sales int
			}
			var topProds []TopProduct
			db.Model(&model.Product{}).Order("sales_count desc").Limit(5).
				Select("sku, name, sales_count as sales").Scan(&topProds)
			tp := []gin.H{}
			for _, p := range topProds {
				tp = append(tp, gin.H{"sku": p.Sku, "name": p.Name, "sales": p.Sales})
			}
			data = gin.H{"totalSales": totalSales, "orderCount": orderCount, "avgOrderAmount": avg, "topProducts": tp}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": data})
	}
}

func DCUserAnalysis(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		data := gin.H{"totalUsers": 0, "newUsers": 0, "activeUsers": 0, "retentionRate": 0}
		if db != nil {
			var totalUsers, activeUsers, newUsers int64
			db.Model(&model.User{}).Count(&totalUsers)
			db.Model(&model.User{}).Where("status = ?", "active").Count(&activeUsers)
			thirtyDaysAgo := time.Now().AddDate(0, 0, -30).Format("2006-01-02 15:04:05")
			db.Model(&model.User{}).Where("created_at >= ?", thirtyDaysAgo).Count(&newUsers)
			retention := 0.0
			if totalUsers > 0 {
				retention = float64(activeUsers) / float64(totalUsers)
			}
			data = gin.H{"totalUsers": totalUsers, "newUsers": newUsers, "activeUsers": activeUsers, "retentionRate": retention}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": data})
	}
}

func DCProductAnalysis(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		data := gin.H{"topProducts": []gin.H{}}
		if db != nil {
			type TopProd struct {
				Sku     string
				Name    string
				Sales   int
				Revenue float64
			}
			var top []TopProd
			db.Model(&model.Product{}).Order("sales_count desc").Limit(10).
				Select("sku, name, sales_count as sales, sales_count * price as revenue").Scan(&top)
			tp := []gin.H{}
			for _, p := range top {
				tp = append(tp, gin.H{"sku": p.Sku, "name": p.Name, "sales": p.Sales, "revenue": p.Revenue})
			}
			data = gin.H{"topProducts": tp}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": data})
	}
}

func DCChannelAnalysis(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		data := gin.H{"channels": []gin.H{}}
		if db != nil {
			type ChannelRow struct {
				Name    string
				Orders  int64
				Revenue float64
			}
			var channels []ChannelRow
			db.Model(&model.Order{}).
				Select("pay_type as name, COUNT(*) as orders, COALESCE(SUM(pay_amount), 0) as revenue").
				Group("pay_type").Scan(&channels)
			ch := []gin.H{}
			for _, row := range channels {
				ch = append(ch, gin.H{"name": row.Name, "orders": row.Orders, "revenue": row.Revenue})
			}
			data = gin.H{"channels": ch}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": data})
	}
}

func ListDCReportTemplates(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.DCReportTemplate
		if db != nil { db.Find(&items) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"list": items, "total": len(items)}})
	}
}

func GenerateDCReport(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			TemplateID string `json:"templateId"`
			StartDate  string `json:"startDate"`
			EndDate    string `json:"endDate"`
		}
		c.ShouldBindJSON(&req)
		report := model.DCReport{
			TemplateID: req.TemplateID, Type: "daily",
			StartDate: req.StartDate, EndDate: req.EndDate, Status: "generating",
		}
		report.ID = newID()
		if db != nil { db.Create(&report) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": report})
	}
}

func ExportDCReport(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		format := c.DefaultQuery("format", "excel")
		downloadURL := fmt.Sprintf("/api/files/report-%s.%s", id, format)
		generatedAt := time.Now().Format(time.RFC3339)
		if db != nil {
			var report model.DCReport
			db.Where("id = ?", id).First(&report)
			if report.ID != "" {
				db.Model(&report).Update("status", "completed")
				downloadURL = fmt.Sprintf("/api/files/report-%s.%s", id, format)
				generatedAt = time.Now().Format(time.RFC3339)
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
			"id": id, "format": format, "downloadUrl": downloadURL, "generatedAt": generatedAt,
		}})
	}
}

func GetDCAutoExportConfig(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		data := gin.H{
			"enabled": true, "frequency": "daily", "time": "08:00",
			"recipients": []string{}, "format": "excel", "lastExportAt": "",
		}
		if db != nil {
			var config model.DCAutoExportConfig
			db.First(&config)
			if config.ID != "" {
				recipients := []string{}
				if config.Recipients != "" {
					recipients = strings.Split(config.Recipients, ",")
				}
				data = gin.H{
					"enabled": config.Enabled, "frequency": config.Frequency,
					"time": config.Time, "recipients": recipients,
					"format": config.Format, "lastExportAt": config.LastExportAt,
				}
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": data})
	}
}

func UpdateDCAutoExportConfig(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req map[string]interface{}
		c.ShouldBindJSON(&req)
		if db != nil {
			updateMap := map[string]interface{}{}
			for k, v := range req {
				if k == "recipients" {
					if arr, ok := v.([]interface{}); ok {
						parts := []string{}
						for _, a := range arr {
							parts = append(parts, fmt.Sprintf("%v", a))
						}
						updateMap[k] = strings.Join(parts, ",")
					} else {
						updateMap[k] = fmt.Sprintf("%v", v)
					}
				} else {
					updateMap[k] = v
				}
			}
			var config model.DCAutoExportConfig
			db.First(&config)
			if config.ID != "" {
				db.Model(&config).Updates(updateMap)
			} else {
				cfg := model.DCAutoExportConfig{ID: newID()}
				if v, ok := updateMap["enabled"]; ok { cfg.Enabled = v.(bool) }
				if v, ok := updateMap["frequency"]; ok { cfg.Frequency = fmt.Sprintf("%v", v) }
				if v, ok := updateMap["time"]; ok { cfg.Time = fmt.Sprintf("%v", v) }
				if v, ok := updateMap["format"]; ok { cfg.Format = fmt.Sprintf("%v", v) }
				if v, ok := updateMap["recipients"]; ok { cfg.Recipients = fmt.Sprintf("%v", v) }
				db.Create(&cfg)
				req["id"] = cfg.ID
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": req})
	}
}