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

### 员工管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-001 | 作为一名HR人员 | 我希望能够录入员工信息（编号、姓名、部门、职位、联系方式） | 以便建立完整的员工档案 |
| REQ-002 | 作为一名HR人员 | 我希望能够管理员工状态（在职、离职、停职） | 以便跟踪员工在职状态变化 |
| REQ-003 | 作为一名HR人员 | 我希望能够查询和筛选员工信息 | 以便快速定位目标员工 |
| REQ-004 | 作为一名部门经理 | 我希望能够管理部门层级和人员配置 | 以便维护组织架构的准确性 |
| REQ-005 | 作为一名管理员 | 我希望能够查看组织架构可视化 | 以便直观了解公司整体组织结构 |

### 考勤管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-006 | 作为一名员工 | 我希望能够签到签退打卡 | 以便记录自己的出勤时间 |
| REQ-007 | 作为一名HR人员 | 我希望能够统计考勤状态（出勤、缺勤、迟到、请假） | 以便掌握员工整体考勤情况 |
| REQ-008 | 作为一名HR人员 | 我希望能够生成考勤报表 | 以便为薪资核算和考勤分析提供数据支持 |
| REQ-009 | 作为一名员工 | 我希望能够提交请假申请 | 以便申请并获得休假许可 |
| REQ-010 | 作为一名部门经理 | 我希望能够审批请假申请 | 以便合理管控团队人员的请假安排 |
| REQ-011 | 作为一名员工 | 我能够查询自己的请假记录 | 以便了解个人请假历史和剩余假期 |
| REQ-012 | 作为一名员工 | 我能够通过GPS定位打卡 | 以便在外出办公时也能完成考勤打卡 |
| REQ-013 | 作为一名员工 | 我能够收到打卡提醒通知 | 以便避免忘记打卡导致考勤异常 |

### 绩效管理需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-014 | 作为一名HR人员 | 我能够设定考核指标 | 以便建立科学的绩效考核标准 |
| REQ-015 | 作为一名部门经理 | 我能够录入考核评分 | 以便对团队成员进行客观的绩效评价 |
| REQ-016 | 作为一名HR人员 | 我能够汇总考核结果 | 以便生成整体绩效考核报告 |
| REQ-017 | 作为一名HR人员 | 我能够设置评估周期 | 以便定期开展绩效评估工作 |
| REQ-018 | 作为一名HR人员 | 我能够管理评估流程 | 以便确保绩效评估按规范流程执行 |
| REQ-019 | 作为一名管理员 | 我能够审核评估结果 | 以便确保绩效评估的公平性和准确性 |
| REQ-020 | 作为一名员工 | 我能够查看个人绩效统计 | 以便了解自己的绩效表现和发展方向 |
| REQ-021 | 作为一名部门经理 | 我能够对比团队绩效 | 以便识别团队间绩效差异和改进空间 |
| REQ-022 | 作为一名HR人员 | 我能够分析绩效趋势 | 以便发现绩效变化规律并制定改善策略 |

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