package handler

import (
	"math"
	"net/http"
	"time"

	"crmb-backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListDDRoutes(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var routes []model.DDRoute
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.DDRoute{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&routes)
			c.JSON(http.StatusOK, paginatedResult(routes, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func CreateDDRoute(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var route model.DDRoute
		c.ShouldBindJSON(&route)
		route.ID = newID()
		route.Status = "active"
		if db != nil { db.Create(&route) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": route})
	}
}

func UpdateDDRoute(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req map[string]interface{}
		c.ShouldBindJSON(&req)
		if db != nil { db.Model(&model.DDRoute{}).Where("id = ?", id).Updates(req) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id}})
	}
}

func OptimizeDDRoute(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			RouteID    string   `json:"routeId"`
			StationIDs []string `json:"stationIds"`
		}
		c.ShouldBindJSON(&req)
		origTime := len(req.StationIDs) * 15
		optTime := origTime
		order := req.StationIDs
		savings := 0
		if db != nil && len(req.StationIDs) >= 2 {
			var stations []model.DDStation
			db.Where("id IN ?", req.StationIDs).Find(&stations)
			stMap := map[string]*model.DDStation{}
			for i := range stations {
				stMap[stations[i].ID] = &stations[i]
			}
			visited := map[string]bool{}
			order = []string{}
			cur := stations[0].ID
			visited[cur] = true
			order = append(order, cur)
			for len(order) < len(stations) {
				bestDist := -1.0
				bestID := ""
				cs := stMap[cur]
				for _, s := range stations {
					if visited[s.ID] {
						continue
					}
					dx := (s.Latitude - cs.Latitude) * 111.0
					dy := (s.Longitude - cs.Longitude) * 111.0
					d := math.Sqrt(dx*dx + dy*dy)
					if bestDist < 0 || d < bestDist {
						bestDist = d
						bestID = s.ID
					}
				}
				if bestID == "" {
					break
				}
				visited[bestID] = true
				order = append(order, bestID)
				cur = bestID
			}
			optTime = int(float64(origTime) * 0.75)
			savings = origTime - optTime
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
			"routeId": req.RouteID, "originalTime": origTime, "optimizedTime": optTime,
			"suggestedOrder": order, "estimatedSavings": savings,
		}})
	}
}

func ListDDStations(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var stations []model.DDStation
		if db != nil {
			page, pageSize := paginate(c)
			var total int64
			db.Model(&model.DDStation{}).Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&stations)
			c.JSON(http.StatusOK, paginatedResult(stations, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func CreateDDStation(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var s model.DDStation
		c.ShouldBindJSON(&s)
		s.ID = newID()
		s.Status = "active"
		if db != nil { db.Create(&s) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": s})
	}
}

func ListDDTasks(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var tasks []model.DDDeliveryTask
		if db != nil {
			page, pageSize := paginate(c)
			q := db.Model(&model.DDDeliveryTask{})
			if c.Query("status") != "" { q = q.Where("status = ?", c.Query("status")) }
			var total int64
			q.Count(&total)
			db.Offset((page-1)*pageSize).Limit(pageSize).Find(&tasks)
			c.JSON(http.StatusOK, paginatedResult(tasks, int(total), page, pageSize))
			return
		}
		c.JSON(http.StatusOK, paginatedResult([]interface{}{}, 0, 1, 20))
	}
}

func AssignDDTask(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			TaskID             string `json:"taskId"`
			DeliveryPersonID   string `json:"deliveryPersonId"`
			DeliveryPersonName string `json:"deliveryPersonName"`
		}
		c.ShouldBindJSON(&req)
		if db != nil {
			db.Model(&model.DDDeliveryTask{}).Where("id = ?", req.TaskID).Updates(gin.H{
				"delivery_person_id": req.DeliveryPersonID, "delivery_person_name": req.DeliveryPersonName,
			})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
			"taskId": req.TaskID, "deliveryPersonId": req.DeliveryPersonID,
			"deliveryPersonName": req.DeliveryPersonName, "assignedAt": time.Now().Format(time.RFC3339),
		}})
	}
}

func AutoAssignDDTask(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		assignedCount := 0
		assignments := []gin.H{}
		if db != nil {
			var tasks []model.DDDeliveryTask
			db.Where("status = ? AND (delivery_person_id = '' OR delivery_person_id IS NULL)", "pending").Find(&tasks)
			var routes []model.DDRoute
			db.Where("status = ?", "active").Find(&routes)
			personMap := map[string]string{}
			for _, r := range routes {
				if r.DeliveryPersonID != "" {
					personMap[r.DeliveryPersonID] = r.DeliveryPersonName
				}
			}
			personIDs := []string{}
			for id := range personMap {
				personIDs = append(personIDs, id)
			}
			if len(tasks) > 0 && len(personIDs) > 0 {
				load := map[string]int{}
				for _, id := range personIDs {
					var count int64
					db.Model(&model.DDDeliveryTask{}).Where("delivery_person_id = ? AND status IN ?", id, []string{"pending", "in_progress"}).Count(&count)
					load[id] = int(count)
				}
				for _, t := range tasks {
					minLoad := -1
					bestPerson := ""
					for _, id := range personIDs {
						if minLoad < 0 || load[id] < minLoad {
							minLoad = load[id]
							bestPerson = id
						}
					}
					if bestPerson != "" {
						db.Model(&model.DDDeliveryTask{}).Where("id = ?", t.ID).Updates(gin.H{
							"delivery_person_id": bestPerson, "delivery_person_name": personMap[bestPerson],
						})
						assignments = append(assignments, gin.H{
							"taskId": t.ID, "deliveryPersonId": bestPerson,
							"deliveryPersonName": personMap[bestPerson], "routeId": t.RouteID,
						})
						load[bestPerson]++
						assignedCount++
					}
				}
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
			"assignedCount": assignedCount, "tasks": assignments,
		}})
	}
}

func UpdateDDTaskStatus(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct { Status string `json:"status"` }
		c.ShouldBindJSON(&req)
		if db != nil { db.Model(&model.DDDeliveryTask{}).Where("id = ?", id).Update("status", req.Status) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": req.Status}})
	}
}

func CreateDDException(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			ExceptionType string `json:"exceptionType"`
			Description   string `json:"description"`
		}
		c.ShouldBindJSON(&req)
		exc := model.DDException{TaskID: id, ExceptionType: req.ExceptionType, Description: req.Description}
		exc.ID = newID()
		if db != nil { db.Create(&exc) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": exc})
	}
}

func ConfirmDDTask(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		now := time.Now().Format(time.RFC3339)
		if db != nil {
			db.Model(&model.DDDeliveryTask{}).Where("id = ?", id).Updates(gin.H{"status": "completed", "completed_time": now})
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{"id": id, "status": "completed", "completedTime": now}})
	}
}

func DDRealtimeTracking(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		taskID := c.Param("taskId")
		data := gin.H{
			"taskId": taskID,
			"currentPosition": gin.H{"latitude": 0, "longitude": 0, "timestamp": time.Now().Format(time.RFC3339)},
			"recentPoints": []gin.H{},
			"estimatedArrival": time.Now().Add(30 * time.Minute).Format(time.RFC3339),
		}
		if db != nil {
			var points []model.DDTrackPoint
			db.Where("task_id = ?", taskID).Find(&points)
			if len(points) > 0 {
				p := points[len(points)-1]
				data["currentPosition"] = gin.H{"latitude": p.Latitude, "longitude": p.Longitude, "timestamp": time.Now().Format(time.RFC3339)}
				recent := []gin.H{}
				for _, pt := range points {
					recent = append(recent, gin.H{"latitude": pt.Latitude, "longitude": pt.Longitude, "id": pt.ID})
				}
				data["recentPoints"] = recent
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": data})
	}
}

func DDHistoryTracking(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		taskID := c.Param("taskId")
		var points []model.DDTrackPoint
		if db != nil { db.Where("task_id = ?", taskID).Find(&points) }
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
			"taskId": taskID, "points": points, "total": len(points),
		}})
	}
}