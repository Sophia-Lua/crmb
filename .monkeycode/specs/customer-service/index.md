# 客服模块 - 需求与设计文档

**模块名称**: customer-service  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 第一部分：需求概述

### 1.1 模块介绍

客服模块负责处理订单管理、售后服务、客户投诉、满意度调查和发票管理等客服相关工作。支持电脑端和手机端。

### 1.2 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 客服人员 | 订单处理、售后处理、客诉处理 | 客服相关功能 |
| 客服主管 | 团队管理、数据统计、疑难处理 | 客服全模块 + 数据 |
| 财务人员 | 发票管理、发票审核 | 发票相关功能 |
| 管理员 | 全局管理 | 所有功能 |

### 1.3 子模块列表

| 子模块 | 电脑端 | 手机端 | 核心功能 |
|--------|--------|--------|----------|
| 订单 | ✅ | ✅ | 订单管理、售后管理、客诉管理 |
| 客户满意度 | ✅ | ✅ | 订单评价、意见反馈 |
| 发票 | ✅ | ✅ | 发票管理、发票审核 |

---

## 第二部分：功能需求

### 2.1 订单管理

#### 功能描述
管理所有订单，支持订单查询、订单处理、订单跟踪。

#### 核心功能
1. **订单列表**
   - 筛选（状态、时间、客户、订单号）
   - 搜索（订单号、客户名称、手机号）
   - 排序（下单时间、付款时间）
   - 导出 Excel

2. **订单详情**
   - 订单基本信息
   - 商品清单
   - 支付信息
   - 配送信息
   - 订单操作日志

3. **订单操作**
   - 订单确认
   - 订单取消
   - 订单备注
   - 修改价格（需权限）
   - 订单跟踪

#### 数据模型
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
  createdAt: string;
}
```

---

### 2.2 售后管理

#### 功能描述
处理订单售后申请，包括退货、换货、退款。

#### 核心功能
1. **售后列表**
   - 筛选（类型、状态、时间）
   - 搜索（售后单号、订单号）

2. **售后详情**
   - 售后类型（退货/换货/退款）
   - 售后原因
   - 商品图片
   - 处理进度
   - 退款金额

3. **售后处理**
   - 审核售后申请
   - 确认收货
   - 处理退款
   - 拒绝申请

---

### 2.3 客诉管理

#### 功能描述
处理客户投诉，记录投诉内容、处理过程和结果。

#### 核心功能
1. **客诉列表**
   - 筛选（状态、类型、优先级）
   - 搜索（客户、内容）

2. **客诉详情**
   - 投诉内容
   - 相关订单
   - 处理进度
   - 处理结果
   - 客户满意度

3. **客诉处理**
   - 受理客诉
   - 分配处理人
   - 更新处理进度
   - 回复客户
   - 关闭客诉

---

### 2.4 客户满意度

#### 功能描述
管理客户评价和意见反馈。

#### 核心功能
1. **订单评价**
   - 评价列表
   - 评价详情
   - 评价回复
   - 评价统计

2. **意见反馈**
   - 反馈列表
   - 反馈分类
   - 反馈处理
   - 反馈统计

---

### 2.5 发票管理

#### 功能描述
管理客户发票申请和开具。

#### 核心功能
1. **发票列表**
   - 筛选（状态、类型、时间）
   - 搜索（订单号、发票抬头）

2. **发票详情**
   - 发票类型（电子/纸质）
   - 发票抬头
   - 税号
   - 发票金额
   - 邮寄地址

3. **发票处理**
   - 审核发票申请
   - 开具发票
   - 发票邮寄
   - 发票作废

---

## 第三部分：数据模型

### 3.1 订单

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

### 3.2 售后单

```typescript
interface AfterSale {
  id: string;
  afterSaleNo: string;
  orderId: string;
  orderNo: string;
  type: 'return' | 'exchange' | 'refund';       // 退货/换货/退款
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

### 3.3 客诉

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

### 3.4 评价

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

### 3.5 意见反馈

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

### 3.6 发票

```typescript
interface Invoice {
  id: string;
  invoiceNo: string;
  orderId: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  type: 'electronic' | 'paper';                 // 电子/纸质
  title: string;                                // 发票抬头
  taxNo: string;                                // 税号
  amount: number;
  status: 'pending' | 'approved' | 'issued' | 'mailed' | 'completed' | 'voided';
  address?: string;                             // 邮寄地址
  trackingNo?: string;                          // 物流单号
  approverId?: string;
  approverName?: string;
  issuerId?: string;
  issuerName?: string;
  createdAt: string;
  issuedAt?: string;
}
```

---

## 第四部分：API 接口设计

```typescript
// 基础路径：/api/v1/customer-service

// 订单管理
GET  /api/v1/customer-service/orders              // 订单列表
GET  /api/v1/customer-service/orders/:id          // 订单详情
PUT  /api/v1/customer-service/orders/:id/confirm  // 确认订单
PUT  /api/v1/customer-service/orders/:id/cancel   // 取消订单
POST /api/v1/customer-service/orders/:id/remark   // 添加备注

// 售后管理
GET  /api/v1/customer-service/after-sales         // 售后列表
GET  /api/v1/customer-service/after-sales/:id     // 售后详情
PUT  /api/v1/customer-service/after-sales/:id/approve   // 审核售后
PUT  /api/v1/customer-service/after-sales/:id/receive  // 确认收货
PUT  /api/v1/customer-service/after-sales/:id/refund   // 处理退款

// 客诉管理
GET  /api/v1/customer-service/complaints          // 客诉列表
GET  /api/v1/customer-service/complaints/:id      // 客诉详情
PUT  /api/v1/customer-service/complaints/:id/accept    // 受理客诉
PUT  /api/v1/customer-service/complaints/:id/process   // 处理客诉
PUT  /api/v1/customer-service/complaints/:id/close     // 关闭客诉

// 客户满意度
GET  /api/v1/customer-service/reviews             // 评价列表
POST /api/v1/customer-service/reviews/:id/reply   // 回复评价
GET  /api/v1/customer-service/feedbacks           // 反馈列表
PUT  /api/v1/customer-service/feedbacks/:id/process    // 处理反馈

// 发票管理
GET  /api/v1/customer-service/invoices            // 发票列表
GET  /api/v1/customer-service/invoices/:id        // 发票详情
PUT  /api/v1/customer-service/invoices/:id/approve     // 审核发票
PUT  /api/v1/customer-service/invoices/:id/issue       // 开具发票
PUT  /api/v1/customer-service/invoices/:id/void        // 作废发票
```

---

## 第五部分：前端设计

### 5.1 目录结构

```
src/
├── views/
│   └── customer-service/
│       ├── orders/
│       │   ├── List.vue
│       │   └── Detail.vue
│       ├── after-sales/
│       │   ├── List.vue
│       │   └── Detail.vue
│       ├── complaints/
│       │   ├── List.vue
│       │   └── Detail.vue
│       ├── reviews/
│       │   └── List.vue
│       ├── feedbacks/
│       │   └── List.vue
│       └── invoices/
│           ├── List.vue
│           └── Detail.vue
├── stores/
│   └── customerService.js
├── api/
│   └── customerService.js
└── mock/
    └── customerService.js
```

### 5.2 状态管理

```javascript
export const useCustomerServiceStore = defineStore('customerService', () => {
  const orderList = ref([]);
  const afterSalesList = ref([]);
  const complaintList = ref([]);
  const invoiceList = ref([]);
  const loading = ref(false);
  
  async function fetchOrders(params) { /* ... */ }
  async function fetchAfterSales(params) { /* ... */ }
  async function fetchComplaints(params) { /* ... */ }
  async function fetchInvoices(params) { /* ... */ }
  async function approveAfterSales(id, data) { /* ... */ }
  async function approveInvoice(id, data) { /* ... */ }
  
  return { orderList, afterSalesList, complaintList, invoiceList, loading, fetchOrders, fetchAfterSales, fetchComplaints, fetchInvoices };
});
```

---

## 第六部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 订单管理 | 4 天 |
| 2 | 售后管理 | 3 天 |
| 3 | 客诉管理 | 3 天 |
| 4 | 满意度 + 发票 | 3 天 |
| 5 | 联调测试 | 3 天 |
| **总计** | | **16 天** |
