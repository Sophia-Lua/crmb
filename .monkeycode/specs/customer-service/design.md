# 客服模块 - 设计文档

**模块名称**: customer-service  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 1. 数据模型设计

### 1.1 订单
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

### 1.2 售后单
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

### 1.3 客诉
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
  images?: string[]; // 客诉图片URL数组，存储在MinIO中，格式为 /api/files/{filename}
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

### 1.4 评价
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

### 1.5 意见反馈
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

### 1.6 发票
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

## 2. API 接口设计

**基础路径**: `/api/customer-service`

### 2.1 订单管理接口
- `GET /api/customer-service/orders` - 订单列表
- `GET /api/customer-service/orders/:id` - 订单详情
- `PUT /api/customer-service/orders/:id/confirm` - 确认订单
- `PUT /api/customer-service/orders/:id/cancel` - 取消订单
- `POST /api/customer-service/orders/:id/remark` - 添加备注

### 2.2 售后管理接口
- `GET /api/customer-service/after-sales` - 售后列表
- `GET /api/customer-service/after-sales/:id` - 售后详情
- `PUT /api/customer-service/after-sales/:id/approve` - 审核售后
- `PUT /api/customer-service/after-sales/:id/receive` - 确认收货
- `PUT /api/customer-service/after-sales/:id/refund` - 处理退款

### 2.3 客诉管理接口
- `GET /api/customer-service/complaints` - 客诉列表
- `GET /api/customer-service/complaints/:id` - 客诉详情
- `PUT /api/customer-service/complaints/:id/accept` - 受理客诉
- `PUT /api/customer-service/complaints/:id/process` - 处理客诉
- `PUT /api/customer-service/complaints/:id/close` - 关闭客诉

### 2.4 客户满意度接口
- `GET /api/customer-service/reviews` - 评价列表
- `POST /api/customer-service/reviews/:id/reply` - 回复评价
- `GET /api/customer-service/feedbacks` - 反馈列表
- `PUT /api/customer-service/feedbacks/:id/process` - 处理反馈

### 2.5 发票管理接口
- `GET /api/customer-service/invoices` - 发票列表
- `GET /api/customer-service/invoices/:id` - 发票详情
- `PUT /api/customer-service/invoices/:id/approve` - 审核发票
- `PUT /api/customer-service/invoices/:id/issue` - 开具发票
- `PUT /api/customer-service/invoices/:id/void` - 作废发票

---

## 3. 前端架构设计

### 3.1 目录结构
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

### 3.2 技术栈
- **框架**: Vue 3.3+ + Element Plus 2.x (B端) / UniApp (C端)
- **状态管理**: Pinia 1.x
- **HTTP客户端**: Axios 1.x (B端) / uni.request (C端)
- **UI组件库**: Element Plus (B端) / uView Plus 3.x (C端)