package handler

import (
	"net/http"
	"time"

	"crmb-backend/internal/config"
	"crmb-backend/internal/middleware"
	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "ok",
		"message":   "CRMB backend server is running",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

func Login(db *gorm.DB, cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid request"})
			return
		}

		var user model.User
		if db == nil || db.Where("username = ?", req.Username).First(&user).Error != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "invalid username or password"})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "invalid username or password"})
			return
		}

		token, err := middleware.GenerateToken(user.ID, user.Username, user.Role, &cfg.JWT)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"code":    200,
			"message": "success",
			"data": gin.H{
				"token": token,
				"userInfo": gin.H{
					"id":         user.ID,
					"username":   user.Username,
					"name":       user.Name,
					"role":       user.Role,
					"department": user.Department,
					"phone":      user.Phone,
					"email":      user.Email,
				},
			},
		})
	}
}

func UserInfo(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, _ := c.Get("userId")
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"code": 200, "message": "success",
				"data": gin.H{
					"id": userID, "username": c.GetString("username"),
					"role": c.GetString("role"),
				},
			})
			return
		}

		var user model.User
		if db.Where("id = ?", userID).First(&user).Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "user not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"code": 200, "message": "success",
			"data": gin.H{
				"id": user.ID, "username": user.Username, "name": user.Name,
				"role": user.Role, "department": user.Department,
				"phone": user.Phone, "email": user.Email,
			},
		})
	}
}

func newID() string {
	return uuid.New().String()
}