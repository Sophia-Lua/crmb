# 供应商模块 - 需求与设计文档

**模块名称**: supplier  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 第一部分：需求概述

### 1.1 模块介绍

供应商模块是供应商端使用的系统，用于查看订单、收款和售后。支持电脑端和手机端。

### 1.2 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 供应商 | 查看订单、收款、售后 | 自己的数据 |
| 供应商管理员 | 多账号管理 | 企业数据 |

### 1.3 子模块列表

| 子模块 | 电脑端 | 手机端 | 核心功能 |
|--------|--------|--------|----------|
| 订单 | ✅ | ✅ | 待发货、待出库 |
| 收款 | ✅ | ✅ | 收款记录 |
| 售后 | ✅ | ✅ | 罚单、退货单 |

---

## 第二部分：功能需求

### 2.1 订单

#### 功能描述
查看采购订单。

#### 核心功能
1. **待发货数审核**
   - 待审核订单
   - 发货数确认

2. **待工厂出库**
   - 待出库订单
   - 出库操作
   - 物流填写

---

### 2.2 收款

#### 功能描述
查看收款记录。

#### 核心功能
1. **已付款**
   - 收款列表
   - 收款详情
   - 收款统计

---

### 2.3 售后

#### 功能描述
查看售后记录。

#### 核心功能
1. **罚单**
   - 罚单列表
   - 罚单详情
   - 罚单确认

2. **退货单**
   - 退货单列表
   - 退货详情
   - 退货确认

---

## 第三部分：数据模型

### 3.1 供应商订单

```typescript
interface SupplierOrder {
  id: string;
  orderNo: string;
  supplierId: string;
  status: 'pending_ship_audit' | 'pending_factory_ship' | 'shipped' | 'inbound' | 'completed';
  items: SupplierOrderItem[];
  totalQty: number;
  totalAmount: number;
  expectedShipDate?: string;
  logistics?: LogisticsInfo;
  createdAt: string;
}

interface SupplierOrderItem {
  sku: string;
  productName: string;
  orderQty: number;
  shipQty?: number;                              // 确认发货数
  price: number;
  subtotal: number;
}

interface LogisticsInfo {
  company: string;
  trackingNo: string;
  shipDate?: string;
}
```

### 3.2 收款记录

```typescript
interface SupplierPayment {
  id: string;
  paymentNo: string;
  amount: number;
  relatedOrderId?: string;
  relatedOrderNo?: string;
  status: 'pending' | 'completed' | 'cancelled';
  paidAt?: string;
  createdAt: string;
}
```

### 3.3 罚单

```typescript
interface SupplierPenalty {
  id: string;
  penaltyNo: string;
  reason: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'executing' | 'completed' | 'cancelled';
  relatedOrderId?: string;
  createdAt: string;
  confirmedAt?: string;
}
```

### 3.4 退货单

```typescript
interface SupplierReturn {
  id: string;
  returnNo: string;
  purchaseOrderNo: string;
  reason: string;
  items: SupplierReturnItem[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  confirmedAt?: string;
}

interface SupplierReturnItem {
  sku: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}
```

---

## 第四部分：API 接口设计

```typescript
// 基础路径：/api/v1/supplier

// 订单
GET  /api/v1/supplier/orders                          // 订单列表
GET  /api/v1/supplier/orders/:id                      // 订单详情
PUT  /api/v1/supplier/orders/:id/ship-qty             // 确认发货数
PUT  /api/v1/supplier/orders/:id/ship                 // 发货

// 收款
GET  /api/v1/supplier/payments                        // 收款列表

// 售后
GET  /api/v1/supplier/penalties                       // 罚单列表
GET  /api/v1/supplier/penalties/:id                   // 罚单详情
PUT  /api/v1/supplier/penalties/:id/confirm           // 确认罚单

GET  /api/v1/supplier/returns                         // 退货单列表
GET  /api/v1/supplier/returns/:id                     // 退货详情
PUT  /api/v1/supplier/returns/:id/confirm             // 确认退货
```

---

## 第五部分：前端设计

### 5.1 目录结构

```
src/
├── views/
│   └── supplier/
│       ├── orders/
│       │   ├── List.vue
│       │   └── Detail.vue
│       ├── payments/
│       │   └── List.vue
│       ├── penalties/
│       │   └── List.vue
│       └── returns/
│           └── List.vue
├── stores/
│   └── supplier.js
├── api/
│   └── supplier.js
└── mock/
    └── supplier.js
```

---

## 第六部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 订单管理 | 3 天 |
| 2 | 收款管理 | 2 天 |
| 3 | 售后管理 | 2 天 |
| 4 | 联调测试 | 2 天 |
| **总计** | | **9 天** |

---

## 全模块总览

| 模块 | 文档路径 | 开发工期 |
|------|----------|----------|
| 销售 | specs/sales-module | 31 天 |
| 客服 | specs/customer-service | 16 天 |
| 运营 | specs/operations | 20 天 |
| 采购 | specs/procurement | 21 天 |
| 财务 | specs/finance | 9 天 |
| 人事 | specs/hr | 16 天 |
| 数据中心 | specs/data-center | 12 天 |
| 商城 | specs/mall | 23 天 |
| 云仓 | specs/cloud-warehouse | 17 天 |
| 直配 | specs/direct-delivery | 14 天 |
| 支付 | specs/payment | 7 天 |
| 供应商 | specs/supplier | 9 天 |
| **总计** | | **195 天** |

---

## 开发优先级建议

| 优先级 | 模块 | 说明 |
|--------|------|------|
| P0 | 销售、采购、云仓 | 核心业务流 |
| P1 | 运营、商城、财务 | 业务支撑 |
| P2 | 客服、人事、直配 | 运营支撑 |
| P3 | 数据中心、支付、供应商 | 辅助功能 |
