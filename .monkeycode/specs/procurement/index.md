# 采购模块 - 需求与设计文档

**模块名称**: procurement  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 第一部分：需求概述

### 1.1 模块介绍

采购模块负责采购流程管理、供应商管理、商品信息管理、结算管理、罚单和退货单管理。支持电脑端和手机端。

### 1.2 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 采购人员 | 采购单创建、供应商跟进 | 采购基础功能 |
| 采购主管 | 采购审核、结算审批 | 采购全模块 + 审批 |
| 仓库人员 | 入库核对 | 入库相关功能 |
| 财务人员 | 付款审核 | 结算相关功能 |
| 管理员 | 全局管理 | 所有功能 |

### 1.3 子模块列表

| 子模块 | 电脑端 | 手机端 | 核心功能 |
|--------|--------|--------|----------|
| 采购流程管理 | ✅ | ✅ | 采购单全流程管理 |
| 采购单管理 | ✅ | ✅ | 采购单查询、取消、异常 |
| 供应商管理 | ✅ | ✅ | 供应商信息、拜访 |
| 商品信息管理 | ✅ | ✅ | 采购商品信息 |
| 结算管理 | ✅ | ✅ | 采购结算全流程 |
| 罚单管理 | ✅ | ✅ | 供应商罚单 |
| 退货单 | ✅ | ✅ | 退货流程管理 |

---

## 第二部分：功能需求

### 2.1 采购流程管理

#### 功能描述
管理采购单从创建到完成的完整流程。

#### 流程节点
```
创建采购单 → 待审核 → 审核通过 → 待发货数审核 → 待工厂出库 → 
待采购确认 → 等待入库 → 入库核对 → 已完成
```

#### 核心功能
1. **采购单创建**
   - 选择供应商
   - 添加商品
   - 设置采购数量
   - 期望到货日期
   - 备注信息

2. **待审核**
   - 审核采购单
   - 审核意见
   - 驳回/通过

3. **待发货数审核**
   - 确认发货数量
   - 修改发货数

4. **待工厂出库**
   - 供应商发货
   - 上传物流信息

5. **待采购确认**
   - 确认发货信息
   - 确认收货

6. **等待入库**
   - 仓库收货
   - 质检

7. **入库核对**
   - 核对数量
   - 核对质量
   - 入库确认

---

### 2.2 采购单管理

#### 功能描述
采购单查询和管理。

#### 核心功能
1. **全部采购单**
   - 筛选（状态、供应商、时间）
   - 搜索（采购单号、商品名称）
   - 导出

2. **已取消**
   - 取消原因
   - 取消记录

3. **少发货异常**
   - 异常采购单列表
   - 异常处理

---

### 2.3 供应商管理

#### 功能描述
管理供应商信息和拜访。

#### 核心功能
1. **供应商列表**
   - 供应商信息
   - 合作状态
   - 评级

2. **创建供应商**
   - 基本信息
   - 资质信息
   - 结算信息

3. **供应商拜访**
   - 拜访计划
   - 拜访记录
   - 拜访列表

4. **缺货数据**
   - 供应商缺货统计
   - 缺货商品

---

### 2.4 商品信息管理

#### 功能描述
采购商品信息的管理。

#### 核心功能
1. **商品信息列表**
   - 商品筛选
   - 商品搜索

2. **创建商品**
   - 商品基本信息
   - 采购价格
   - 供应商关联

---

### 2.5 结算管理

#### 功能描述
采购结算全流程管理。

#### 流程节点
```
待提交 → 待确认 → 二次确认 → 待申请付款 → 二次申请付款 → 
申请付款中 → 已付款/已驳回
```

#### 核心功能
1. **各状态列表**
   - 按状态筛选
   - 结算详情

2. **结算操作**
   - 提交结算
   - 确认结算
   - 申请付款
   - 付款确认

---

### 2.6 罚单管理

#### 功能描述
管理供应商罚单。

#### 功能节点
```
待提交 → 待工厂确认 → 执行中 → 已完成/已取消
```

#### 核心功能
1. **罚单创建**
   - 选择供应商
   - 罚单原因
   - 罚款金额

2. **罚单处理**
   - 供应商确认
   - 罚款执行
   - 罚单关闭

---

### 2.7 退货单

#### 功能描述
管理采购退货流程。

#### 流程节点
```
创建退货单 → 待出库 → 待工厂确认 → 待结算 → 已完成/已取消
```

#### 核心功能
1. **创建退货单**
   - 选择采购单
   - 退货商品
   - 退货原因

2. **退货处理**
   - 退货出库
   - 供应商确认
   - 退货结算

---

## 第三部分：数据模型

### 3.1 采购单

```typescript
interface PurchaseOrder {
  id: string;
  orderNo: string;
  supplierId: string;
  supplierName: string;
  status: 'draft' | 'pending_audit' | 'approved' | 'pending_ship_audit' | 'pending_factory_ship' | 'pending_confirm' | 'pending_inbound' | 'inbound_check' | 'completed' | 'cancelled';
  expectedArrivalDate: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  totalQty: number;
  createdById: string;
  createdByName: string;
  auditBy?: string;
  auditByName?: string;
  auditRemark?: string;
  remark?: string;
  logistics?: LogisticsInfo;
  createdAt: string;
  approvedAt?: string;
  completedAt?: string;
}

interface PurchaseOrderItem {
  sku: string;
  productName: string;
  unitPrice: number;
  orderQty: number;
  shipQty?: number;                               // 实际发货数
  receivedQty?: number;                           // 实际收货数
  qualityStatus?: 'pass' | 'fail' | 'partial';
  subtotal: number;
}
```

### 3.2 供应商

```typescript
interface Supplier {
  id: string;
  supplierNo: string;
  name: string;
  contactName: string;
  contactPhone: string;
  address: string;
  rating: 'A' | 'B' | 'C' | 'D';
  status: 'active' | 'inactive';
  qualifications: string[];
  settlementType: 'prepaid' | 'cod' | 'net30' | 'net60';
  bankAccount?: string;
  bankName?: string;
  shortageCount: number;                          // 缺货次数
  purchaseCount: number;                          // 采购次数
  createdAt: string;
}
```

### 3.3 供应商拜访

```typescript
interface SupplierVisit {
  id: string;
  supplierId: string;
  supplierName: string;
  visitorId: string;
  visitorName: string;
  date: string;
  content: string;
  outcome: string;
  images?: string[];
  createdAt: string;
}
```

### 3.4 采购商品

```typescript
interface ProcurementProduct {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  categoryName: string;
  unit: string;
  supplierId: string;
  supplierName: string;
  price: number;
  minOrderQty: number;
  status: 'active' | 'inactive';
}
```

### 3.5 结算单

```typescript
interface Settlement {
  id: string;
  settlementNo: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  status: 'pending_submit' | 'pending_confirm' | 'pending_second_confirm' | 'pending_payment_apply' | 'pending_second_payment_apply' | 'applying' | 'paid' | 'rejected';
  relatedPurchaseOrders: string[];                  // 关联采购单号
  createdBy: string;
  createdByName: string;
  confimerId?: string;
  confimerName?: string;
  paymentApplicantId?: string;
  paymentApplicantName?: string;
  rejectReason?: string;
  createdAt: string;
  paidAt?: string;
}
```

### 3.6 罚单

```typescript
interface Penalty {
  id: string;
  penaltyNo: string;
  supplierId: string;
  supplierName: string;
  reason: string;
  amount: number;
  status: 'pending_submit' | 'pending_factory_confirm' | 'executing' | 'completed' | 'cancelled';
  createdById: string;
  createdByName: string;
  confirmedBy?: string;
  confirmedByName?: string;
  createdAt: string;
  completedAt?: string;
}
```

### 3.7 退货单

```typescript
interface ReturnOrder {
  id: string;
  returnNo: string;
  purchaseOrderId: string;
  purchaseOrderNo: string;
  supplierId: string;
  supplierName: string;
  reason: string;
  items: ReturnOrderItem[];
  status: 'draft' | 'pending_outbound' | 'pending_factory_confirm' | 'pending_settlement' | 'completed' | 'cancelled';
  createdById: string;
  createdByName: string;
  createdAt: string;
  completedAt?: string;
}

interface ReturnOrderItem {
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
// 基础路径：/api/v1/procurement

// 采购单
GET  /api/v1/procurement/purchase-orders              // 采购单列表
POST /api/v1/procurement/purchase-orders              // 创建采购单
GET  /api/v1/procurement/purchase-orders/:id          // 采购单详情
PUT  /api/v1/procurement/purchase-orders/:id/audit    // 审核采购单
PUT  /api/v1/procurement/purchase-orders/:id/confirm  // 确认采购单
PUT  /api/v1/procurement/purchase-orders/:id/cancel   // 取消采购单

// 供应商
GET  /api/v1/procurement/suppliers                    // 供应商列表
POST /api/v1/procurement/suppliers                    // 创建供应商
GET  /api/v1/procurement/suppliers/:id                // 供应商详情
PUT  /api/v1/procurement/suppliers/:id                // 编辑供应商

// 结算
GET  /api/v1/procurement/settlements                  // 结算列表
POST /api/v1/procurement/settlements                  // 创建结算
PUT  /api/v1/procurement/settlements/:id/confirm      // 确认结算
PUT  /api/v1/procurement/settlements/:id/pay          // 申请付款

// 罚单
GET  /api/v1/procurement/penalties                    // 罚单列表
POST /api/v1/procurement/penalties                    // 创建罚单
PUT  /api/v1/procurement/penalties/:id/confirm        // 确认罚单

// 退货单
GET  /api/v1/procurement/return-orders                // 退货单列表
POST /api/v1/procurement/return-orders                // 创建退货单
PUT  /api/v1/procurement/return-orders/:id/confirm    // 确认退货
```

---

## 第五部分：前端设计

### 5.1 目录结构

```
src/
├── views/
│   └── procurement/
│       ├── purchase-orders/
│       │   ├── List.vue
│       │   ├── Create.vue
│       │   └── Detail.vue
│       ├── suppliers/
│       │   ├── List.vue
│       │   ├── Create.vue
│       │   └── Detail.vue
│       ├── settlements/
│       │   ├── List.vue
│       │   └── Detail.vue
│       ├── penalties/
│       │   ├── List.vue
│       │   └── Detail.vue
│       └── return-orders/
│           ├── List.vue
│           └── Create.vue
├── stores/
│   └── procurement.js
├── api/
│   └── procurement.js
└── mock/
    └── procurement.js
```

---

## 第六部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 采购流程管理 | 6 天 |
| 2 | 供应商管理 | 4 天 |
| 3 | 结算管理 | 4 天 |
| 4 | 罚单 + 退货单 | 3 天 |
| 5 | 联调测试 | 4 天 |
| **总计** | | **21 天** |
