# 人事模块 - Speckit 需求规格

## 模块信息
- **模块名称**: hr
- **模块介绍**: 人事模块负责员工管理、考勤、绩效等人力资源相关工作。支持电脑端和手机端。
- **支持平台**: 电脑端 Web + 手机端 UniApp
- **总工期**: 12天
- **版本**: v1.0
- **更新日期**: 2026-05-09

---

## 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| HR人员 | 员工管理、考勤管理 | HR相关功能 |
| 部门经理 | 绩效管理、团队管理 | 团队相关功能 |
| 员工 | 查看个人信息、考勤记录 | 个人相关功能 |
| 管理员 | 全局管理 | 所有功能 |

---

## 子模块清单

| 子模块 | 电脑端 | 手机端 | 核心功能 | 状态 |
|--------|--------|--------|----------|------|
| 员工管理 | ✅ | ✅ | 员工信息、组织架构 | 未开始 |
| 考勤 | ✅ | ✅ | 考勤记录、请假管理 | 未开始 |
| 绩效 | ✅ | ✅ | 绩效考核、评估 | 未开始 |

---

## 功能需求

### FR-001: 员工管理
**优先级**: P0
**描述**: 管理员工基本信息和组织架构

**子功能**:
- FR-001-1: 员工信息管理
  - 员工信息录入（编号、姓名、部门、职位、联系方式）
  - 员工状态管理（在职、离职、停职）
  - 员工信息查询和筛选

- FR-001-2: 组织架构管理
  - 部门层级管理
  - 部门人员配置
  - 组织架构可视化

### FR-002: 考勤管理
**优先级**: P0
**描述**: 管理员工考勤记录和请假审批

**子功能**:
- FR-002-1: 考勤记录
  - 签到/签退打卡
  - 考勤状态统计（出勤、缺勤、迟到、请假）
  - 考勤报表生成

- FR-002-2: 请假管理
  - 请假申请提交
  - 请假审批流程
  - 请假记录查询

- FR-002-3: 手机端打卡
  - GPS定位打卡
  - 打卡提醒通知

### FR-003: 绩效管理
**优先级**: P1
**描述**: 管理员工绩效考核和评估

**子功能**:
- FR-003-1: 绩效考核
  - 考核指标设定
  - 考核评分录入
  - 考核结果汇总

- FR-003-2: 评估管理
  - 评估周期设置
  - 评估流程管理
  - 评估结果审核

- FR-003-3: 绩效统计
  - 个人绩效统计
  - 团队绩效对比
  - 绩效趋势分析

---

## 数据模型

### Employee (员工)
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

### AttendanceRecord (考勤记录)
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

### PerformanceReview (绩效考核)
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

## API 接口

**基础路径**: `/api/hr`

### 员工管理 API
- `GET /api/hr/employees` - 员工列表
- `GET /api/hr/employees/:id` - 员工详情
- `POST /api/hr/employees` - 创建员工
- `PUT /api/hr/employees/:id` - 更新员工信息
- `DELETE /api/hr/employees/:id` - 删除员工

### 考勤管理 API
- `GET /api/hr/attendance` - 考勤记录列表
- `POST /api/hr/attendance/check-in` - 打卡签到
- `POST /api/hr/attendance/check-out` - 打卡签退

### 绩效管理 API
- `GET /api/hr/performance` - 绩效考核列表
- `POST /api/hr/performance` - 创建绩效考核
- `PUT /api/hr/performance/:id` - 更新绩效考核

---

## 技术栈

| 项目 | 电脑端 | 手机端 |
|------|--------|--------|
| 框架 | Vue 3.3+ | UniApp (Vue3) |
| UI 组件 | Element Plus 2.x | uView Plus 3.x |
| 状态管理 | Pinia 1.x | Pinia 1.x |
| HTTP 客户端 | Axios 1.x | uni.request |

---

## 权限控制

### 路由权限
- `hr:employees:view`: 查看员工信息
- `hr:employees:manage`: 管理员工信息
- `hr:attendance:view`: 查看考勤记录
- `hr:attendance:check`: 考勤打卡
- `hr:performance:view`: 查看绩效考核
- `hr:performance:manage`: 管理绩效考核

### 数据权限
- HR人员：所有员工数据
- 部门经理：本团队员工数据
- 员工：仅个人数据

---

## 完成进度

| 模块 | 前端页面 | 后端API | 数据库 | 状态 |
|------|---------|---------|--------|------|
| 员工管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 考勤 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 绩效 | ❌ 0/0 | ❌ | ❌ | 未开始 |

**总工期**: 12天
**阶段1 员工管理**: 3天（未开始）
**阶段2 考勤开发**: 4天（未开始）
**阶段3 绩效开发**: 3天（未开始）
**阶段4 联调测试**: 2天（未开始）