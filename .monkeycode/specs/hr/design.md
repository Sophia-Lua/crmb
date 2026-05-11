# 人事模块 - 设计文档

**模块名称**: hr  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 1. 数据模型设计

### 1.1 员工信息
```typescript
interface Employee {
  id: string;
  employeeNo: string;
  name: string;
  departmentId: string;
  departmentName: string;
  position: string;
  phone: string;
  email: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'resigned';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 1.2 考勤记录
```typescript
interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  leaveType?: string;
  leaveReason?: string;
  createdAt: string;
}
```

### 1.3 绩效考核
```typescript
interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  period: string;
  score: number;
  comments: string;
  status: 'draft' | 'submitted' | 'approved';
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
}
```

---

## 2. API 接口设计

**基础路径**: `/api/hr`

- `GET /api/hr/employees` - 员工列表
- `GET /api/hr/attendance` - 考勤记录
- `GET /api/hr/performance` - 绩效考核
- `POST /api/hr/attendance/check-in` - 打卡签到
- `POST /api/hr/attendance/check-out` - 打卡签退
