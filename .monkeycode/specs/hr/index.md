# 人事模块 - 需求与设计文档

**模块名称**: hr  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 第一部分：需求概述

### 1.1 模块介绍

人事模块负责员工管理、岗位管理、行政奖惩、账号权限、报销、排班打卡和绩效管理。支持电脑端和手机端。

### 1.2 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 员工 | 查看个人信息、打卡、请假、报销 | 个人相关功能 |
| 部门主管 | 部门管理、排班、审批 | 部门相关功能 |
| 人事专员 | 员工管理、考勤管理 | 人事基础功能 |
| 人事主管 | 人事全模块、审批 | 人事全模块 |
| 管理员 | 全局管理 | 所有功能 |

### 1.3 子模块列表

| 子模块 | 电脑端 | 手机端 | 核心功能 |
|--------|--------|--------|----------|
| 人事 | ✅ | ✅ | 员工管理、岗位管理、奖惩、站内信 |
| 账号权限 | ✅ | ✅ | 账号管理、角色管理 |
| 报销 | ✅ | ✅ | 报销申请、报销管理 |
| 排班打卡 | ✅ | ✅ | 排班、打卡、请假 |
| 尖刀管理 | ✅ | ✅ | 人员地图、指标管理 |

---

## 第二部分：功能需求

### 2.1 人事管理

#### 功能描述
管理员工信息和行政事务。

#### 核心功能
1. **员工管理**
   - 员工列表
   - 员工详情
   - 入职/离职
   - 信息编辑
   - 调岗记录

2. **岗位管理**
   - 岗位列表
   - 岗位创建/编辑
   - 岗位职责

3. **行政奖惩**
   - 奖励记录
   - 惩罚记录
   - 奖惩申请

4. **站内信**
   - 消息列表
   - 消息详情
   - 发送消息

---

### 2.2 账号权限

#### 功能描述
管理系统账号和权限。

#### 核心功能
1. **账号管理**
   - 账号列表
   - 创建账号
   - 删除账号
   - 禁用/解除禁用

2. **角色管理**
   - 角色列表
   - 角色创建
   - 权限配置

---

### 2.3 报销管理

#### 功能描述
管理员工报销申请。

#### 核心功能
1. **报销列表**
   - 筛选（状态、类型、时间）
   - 搜索（申请人、金额）

2. **报销详情**
   - 报销类型
   - 报销金额
   - 报销凭证
   - 审批进度

3. **报销操作**
   - 提交报销
   - 审批报销
   - 驳回报销

---

### 2.4 排班打卡

#### 功能描述
管理员工排班和考勤。

#### 核心功能
1. **排班**
   - 排班表
   - 创建排班
   - 调整排班

2. **打卡**
   - 打卡记录
   - 打卡统计
   - 异常打卡

3. **请假**
   - 请假申请
   - 请假审批
   - 请假记录

---

### 2.5 尖刀管理

#### 功能描述
人员地图和绩效管理。

#### 核心功能
1. **人员地图**
   - 外勤人员位置
   - 人员轨迹
   - 实时定位

2. **指标管理**
   - 绩效指标配置
   - 指标完成情况
   - 绩效统计

---

## 第三部分：数据模型

### 3.1 员工

```typescript
interface Employee {
  id: string;
  employeeNo: string;                             // 工号
  name: string;
  gender: 'male' | 'female';
  phone: string;
  email?: string;
  idCard: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionName: string;
  managerId?: string;
  managerName?: string;
  entryDate: string;
  leaveDate?: string;
  status: 'active' | 'inactive' | 'terminated';
  avatar?: string;
  transferRecords: TransferRecord[];
}

interface TransferRecord {
  id: string;
  fromDepartment: string;
  toDepartment: string;
  fromPosition: string;
  toPosition: string;
  reason: string;
  effectiveDate: string;
}
```

### 3.2 岗位

```typescript
interface Position {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  departmentName: string;
  level: string;                                  // 职级
  description: string;                            // 岗位职责
  requirements: string;                           // 任职要求
  headcount: number;                              // 编制人数
  currentCount: number;                           // 当前人数
  status: 'active' | 'inactive';
}
```

### 3.3 奖惩记录

```typescript
interface RewardPunishment {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'reward' | 'punishment';
  category: string;                               // 奖励/惩罚类型
  reason: string;
  amount?: number;                                // 金额（奖金/罚款）
  status: 'pending' | 'approved' | 'rejected';
  applicantId: string;
  applicantName: string;
  approverId?: string;
  approverName?: string;
  createdAt: string;
  approvedAt?: string;
}
```

### 3.4 账号

```typescript
interface Account {
  id: string;
  username: string;
  employeeId?: string;
  employeeName?: string;
  phone: string;
  status: 'active' | 'disabled';
  roles: string[];
  lastLoginAt?: string;
  createdAt: string;
}
```

### 3.5 角色

```typescript
interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### 3.6 报销

```typescript
interface Reimbursement {
  id: string;
  reimbursementNo: string;
  employeeId: string;
  employeeName: string;
  type: 'travel' | 'meal' | 'transport' | 'office' | 'other';
  amount: number;
  reason: string;
  vouchers: string[];                             // 凭证图片
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approverId?: string;
  approverName?: string;
  approveRemark?: string;
  createdAt: string;
  approvedAt?: string;
}
```

### 3.7 排班

```typescript
interface Schedule {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night' | 'rest';
  startTime?: string;
  endTime?: string;
  status: 'scheduled' | 'adjusted' | 'cancelled';
}
```

### 3.8 打卡记录

```typescript
interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockInTime?: string;
  clockInLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  clockOutTime?: string;
  clockOutLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'normal' | 'late' | 'early_leave' | 'absent' | 'missing';
  workHours?: number;
}
```

### 3.9 请假

```typescript
interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'sick' | 'personal' | 'annual' | 'marriage' | 'maternity' | 'other';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approverId?: string;
  approverName?: string;
  approveRemark?: string;
  createdAt: string;
}
```

### 3.10 绩效指标

```typescript
interface PerformanceIndicator {
  id: string;
  name: string;
  departmentId?: string;
  departmentName?: string;
  type: 'sales' | 'attendance' | 'quality' | 'service' | 'other';
  weight: number;                                 // 权重
  target: number;                                 // 目标值
  description: string;
  status: 'active' | 'inactive';
}

interface PerformanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;                                 // 考核周期 YYYY-MM
  indicators: {
    indicatorId: string;
    indicatorName: string;
    target: number;
    actual: number;
    score: number;
    weight: number;
  }[];
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  reviewerId: string;
  reviewerName: string;
  createdAt: string;
}
```

---

## 第四部分：API 接口设计

```typescript
// 基础路径：/api/hr

// 员工管理
GET  /api/hr/employees                             // 员工列表
POST /api/hr/employees                             // 创建员工
PUT  /api/hr/employees/:id                         // 编辑员工

// 账号管理
GET  /api/hr/accounts                              // 账号列表
POST /api/hr/accounts                              // 创建账号
PUT  /api/hr/accounts/:id/status                   // 禁用/启用

// 角色管理
GET  /api/hr/roles                                 // 角色列表
POST /api/hr/roles                                 // 创建角色
PUT  /api/hr/roles/:id/permissions                 // 配置权限

// 报销
GET  /api/hr/reimbursements                        // 报销列表
POST /api/hr/reimbursements                        // 提交报销
PUT  /api/hr/reimbursements/:id/approve            // 审批报销

// 排班打卡
GET  /api/hr/schedules                             // 排班列表
POST /api/hr/schedules                             // 创建排班
GET  /api/hr/attendances                           // 打卡记录
POST /api/hr/attendances/clock                     // 打卡

// 请假
GET  /api/hr/leaves                                // 请假列表
POST /api/hr/leaves                                // 请假申请
PUT  /api/hr/leaves/:id/approve                    // 审批请假

// 人员地图
GET  /api/hr/staff-map                             // 人员位置
GET  /api/hr/staff-tracks/:id                      // 人员轨迹

// 绩效指标
GET  /api/hr/performance-indicators                // 指标列表
POST /api/hr/performance-indicators                // 创建指标
```

---

## 第五部分：前端设计

### 5.1 目录结构

```
src/
├── views/
│   └── hr/
│       ├── employees/
│       │   ├── List.vue
│       │   └── Detail.vue
│       ├── accounts/
│       │   ├── List.vue
│       │   └── Create.vue
│       ├── roles/
│       │   ├── List.vue
│       │   └── Create.vue
│       ├── reimbursements/
│       │   ├── List.vue
│       │   └── Create.vue
│       ├── schedules/
│       │   └── List.vue
│       ├── attendances/
│       │   └── List.vue
│       ├── leaves/
│       │   ├── List.vue
│       │   └── Create.vue
│       └── staff-map/
│           └── Index.vue
├── stores/
│   └── hr.js
├── api/
│   └── hr.js
└── mock/
    └── hr.js
```

---

## 第六部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 员工管理 + 岗位 | 3 天 |
| 2 | 账号权限 | 3 天 |
| 3 | 报销管理 | 2 天 |
| 4 | 排班打卡 | 3 天 |
| 5 | 尖刀管理 | 2 天 |
| 6 | 联调测试 | 3 天 |
| **总计** | | **16 天** |
