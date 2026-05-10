# 财务模块 - 需求与设计文档

**模块名称**: finance  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 第一部分：需求概述

### 1.1 模块介绍

财务模块负责店铺充值管理、发票管理和财务付款审批。支持电脑端和手机端。

### 1.2 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 财务人员 | 充值确认、发票管理、付款处理 | 财务基础功能 |
| 财务主管 | 付款审批、数据统计 | 财务全模块 + 审批 |
| 管理员 | 全局管理 | 所有功能 |

### 1.3 子模块列表

| 子模块 | 电脑端 | 手机端 | 核心功能 |
|--------|--------|--------|----------|
| 财务 | ✅ | ✅ | 店铺充值、发票管理 |
| 财务付款 | ✅ | ✅ | 付款审批、付款处理 |

---

## 第二部分：功能需求

### 2.1 财务管理

#### 功能描述
管理店铺充值和发票。

#### 核心功能
1. **店铺充值**
   - 充值申请列表
   - 充值确认
   - 充值记录
   - 账户余额

2. **发票管理**
   - 发票列表
   - 发票详情
   - 发票确认
   - 二次确认
   - 发票统计

---

### 2.2 财务付款

#### 功能描述
管理采购付款审批流程。

#### 流程节点
```
待审批 → 待付款 → 已付款/已取消
```

#### 核心功能
1. **待审批**
   - 付款申请列表
   - 审批通过/驳回
   - 审批意见

2. **待付款**
   - 待付款列表
   - 付款确认
   - 付款凭证上传

3. **已付款**
   - 付款记录
   - 付款详情

4. **已取消**
   - 取消记录
   - 取消原因

---

## 第三部分：数据模型

### 3.1 充值记录

```typescript
interface Recharge {
  id: string;
  rechargeNo: string;
  shopId: string;
  shopName: string;
  amount: number;
  payType: 'bank_transfer' | 'wechat' | 'alipay' | 'cash';
  status: 'pending' | 'confirmed' | 'rejected';
  voucherUrl?: string;                            // 付款凭证
  confirmedBy?: string;
  confirmedByName?: string;
  confirmRemark?: string;
  createdAt: string;
  confirmedAt?: string;
}
```

### 3.2 发票

```typescript
interface Invoice {
  id: string;
  invoiceNo: string;
  shopId: string;
  shopName: string;
  type: 'electronic' | 'paper';
  title: string;
  taxNo: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'reconfirmed' | 'issued' | 'completed' | 'cancelled';
  confirmBy?: string;
  confirmByName?: string;
  secondConfirmBy?: string;
  secondConfirmByName?: string;
  invoiceFile?: string; // 发票文件URL，存储在MinIO中，格式为 /api/files/{filename}
  contractFile?: string; // 相关合同文件URL，存储在MinIO中
  createdAt: string;
  completedAt?: string;
}
```

### 3.3 付款申请

```typescript
interface Payment {
  id: string;
  paymentNo: string;
  type: 'procurement' | 'salary' | 'rent' | 'other';
  sourceId?: string;                              // 关联采购单号等
  supplierId?: string;
  supplierName?: string;
  amount: number;
  bankAccount: string;
  bankName: string;
  accountHolder: string;
  status: 'pending_approval' | 'approved' | 'paid' | 'rejected' | 'cancelled';
  applicantId: string;
  applicantName: string;
  approverId?: string;
  approverName?: string;
  approveRemark?: string;
  voucherUrl?: string;                            // 付款凭证
  createdAt: string;
  approvedAt?: string;
  paidAt?: string;
}
```

---

## 第四部分：API 接口设计

```typescript
// 基础路径：/api/finance

// 店铺充值
GET  /api/finance/recharges                        // 充值列表
PUT  /api/finance/recharges/:id/confirm            // 确认充值

// 发票管理
GET  /api/finance/invoices                         // 发票列表
GET  /api/finance/invoices/:id                     // 发票详情
PUT  /api/finance/invoices/:id/confirm             // 确认发票

// 财务付款
GET  /api/finance/payments                         // 付款列表
GET  /api/finance/payments/:id                     // 付款详情
PUT  /api/finance/payments/:id/approve             // 审批付款
PUT  /api/finance/payments/:id/pay                 // 确认付款
```

---

## 第五部分：前端设计

### 5.1 目录结构

```
src/
├── views/
│   └── finance/
│       ├── recharges/
│       │   ├── List.vue
│       │   └── Detail.vue
│       ├── invoices/
│       │   ├── List.vue
│       │   └── Detail.vue
│       └── payments/
│           ├── List.vue
│           └── Detail.vue
├── stores/
│   └── finance.js
├── api/
│   └── finance.js
└── mock/
    └── finance.js
```

---

## 第六部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 店铺充值 | 2 天 |
| 2 | 发票管理 | 2 天 |
| 3 | 财务付款 | 3 天 |
| 4 | 联调测试 | 2 天 |
| **总计** | | **9 天** |
