package handler

import (
	"net/http"
	"time"

	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListEmployees(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var employees []model.Employee
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.Employee{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&employees)
			c.JSON(http.StatusOK, paginatedResult(employees, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func ListAttendance(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var records []model.AttendanceRecord
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.AttendanceRecord{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&records)
			c.JSON(http.StatusOK, paginatedResult(records, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func ListPerformance(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var reviews []model.PerformanceReview
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.PerformanceReview{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&reviews)
			c.JSON(http.StatusOK, paginatedResult(reviews, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func CheckIn(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, _ := c.Get("userId")
		now := time.Now()
		record := model.AttendanceRecord{
			EmployeeID:   userId.(string),
			EmployeeName: c.GetString("username"),
			Date:         now.Format("2006-01-02"),
			CheckInTime:  now.Format("15:04"),
			Status:       "present",
		}
		record.ID = newID()
		if db != nil {
			db.Create(&record)
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": record})
	}
}

func CheckOut(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, _ := c.Get("userId")
		now := time.Now()
		date := now.Format("2006-01-02")
		if db != nil {
			db.Model(&model.AttendanceRecord{}).Where("employee_id = ? AND date = ?", userId, date).Update("check_out_time", now.Format("15:04"))
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
			"employeeId": userId, "date": date, "checkOutTime": now.Format("15:04"), "status": "present",
		}})
	}
}