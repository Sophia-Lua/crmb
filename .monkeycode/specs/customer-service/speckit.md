# 客服模块 - Speckit 需求规格

## 模块信息
- **模块名称**: customer-service
- **模块介绍**: 客服模块负责处理订单管理、售后服务、客户投诉、满意度调查和发票管理等客服相关工作。支持电脑端和手机端。
- **支持平台**: 电脑端 Web + 手机端 UniApp
- **总工期**: 16天
- **版本**: v1.0
- **更新日期**: 2026-05-09

---

## 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 客服人员 | 订单处理、售后处理、客诉处理 | 客服相关功能 |
| 客服主管 | 团队管理、数据统计、疑难处理 | 客服全模块 + 数据 |
| 财务人员 | 发票管理、发票审核 | 发票相关功能 |
| 管理员 | 全局管理 | 所有功能 |

---

## 子模块清单

| 子模块 | 电脑端 | 手机端 | 核心功能 | 状态 |
|--------|--------|--------|----------|------|
| 订单 | ✅ | ✅ | 订单管理、售后管理、客诉管理 | 未开始 |
| 客户满意度 | ✅ | ✅ | 订单评价、意见反馈 | 未开始 |
| 发票 | ✅ | ✅ | 发票管理、发票审核 | 未开始 |

---

## 功能需求

### 订单管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-001 | 作为一名客服人员 | 我能够查看订单列表（筛选、搜索、排序、导出） | 以便快速定位和处理客户订单 |
| REQ-002 | 作为一名客服人员 | 我能够查看订单详情（基本信息、商品清单、支付信息、配送信息、操作日志） | 以便全面掌握订单情况处理客户咨询 |
| REQ-003 | 作为一名客服人员 | 我能够确认订单和添加订单备注 | 以便推进订单处理流程并记录关键信息 |
| REQ-004 | 作为一名客服主管 | 我能够取消订单和修改价格 | 以便处理异常订单和特殊价格调整 |
| REQ-005 | 作为一名客服人员 | 我能够跟踪订单状态 | 以便及时向客户反馈订单进展 |

### 售后管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-006 | 作为一名客服人员 | 我能够查看售后列表（筛选、搜索） | 以便快速定位售后申请进行处理 |
| REQ-007 | 作为一名客服人员 | 我能够查看售后详情（类型、原因、图片、进度、退款金额） | 以便全面了解售后情况做出处理决策 |
| REQ-008 | 作为一名客服主管 | 我能够审核售后申请并处理退款 | 以便审批售后流程保障客户权益 |
| REQ-009 | 作为一名客服人员 | 我能够确认收货和拒绝售后申请 | 以便完成售后流程中的关键操作节点 |

### 客诉管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-010 | 作为一名客服人员 | 我能够查看客诉列表（筛选、搜索） | 以便快速定位客户投诉进行处理 |
| REQ-011 | 作为一名客服人员 | 我能够查看客诉详情（投诉内容、相关订单、处理进度、结果、满意度） | 以便全面了解投诉情况制定处理方案 |
| REQ-012 | 作为一名客服主管 | 我能够受理客诉、分配处理人、更新进度、回复客户、关闭客诉 | 以便协调处理客户投诉提升客户满意度 |

### 客户满意度需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-013 | 作为一名客服人员 | 我能够查看订单评价列表、详情并回复评价 | 以便关注客户反馈改进服务质量 |
| REQ-014 | 作为一名客服主管 | 我能够查看评价统计 | 以便分析客户满意度趋势制定改进策略 |
| REQ-015 | 作为一名客服人员 | 我能够查看意见反馈列表、分类并处理反馈 | 以便及时响应客户意见提升客户体验 |
| REQ-016 | 作为一名客服主管 | 我能够查看反馈统计 | 以便汇总分析客户意见指导服务优化 |

### 发票管理需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-017 | 作为一名财务人员 | 我能够查看发票列表（筛选、搜索） | 以便快速定位发票申请进行处理 |
| REQ-018 | 作为一名财务人员 | 我能够查看发票详情（类型、抬头、税号、金额、地址） | 以便核实发票信息确保开具准确 |
| REQ-019 | 作为一名财务人员 | 我能够审核、开具、邮寄发票 | 以便完成发票全流程处理满足客户需求 |
| REQ-020 | 作为一名管理员 | 我能够作废发票 | 以便处理错误或异常发票保持发票记录准确 |

---

## 数据模型

### Order (订单)
```typescript
interface Order {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  payAmount: number;
  discountAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  payType: 'wechat' | 'alipay' | 'balance' | 'cash';
  payTime?: string;
  shipTime?: string;
  deliverTime?: string;
  remark?: string;
  operatorLog: OrderOperationLog[];
  createdAt: string;
}

interface OrderItem {
  sku: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderOperationLog {
  id: string;
  operatorId: string;
  operatorName: string;
  action: string;
  remark?: string;
  createdAt: string;
}
```

### AfterSale (售后单)
```typescript
interface AfterSale {
  id: string;
  afterSaleNo: string;
  orderId: string;
  orderNo: string;
  type: 'return' | 'exchange' | 'refund';
  status: 'pending' | 'approved' | 'received' | 'refunded' | 'rejected' | 'completed';
  reason: string;
  description: string;
  images: string[];
  refundAmount: number;
  items: AfterSaleItem[];
  process: AfterSaleProcess[];
  handlerId?: string;
  handlerName?: string;
  handlerRemark?: string;
  createdAt: string;
  completedAt?: string;
}

interface AfterSaleItem {
  sku: string;
  productName: string;
  quantity: number;
  refundAmount: number;
}

interface AfterSaleProcess {
  id: string;
  action: string;
  operatorId: string;
  operatorName: string;
  remark?: string;
  createdAt: string;
}
```

### Complaint (客诉)
```typescript
interface Complaint {
  id: string;
  complaintNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
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

interface ComplaintProcess {
  id: string;
  action: string;
  operatorId: string;
  operatorName: string;
  content: string;
  createdAt: string;
}
```

### Review (评价)
```typescript
interface Review {
  id: string;
  orderId: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  images?: string[];
  status: 'pending' | 'replied' | 'hidden';
  reply?: string;
  replyBy?: string;
  replyAt?: string;
  createdAt: string;
}
```

### Feedback (意见反馈)
```typescript
interface Feedback {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  type: 'suggestion' | 'bug' | 'complaint' | 'other';
  content: string;
  images?: string[];
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  handlerId?: string;
  handlerName?: string;
  handlerReply?: string;
  createdAt: string;
}
```

### Invoice (发票)
```typescript
interface Invoice {
  id: string;
  invoiceNo: string;
  orderId: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  type: 'electronic' | 'paper';
  title: string;
  taxNo: string;
  amount: number;
  status: 'pending' | 'approved' | 'issued' | 'mailed' | 'completed' | 'voided';
  address?: string;
  trackingNo?: string;
  approverId?: string;
  approverName?: string;
  issuerId?: string;
  issuerName?: string;
  createdAt: string;
  issuedAt?: string;
}
```

---

## API 接口

**基础路径**: `/api/customer-service`

### 订单管理 API
- `GET /api/customer-service/orders` - 订单列表
- `GET /api/customer-service/orders/:id` - 订单详情
- `PUT /api/customer-service/orders/:id/confirm` - 确认订单
- `PUT /api/customer-service/orders/:id/cancel` - 取消订单
- `POST /api/customer-service/orders/:id/remark` - 添加备注

### 售后管理 API
- `GET /api/customer-service/after-sales` - 售后列表
- `GET /api/customer-service/after-sales/:id` - 售后详情
- `PUT /api/customer-service/after-sales/:id/approve` - 审核售后
- `PUT /api/customer-service/after-sales/:id/receive` - 确认收货
- `PUT /api/customer-service/after-sales/:id/refund` - 处理退款

### 客诉管理 API
- `GET /api/customer-service/complaints` - 客诉列表
- `GET /api/customer-service/complaints/:id` - 客诉详情
- `PUT /api/customer-service/complaints/:id/accept` - 受理客诉
- `PUT /api/customer-service/complaints/:id/process` - 处理客诉
- `PUT /api/customer-service/complaints/:id/close` - 关闭客诉

### 客户满意度 API
- `GET /api/customer-service/reviews` - 评价列表
- `POST /api/customer-service/reviews/:id/reply` - 回复评价
- `GET /api/customer-service/feedbacks` - 反馈列表
- `PUT /api/customer-service/feedbacks/:id/process` - 处理反馈

### 发票管理 API
- `GET /api/customer-service/invoices` - 发票列表
- `GET /api/customer-service/invoices/:id` - 发票详情
- `PUT /api/customer-service/invoices/:id/approve` - 审核发票
- `PUT /api/customer-service/invoices/:id/issue` - 开具发票
- `PUT /api/customer-service/invoices/:id/void` - 作废发票

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
- `cs:orders:view`: 查看订单
- `cs:orders:manage`: 管理订单（确认、取消、修改价格）
- `cs:after-sales:view`: 查看售后
- `cs:after-sales:manage`: 处理售后
- `cs:complaints:view`: 查看客诉
- `cs:complaints:manage`: 处理客诉
- `cs:reviews:view`: 查看评价
- `cs:reviews:reply`: 回复评价
- `cs:invoices:view`: 查看发票
- `cs:invoices:approve`: 审核发票
- `cs:invoices:issue`: 开具发票

### 数据权限
- 客服人员：分配给自己的订单和客诉
- 客服主管：所有客服数据
- 财务人员：仅发票相关数据

---

## 完成进度

| 模块 | 前端页面 | 后端API | 数据库 | 状态 |
|------|---------|---------|--------|------|
| 订单管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 售后管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 客诉管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 客户满意度 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 发票管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |

**总工期**: 16天
**阶段1 订单管理开发**: 4天（未开始）
**阶段2 售后管理开发**: 3天（未开始）
**阶段3 客诉管理开发**: 3天（未开始）
**阶段4 满意度+发票开发**: 3天（未开始）
**阶段5 联调测试**: 3天（未开始）