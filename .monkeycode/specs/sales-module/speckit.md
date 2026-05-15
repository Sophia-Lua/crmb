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

### 拜访记录需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-001 | 作为一名销售人员 | 我能够新建拜访记录（选择客户、拜访类型、拜访方式、填写内容、上传图片、保存草稿或提交） | 以便记录客户拜访活动并跟进业务进展 |
| REQ-002 | 作为一名销售人员 | 我能够查看拜访列表（多维度筛选、分页展示、导出Excel、查看统计面板） | 以便高效管理和回顾拜访记录 |
| REQ-003 | 作为一名销售人员 | 我能够查看拜访详情并编辑删除、更新状态、添加跟进备注 | 以便完整掌握拜访情况并及时更新跟进信息 |

### 店铺管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-004 | 作为一名销售人员 | 我能够查看待领取店铺（列表/地图双视图、筛选、领取、距离计算） | 以便发现并领取新店铺开展业务拓展 |
| REQ-005 | 作为一名审核人员 | 我能够审核待审核店铺（查看审核列表和详情、通过或驳回、填写驳回原因） | 以便把关店铺资质确保合规准入 |
| REQ-006 | 作为一名销售经理 | 我能够分配店铺（选择销售人员、查看负载、发送分配通知） | 以便合理分配店铺资源平衡团队工作量 |

### 客户管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-007 | 作为一名销售人员 | 我能够查看客户详情（基本信息、经营信息、历史拜访、历史订单、客户分级） | 以便全面了解客户情况制定拜访策略 |
| REQ-008 | 作为一名销售人员 | 我能够编辑客户信息、一键拨号、导航到店 | 以便维护客户数据并便捷联系和到访客户 |
| REQ-009 | 作为一名销售经理 | 我能够转移客户 | 以便调整客户归属优化团队资源配置 |
| REQ-010 | 作为一名销售人员 | 我能够归还客户到公海或加入黑名单 | 以便清理无效客户资源保持客户池质量 |

### 公海客户需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-011 | 作为一名销售人员 | 我能够筛选搜索公海客户（按名称、地区、类型、时间） | 以便快速找到适合拓展的潜在客户 |
| REQ-012 | 作为一名销售人员 | 我能够按注册时间、距离、店铺规模排序公海客户 | 以便优先拜访最有价值的公海客户 |
| REQ-013 | 作为一名销售人员 | 我能够领取客户、批量领取、查看地图、导出列表 | 以便将公海客户纳入个人跟进范围开展业务 |

### 私海客户需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-014 | 作为一名销售人员 | 我能够筛选搜索私海客户（按名称、跟进状态、分级、最后拜访时间） | 以便精准定位需重点跟进的客户 |
| REQ-015 | 作为一名销售人员 | 我能够按最后拜访时间、客户等级、订单金额排序私海客户 | 以便优先处理重要和紧急的客户 |
| REQ-016 | 作为一名销售人员 | 我能够新建拜访、转移客户、归还公海、查看拜访记录 | 以便高效管理个人客户池的日常跟进工作 |

### 销售地图需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-017 | 作为一名销售人员 | 我能够在地图上查看客户分布（公海蓝色、私海绿色、他海黄色、未注册灰色标记） | 以便直观了解周边客户分布规划拜访路线 |
| REQ-018 | 作为一名销售人员 | 我能够控制地图图层（同时显示多种类型、颜色区分、点击查看详情） | 以便灵活切换查看不同类型客户信息 |
| REQ-019 | 作为一名销售人员 | 我能够在地图上按区域、类型、状态筛选客户 | 以便聚焦特定区域或类型的客户进行业务拓展 |

### 客诉管理需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-020 | 作为一名销售人员 | 我能够查看客诉列表和详情 | 以便了解客户投诉情况及时处理 |
| REQ-021 | 作为一名销售经理 | 我能够处理客诉（受理、分配、更新进度、回复、关闭） | 以便协调处理客户投诉维护客户关系 |

### 特殊备货需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-022 | 作为一名销售人员 | 我能够查看特殊备货需求列表和详情 | 以便了解客户的特殊需求及时响应 |

### 特殊商品库需求 (P2)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-023 | 作为一名管理员 | 我能够管理特殊商品监控和知识库 | 以便维护特殊商品信息支持销售参考 |

### 黑名单管理需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-024 | 作为一名销售经理 | 我能够查看黑名单列表并管理（添加、移除、查看原因） | 以便管控不良客户资源避免重复开发 |

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
