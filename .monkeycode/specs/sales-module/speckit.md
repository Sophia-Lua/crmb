# 销售模块 - Speckit 需求规格

## 模块信息
- **模块名称**: sales-module
- **模块介绍**: 商城配送系统的核心业务模块，管理销售人员的客户开发、拜访、店铺审核等业务流程
- **支持平台**: 电脑端 Web + 手机端 UniApp
- **总工期**: 31天
- **版本**: v1.1
- **更新日期**: 2026-05-13

---

## 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 销售人员 | 客户拜访、店铺领取、客户跟进 | 自己的客户和拜访记录 |
| 销售经理 | 团队管理、店铺分配、数据查看 | 本团队所有数据 |
| 审核人员 | 店铺资质审核 | 店铺审核相关功能 |
| 管理员 | 全局管理、数据导出 | 所有数据和功能 |

---

## 子模块清单

| 子模块 | 电脑端 | 手机端 | 核心功能 | 状态 |
|--------|--------|--------|----------|------|
| 拜访记录 | ✅ | ✅ | 拜访新建、拜访列表、拜访详情 | 前端完成 |
| 待审核（新店） | ✅ | ✅ | 待领取店铺、待审核店铺 | 前端完成 |
| 客户管理 | ✅ | ✅ | 客户详情、客户跟进 | 前端完成 |
| 公海 | ✅ | ✅ | 公海客户池、筛选搜索 | 前端完成 |
| 私海 | ✅ | ✅ | 私海客户管理、客户分配 | 前端完成 |
| 销售地图 | ✅ | ✅ | 地图展示客户分布 | 页面就绪 |
| 客诉 | ✅ | ✅ | 客户投诉管理 | 前端完成 |
| 特殊备货需求 | ✅ | ✅ | 特殊需求列表查询 | 前端完成 |
| 特殊商品库 | ✅ | ✅ | 特殊商品监控和知识库 | 未开始 |
| 黑名单 | ✅ | ✅ | 黑名单客户管理 | 前端完成 |

---

## 功能需求

### FR-001: 拜访记录管理
**优先级**: P0
**描述**: 管理销售人员的客户拜访活动

**子功能**:
- FR-001-1: 拜访新建
  - 选择客户（公海/私海）
  - 选择拜访类型：首次拜访/定期回访/临时拜访/其他
  - 选择拜访方式：实地拜访/电话拜访/视频拜访/微信拜访
  - 填写拜访主题、内容、客户反馈、跟进计划
  - 上传图片附件（最多9张）
  - 保存草稿/提交

- FR-001-2: 拜访列表
  - 多维度筛选（状态、类型、方式、日期、客户名称）
  - 分页展示
  - 导出Excel
  - 统计面板（今日/本周/本月拜访数）

- FR-001-3: 拜访详情
  - 查看完整拜访信息
  - 编辑/删除（限草稿和待拜访状态）
  - 更新拜访状态
  - 添加跟进备注

### FR-002: 店铺管理
**优先级**: P0
**描述**: 管理新注册店铺的审核流程

**子功能**:
- FR-002-1: 待领取店铺
  - 列表/地图双视图
  - 筛选（类型、地区、注册时间）
  - 店铺领取
  - 距离计算

- FR-002-2: 待审核店铺
  - 审核列表
  - 审核详情（店铺信息、资质图片）
  - 审核通过/驳回
  - 驳回原因填写（必填，≥10字符）

- FR-002-3: 店铺分配
  - 选择销售人员
  - 查看销售人员负载
  - 分配通知

### FR-003: 客户管理
**优先级**: P0
**描述**: 管理销售人员的客户资源

**子功能**:
- FR-003-1: 客户详情
  - 基本信息（名称、类型、地址、联系人）
  - 经营信息（面积、营业时间、主营品类）
  - 历史拜访记录
  - 历史订单统计
  - 客户分级标识

- FR-003-2: 功能按钮
  - 编辑客户信息
  - 转移客户（经理权限）
  - 归还公海
  - 加入黑名单
  - 一键拨号
  - 导航到店

### FR-004: 公海客户
**优先级**: P0
**描述**: 公海客户池，所有销售人员可领取和跟进

**子功能**:
- FR-004-1: 筛选搜索
  - 按客户名称搜索
  - 按地区筛选（省/市/区）
  - 按店铺类型筛选
  - 按注册时间筛选

- FR-004-2: 排序
  - 注册时间（最新/最早）
  - 距离（最近/最远）
  - 店铺规模（大面积/小面积）

- FR-004-3: 功能按钮
  - 领取客户
  - 查看地图
  - 批量领取
  - 导出列表

### FR-005: 私海客户
**优先级**: P0
**描述**: 销售人员独占的客户资源池

**子功能**:
- FR-005-1: 筛选搜索
  - 按客户名称搜索
  - 按跟进状态筛选
  - 按客户分级筛选
  - 按最后拜访时间筛选

- FR-005-2: 排序
  - 最后拜访时间
  - 客户等级
  - 订单金额

- FR-005-3: 功能按钮
  - 新建拜访
  - 转移客户
  - 归还公海
  - 查看拜访记录

### FR-006: 销售地图
**优先级**: P1
**描述**: 地图展示客户分布

**子功能**:
- FR-006-1: 地图展示
  - 公海客户（蓝色标记）
  - 私海客户（绿色标记）
  - 他海客户（黄色标记）
  - 未注册店铺（灰色标记）

- FR-006-2: 图层控制
  - 支持同时显示多种类型
  - 不同类型颜色区分
  - 点击标记查看详情

- FR-006-3: 筛选功能
  - 按区域筛选
  - 按类型筛选
  - 按状态筛选

### FR-007: 客诉管理
**优先级**: P1
**描述**: 管理客户投诉

**子功能**:
- FR-007-1: 客诉列表
  - 筛选（状态、类型、时间）
  - 搜索（客户名称、投诉内容）

- FR-007-2: 客诉详情
  - 投诉内容
  - 处理进度
  - 处理结果
  - 客户满意度

### FR-008: 特殊备货需求
**优先级**: P1
**描述**: 管理客户的特殊备货需求

**子功能**:
- FR-008-1: 列表查询
  - 筛选（状态、客户、时间）
  - 搜索（商品名称、需求描述）

- FR-008-2: 需求详情
  - 需求描述
  - 商品清单
  - 处理进度

### FR-009: 特殊商品库
**优先级**: P2
**描述**: 特殊商品监控和知识库管理

**子功能**:
- FR-009-1: 特殊商品监控
  - 商品列表
  - 库存监控
  - 价格监控

- FR-009-2: 特殊商品知识库
  - 商品知识录入
  - 知识分类
  - 知识搜索

### FR-010: 黑名单管理
**优先级**: P1
**描述**: 管理黑名单客户

**子功能**:
- FR-010-1: 黑名单列表
  - 筛选（拉黑原因、时间）
  - 搜索（客户名称）

- FR-010-2: 黑名单管理
  - 添加黑名单
  - 移除黑名单
  - 查看拉黑原因

---

## 数据模型

### Visit (拜访记录)
```typescript
interface Visit {
  id: string;
  customerId: string;
  customerName: string;
  customerType: 'public' | 'private';
  visitType: 'first' | 'regular' | 'temporary' | 'other';
  visitMethod: 'onsite' | 'phone' | 'video' | 'wechat';
  planDate: string;
  planTime?: string;
  subject: string;
  content: string;
  images?: VisitImage[];
  feedback?: string;
  followUpPlan?: string;
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}
```

### Store (店铺)
```typescript
interface Store {
  id: string;
  storeName: string;
  storeType: 'supermarket' | 'convenience' | 'restaurant' | 'other';
  address: string;
  province: string;
  city: string;
  district: string;
  latitude?: number;
  longitude?: number;
  area?: number;
  contactName: string;
  contactPhone: string;
  licenses: StoreLicense[];
  status: 'unclaimed' | 'pending' | 'reviewing' | 'approved' | 'rejected';
  claimBy?: string;
  assignedTo?: string;
  reviewBy?: string;
  rejectReason?: string;
}
```

### Customer (客户)
```typescript
interface Customer {
  id: string;
  customerName: string;
  customerType: 'public' | 'private' | 'blacklist';
  storeType: 'supermarket' | 'convenience' | 'restaurant' | 'other';
  address: string;
  province: string;
  city: string;
  district: string;
  latitude?: number;
  longitude?: number;
  area?: number;
  contactName: string;
  contactPhone: string;
  businessHours?: string;
  mainCategories?: string[];
  grade?: 'A' | 'B' | 'C' | 'D';
  assignedTo?: string;
  lastVisitDate?: string;
  totalOrderAmount?: number;
  status: 'active' | 'inactive' | 'blacklisted';
  createdAt: string;
  updatedAt: string;
}
```

### Complaint (客诉)
```typescript
interface Complaint {
  id: string;
  complaintNo: string;
  customerId: string;
  customerName: string;
  relatedOrderId?: string;
  type: 'quality' | 'service' | 'delivery' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  content: string;
  images?: string[];
  status: 'pending' | 'accepted' | 'processing' | 'resolved' | 'closed';
  assigneeId?: string;
  assigneeName?: string;
  process: ComplaintProcess[];
  satisfaction?: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
  closedAt?: string;
}
```

### SpecialStockRequest (特殊备货需求)
```typescript
interface SpecialStockRequest {
  id: string;
  requestId: string;
  customerId: string;
  customerName: string;
  productName: string;
  sku: string;
  quantity: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  approvedBy?: string;
  fulfilledBy?: string;
  createdAt: string;
  updatedAt: string;
}
```

### BlacklistCustomer (黑名单)
```typescript
interface BlacklistCustomer {
  id: string;
  customerId: string;
  customerName: string;
  reason: string;
  blacklistedBy: string;
  blacklistedAt: string;
  notes?: string;
}
```

---

## API 接口

**基础路径**: `/api/sales`

### 拜访记录 API
- `GET /api/sales/visits` - 获取拜访列表
- `GET /api/sales/visits/:id` - 获取拜访详情
- `POST /api/sales/visits` - 创建拜访记录
- `PUT /api/sales/visits/:id` - 更新拜访记录
- `DELETE /api/sales/visits/:id` - 删除拜访记录
- `GET /api/sales/visits/statistics` - 获取统计数据

### 店铺管理 API
- `GET /api/sales/stores/unclaimed` - 获取待领取店铺列表
- `GET /api/sales/stores/review` - 获取待审核店铺列表
- `GET /api/sales/stores/:id` - 获取店铺详情
- `POST /api/sales/stores/:id/claim` - 领取店铺
- `POST /api/sales/stores/:id/review` - 审核店铺
- `POST /api/sales/stores/:id/assign` - 分配店铺
- `GET /api/sales/stores/statistics` - 获取统计数据

### 客户管理 API
- `GET /api/sales/customers/public` - 获取公海客户列表
- `GET /api/sales/customers/private` - 获取私海客户列表
- `GET /api/sales/customers/:id` - 获取客户详情
- `POST /api/sales/customers/:id/claim` - 领取客户
- `POST /api/sales/customers/:id/return` - 归还公海
- `POST /api/sales/customers/:id/transfer` - 转移客户
- `GET /api/sales/customers/search` - 客户搜索

### 销售地图 API
- `GET /api/sales/map/customers` - 获取客户分布数据
- `GET /api/sales/map/unregistered` - 获取未注册店铺数据
- `GET /api/sales/markers/:id` - 获取标记详情

### 其他 API
- `GET /api/sales/complaints` - 客诉列表
- `GET /api/sales/special-stock-requests` - 特殊备货需求列表
- `GET /api/sales/blacklist` - 黑名单列表

---

## 技术栈

| 项目 | 电脑端 | 手机端 |
|------|--------|--------|
| 框架 | Vue 3.3+ | UniApp (Vue3) |
| UI 组件 | Element Plus 2.x | uView Plus 3.x |
| 状态管理 | Pinia 1.x | Pinia 1.x |
| HTTP 客户端 | Axios 1.x | uni.request |
| 地图 | 高德地图 JS API | 高德地图 UniApp SDK |

---

## 权限控制

### 路由权限
- `sales:visits:view`: 查看拜访记录
- `sales:visits:create`: 创建拜访记录
- `sales:visits:edit`: 编辑拜访记录
- `sales:stores:claim`: 领取店铺
- `sales:stores:review`: 审核店铺
- `sales:customers:public`: 访问公海客户
- `sales:customers:private`: 访问私海客户

### 按钮权限
- 基于用户角色和权限码的细粒度控制
- 支持动态权限配置
- 前端指令实现权限控制

---

## 完成进度

| 模块 | 前端页面 | 后端API | 数据库 | 状态 |
|------|---------|---------|--------|------|
| 拜访记录 | ✅ 3/3 | ❌ | ❌ | 前端完成 |
| 店铺管理 | ✅ 4/4 | ❌ | ❌ | 前端完成 |
| 客户管理 | ✅ 3/3 | ❌ | ❌ | 前端完成 |
| 销售地图 | 🟡 1/1(占位) | ❌ | ❌ | 页面就绪 |
| 其他子模块 | ✅ 3/3 | ❌ | ❌ | 前端完成 |

**手机端页面**: 13/13 ✅
**前端API封装**: ✅ 全部完成
**前端状态管理**: ✅ 全部完成
**后端API**: 0/24 ❌
**数据库表**: 0/6 ❌
