package handler

import (
	"fmt"
	"net/http"
	"time"

	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListFinTransactions(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.FinTransaction
		if db != nil {
			page, pageSize := paginate(c)
			query := db.Model(&model.FinTransaction{})
			if t := c.Query("type"); t != "" {
				query = query.Where("type = ?", t)
			}
			if s := c.Query("status"); s != "" {
				query = query.Where("status = ?", s)
			}
			if sd := c.Query("startDate"); sd != "" {
				if parsed, err := time.Parse("2006-01-02", sd); err == nil {
					query = query.Where("created_at >= ?", parsed)
				}
			}
			if ed := c.Query("endDate"); ed != "" {
				if parsed, err := time.Parse("2006-01-02", ed); err == nil {
					query = query.Where("created_at < ?", parsed.AddDate(0, 0, 1))
				}
			}
			var total int64
			query.Count(&total)
			query.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func ListFinReconciliations(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.FinReconciliation
		if db != nil {
			page, pageSize := paginate(c)
			query := db.Model(&model.FinReconciliation{})
			if t := c.Query("type"); t != "" {
				query = query.Where("type = ?", t)
			}
			if s := c.Query("status"); s != "" {
				query = query.Where("status = ?", s)
			}
			if sd := c.Query("startDate"); sd != "" {
				if parsed, err := time.Parse("2006-01-02", sd); err == nil {
					query = query.Where("created_at >= ?", parsed)
				}
			}
			if ed := c.Query("endDate"); ed != "" {
				if parsed, err := time.Parse("2006-01-02", ed); err == nil {
					query = query.Where("created_at < ?", parsed.AddDate(0, 0, 1))
				}
			}
			var total int64
			query.Count(&total)
			query.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func ListFinReports(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []model.FinReport
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.FinReport{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&items)
			c.JSON(http.StatusOK, paginatedResult(items, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func GenerateFinReport(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Type      string `json:"type"`
			Period    string `json:"period"`
			StartDate string `json:"startDate"`
			EndDate   string `json:"endDate"`
		}
		c.ShouldBindJSON(&req)
		report := model.FinReport{
			ReportNo: fmt.Sprintf("REP%d%s", time.Now().Year(), fmt.Sprintf("%06d", time.Now().Unix()%1000000)),
			Type: req.Type, Period: req.Period, Status: "draft",
		}
		report.ID = newID()
		if db != nil {
			startTime, _ := time.Parse("2006-01-02", req.StartDate)
			endTime, _ := time.Parse("2006-01-02", req.EndDate)
			if !endTime.IsZero() {
				endTime = endTime.AddDate(0, 0, 1)
			}
			var totalIncome, totalExpense float64
			incomeQ := db.Model(&model.FinTransaction{}).Where("type = ?", "income")
			expenseQ := db.Model(&model.FinTransaction{}).Where("type = ?", "expense")
			orderCountQ := db.Model(&model.Order{})
			customerCountQ := db.Model(&model.Order{})
			if !startTime.IsZero() {
				incomeQ = incomeQ.Where("created_at >= ?", startTime)
				expenseQ = expenseQ.Where("created_at >= ?", startTime)
				orderCountQ = orderCountQ.Where("created_at >= ?", startTime)
				customerCountQ = customerCountQ.Where("created_at >= ?", startTime)
			}
			if !endTime.IsZero() {
				incomeQ = incomeQ.Where("created_at < ?", endTime)
				expenseQ = expenseQ.Where("created_at < ?", endTime)
				orderCountQ = orderCountQ.Where("created_at < ?", endTime)
				customerCountQ = customerCountQ.Where("created_at < ?", endTime)
			}
			incomeQ.Select("COALESCE(SUM(amount), 0)").Scan(&totalIncome)
			expenseQ.Select("COALESCE(SUM(amount), 0)").Scan(&totalExpense)
			var orderCount, customerCount int64
			orderCountQ.Count(&orderCount)
			customerCountQ.Distinct("user_id").Count(&customerCount)
			db.Create(&report)
			reportData := model.FinReportData{
				ID:            newID(),
				ReportID:      report.ID,
				TotalIncome:   totalIncome,
				TotalExpense:  totalExpense,
				NetProfit:     totalIncome - totalExpense,
				OrderCount:    int(orderCount),
				CustomerCount: int(customerCount),
			}
			db.Create(&reportData)
			c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
				"report": report, "reportData": reportData,
			}})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
			"report": report,
		}})
	}
}