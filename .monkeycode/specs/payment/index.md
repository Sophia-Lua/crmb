# 支付模块 - 需求与设计文档

**模块名称**: payment  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 第一部分：需求概述

### 1.1 模块介绍

支付模块负责商家管理和收款管理。支持电脑端和手机端。

### 1.2 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 商家 | 查看收款记录 | 自己的数据 |
| 支付管理员 | 商家管理、收款管理 | 支付全模块 |
| 管理员 | 全局管理 | 所有功能 |

### 1.3 子模块列表

| 子模块 | 电脑端 | 手机端 | 核心功能 |
|--------|--------|--------|----------|
| 商家管理 | ✅ | ✅ | 商家列表、创建、编辑、删除 |
| 收款管理 | ✅ | ✅ | 收款列表、绑定商品 |

---

## 第二部分：功能需求

### 2.1 商家管理

#### 功能描述
管理支付商家。

#### 核心功能
1. **商家列表**
   - 商家信息
   - 合作状态
   - 收款统计

2. **创建商家**
   - 商家基本信息
   - 联系人信息
   - 结算信息
   - 资质上传

3. **编辑商家**
   - 修改信息
   - 资质更新

4. **删除商家**
   - 删除确认
   - 历史记录保留

---

### 2.2 收款管理

#### 功能描述
管理收款记录。

#### 核心功能
1. **收款列表**
   - 收款记录
   - 筛选（时间、商家、支付方式）
   - 收款统计

2. **时间选择**
   - 按日期筛选
   - 按月统计

3. **绑定商品**
   - 商品关联
   - 收款分类

---

## 第三部分：数据模型

### 3.1 商家

```typescript
interface Merchant {
  id: string;
  merchantNo: string;
  name: string;
  contactName: string;
  contactPhone: string;
  settlementType: 'daily' | 'weekly' | 'monthly';  // 结算周期
  settlementAccount: SettlementAccount;
  status: 'active' | 'inactive' | 'deleted';
  qualifications: string[];                        // 资质图片
  totalCollections: number;                        // 累计收款金额
  collectionCount: number;                         // 收款笔数
  createdAt: string;
  deletedAt?: string;
}

interface SettlementAccount {
  bankName: string;
  accountNo: string;
  accountHolder: string;
  branchName?: string;                             // 开户支行
}
```

### 3.2 收款记录

```typescript
interface Collection {
  id: string;
  collectionNo: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  payType: 'wechat' | 'alipay' | 'balance' | 'cash';
  productId?: string;
  productName?: string;
  category?: string;                               // 收款分类
  status: 'success' | 'refunded' | 'cancelled';
  remark?: string;
  createdAt: string;
}
```

---

## 第四部分：API 接口设计

```typescript
// 基础路径：/api/v1/payment

// 商家
GET  /api/v1/payment/merchants                        // 商家列表
POST /api/v1/payment/merchants                        // 创建商家
PUT  /api/v1/payment/merchants/:id                    // 编辑商家
DELETE /api/v1/payment/merchants/:id                  // 删除商家

// 收款
GET  /api/v1/payment/collections                      // 收款列表
GET  /api/v1/payment/collections/summary              // 收款汇总
POST /api/v1/payment/collections/bind-product         // 绑定商品
```

---

## 第五部分：前端设计

### 5.1 目录结构

```
src/
├── views/
│   └── payment/
│       ├── merchants/
│       │   ├── List.vue
│       │   └── Create.vue
│       └── collections/
│           └── List.vue
├── stores/
│   └── payment.js
├── api/
│   └── payment.js
└── mock/
    └── payment.js
```

---

## 第六部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 商家管理 | 3 天 |
| 2 | 收款管理 | 2 天 |
| 3 | 联调测试 | 2 天 |
| **总计** | | **7 天** |
