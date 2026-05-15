package model

type Employee struct {
	BaseModel
	EmployeeNo     string `gorm:"size:32;uniqueIndex;not null" json:"employeeNo"`
	Name           string `gorm:"size:64;not null" json:"name"`
	DepartmentID   string `gorm:"size:64" json:"departmentId"`
	DepartmentName string `gorm:"size:64" json:"departmentName"`
	Position       string `gorm:"size:64" json:"position"`
	Phone          string `gorm:"size:20" json:"phone"`
	Email          string `gorm:"size:128" json:"email"`
	HireDate       string `gorm:"size:20" json:"hireDate"`
	Status         string `gorm:"size:16;default:active" json:"status"`
	Avatar         string `gorm:"size:256" json:"avatar"`
}

type AttendanceRecord struct {
	BaseModel
	EmployeeID   string `gorm:"size:64;not null" json:"employeeId"`
	EmployeeName string `gorm:"size:64" json:"employeeName"`
	Date         string `gorm:"size:20;not null" json:"date"`
	CheckInTime  string `gorm:"size:10" json:"checkInTime"`
	CheckOutTime string `gorm:"size:10" json:"checkOutTime"`
	Status       string `gorm:"size:16;default:present" json:"status"`
	LeaveType    string `gorm:"size:32" json:"leaveType"`
	LeaveReason  string `gorm:"size:256" json:"leaveReason"`
}

type PerformanceReview struct {
	BaseModel
	EmployeeID   string `gorm:"size:64;not null" json:"employeeId"`
	EmployeeName string `gorm:"size:64" json:"employeeName"`
	ReviewerID   string `gorm:"size:64" json:"reviewerId"`
	ReviewerName string `gorm:"size:64" json:"reviewerName"`
	Period       string `gorm:"size:20" json:"period"`
	Score        float64 `json:"score"`
	Comments     string `gorm:"type:text" json:"comments"`
	Status       string `gorm:"size:16;default:draft" json:"status"`
	SubmittedAt  string `gorm:"size:30" json:"submittedAt"`
	ApprovedAt   string `gorm:"size:30" json:"approvedAt"`
}