# 运营模块 - 需求与设计文档

**模块名称**: operations  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 第一部分：需求概述

### 1.1 模块介绍

运营模块负责商城系统管理、营销活动管理、入驻商家管理等运营相关工作。支持电脑端和手机端。

### 1.2 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 运营人员 | 商品管理、活动管理 | 运营基础功能 |
| 运营主管 | 活动审批、数据统计 | 运营全模块 |
| 商家管理员 | 商家管理、商品审核 | 商家管理功能 |
| 管理员 | 全局管理 | 所有功能 |

### 1.3 子模块列表

| 子模块 | 电脑端 | 手机端 | 核心功能 |
|--------|--------|--------|----------|
| 商城系统 | ✅ | ✅ | 商品信息、商城商品、分类管理 |
| 营销管理 | ✅ | ✅ | 特殊定价、呆滞商品 |
| 活动管理 | ✅ | ✅ | 主题活动、秒杀、赠品、海报、优惠券 |
| 入驻商家 | ✅ | ✅ | 商家管理、商品管理、账号创建 |

---

## 第二部分：功能需求

### 2.1 商城系统

#### 功能描述
管理商城商品信息和分类。

#### 核心功能
1. **商品信息管理**
   - 商品列表（筛选、搜索）
   - 商品详情
   - 创建/编辑商品
   - 商品上下架
   - 商品图片管理

2. **商城商品管理**
   - 商城展示商品配置
   - 推荐商品设置
   - 商品排序

3. **分类管理**
   - 分类列表（树形结构）
   - 创建/编辑分类
   - 分类排序
   - 分类图标上传

4. **商品分公司配置**
   - 分公司商品配置
   - 差异化定价
   - 区域库存

---

### 2.2 营销管理

#### 功能描述
管理商品定价和呆滞商品处理。

#### 核心功能
1. **特殊定价**
   - 特殊价格申请列表
   - 定价审核
   - 价格生效/失效

2. **呆滞商品**
   - 呆滞商品识别
   - 呆滞商品列表
   - 处理方案（促销/清仓/下架）

---

### 2.3 活动管理

#### 功能描述
管理商城各类营销活动。

#### 核心功能
1. **主题活动**
   - 活动列表
   - 创建活动
   - 活动商品配置
   - 活动页面配置

2. **秒杀活动**
   - 秒杀商品配置
   - 秒杀时间设置
   - 库存限制
   - 限购设置

3. **赠品活动**
   - 赠品规则设置
   - 赠品库存管理
   - 赠品发放记录

4. **开屏海报**
   - 海报上传
   - 海报配置（跳转链接、展示时间）
   - 海报上下架

5. **优惠券管理**
   - 优惠券创建
   - 优惠券配置（面额、门槛、有效期）
   - 优惠券发放
   - 优惠券使用统计

---

### 2.4 入驻商家管理

#### 功能描述
管理入驻平台和商家商品。

#### 核心功能
1. **商家管理**
   - 商家列表
   - 商家入驻审核
   - 商家信息编辑
   - 商家资质管理

2. **商品管理**
   - 商家商品列表
   - 商品审核
   - 商品下架

3. **创建账号**
   - 商家账号创建
   - 账号权限配置
   - 账号启用/禁用

---

## 第三部分：数据模型

### 3.1 商品信息

```typescript
interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  description: string;
  costPrice: number;
  retailPrice: number;
  unit: string;                                 // 单位：件/箱/个
  status: 'active' | 'inactive';
  branchConfig: ProductBranchConfig[];
  createdAt: string;
  updatedAt: string;
}

interface ProductBranchConfig {
  branchId: string;
  branchName: string;
  price: number;                                // 分公司差异化定价
  stock: number;                                // 区域库存
}
```

### 3.2 分类

```typescript
interface Category {
  id: string;
  code: string;
  name: string;
  parentId?: string;
  icon?: string;
  sortOrder: number;
  status: 'active' | 'inactive';
  children?: Category[];
}
```

### 3.3 特殊定价

```typescript
interface SpecialPrice {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  originalPrice: number;
  specialPrice: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired';
  applicantId: string;
  applicantName: string;
  approverId?: string;
  approverName?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}
```

### 3.4 呆滞商品

```typescript
interface StagnantProduct {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  stock: number;
  lastSaleDate?: string;
  stagnantDays: number;                           // 呆滞天数
  totalCost: number;                              // 占用资金
  suggestedAction: 'promotion' | 'clearance' | 'delist';
  action?: string;
  status: 'identified' | 'processing' | 'resolved';
}
```

### 3.5 活动

```typescript
interface Campaign {
  id: string;
  name: string;
  type: 'theme' | 'flash_sale' | 'gift' | 'poster';
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'ended' | 'cancelled';
  products: CampaignProduct[];
  createdAt: string;
}

interface CampaignProduct {
  productId: string;
  productName: string;
  sku: string;
  campaignPrice: number;
  limitQty?: number;                              // 限购数量
  limitPerUser?: number;                          // 每人限购
  stock: number;
}
```

### 3.6 优惠券

```typescript
interface Coupon {
  id: string;
  name: string;
  type: 'discount' | 'fixed' | 'shipping';         // 折扣/满减/免运费
  value: number;                                  // 折扣率或减免金额
  minAmount: number;                              // 使用门槛
  totalQty: number;
  issuedQty: number;
  usedQty: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
}

interface UserCoupon {
  id: string;
  userId: string;
  couponId: string;
  couponName: string;
  status: 'unused' | 'used' | 'expired';
  receivedAt: string;
  usedAt?: string;
}
```

### 3.7 商家

```typescript
interface Merchant {
  id: string;
  name: string;
  type: 'individual' | 'enterprise';
  contactName: string;
  contactPhone: string;
  licenseUrl?: string;                            // 营业执照
  status: 'pending' | 'approved' | 'rejected' | 'disabled';
  products: number;
  salesAmount: number;
  createdAt: string;
  approvedAt?: string;
}
```

---

## 第四部分：API 接口设计

```typescript
// 基础路径：/api/operations

// 商品管理
GET  /api/operations/products                    // 商品列表
GET  /api/operations/products/:id                // 商品详情
POST /api/operations/products                    // 创建商品
PUT  /api/operations/products/:id                // 编辑商品
PUT  /api/operations/products/:id/status         // 上下架

// 分类管理
GET  /api/operations/categories                  // 分类列表
POST /api/operations/categories                  // 创建分类
PUT  /api/operations/categories/:id              // 编辑分类

// 营销活动
GET  /api/operations/campaigns                   // 活动列表
POST /api/operations/campaigns                   // 创建活动
PUT  /api/operations/campaigns/:id                // 编辑活动

// 优惠券
GET  /api/operations/coupons                     // 优惠券列表
POST /api/operations/coupons                     // 创建优惠券
PUT  /api/operations/coupons/:id                  // 编辑优惠券

// 商家管理
GET  /api/operations/merchants                   // 商家列表
POST /api/operations/merchants/:id/audit         // 商家审核
GET  /api/operations/merchants/:id/products      // 商家商品
PUT  /api/operations/merchants/:id/status        // 商家状态
```

---

## 第五部分：前端设计

### 5.1 目录结构

```
src/
├── views/
│   └── operations/
│       ├── products/
│       │   ├── List.vue
│       │   ├── Create.vue
│       │   └── Detail.vue
│       ├── categories/
│       │   └── List.vue
│       ├── campaigns/
│       │   ├── List.vue
│       │   └── Create.vue
│       ├── coupons/
│       │   ├── List.vue
│       │   └── Create.vue
│       └── merchants/
│           ├── List.vue
│           └── Detail.vue
├── stores/
│   └── operations.js
├── api/
│   └── operations.js
└── mock/
    └── operations.js
```

---

## 第六部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 商品管理 | 5 天 |
| 2 | 分类管理 | 2 天 |
| 3 | 营销活动 | 5 天 |
| 4 | 商家管理 | 4 天 |
| 5 | 联调测试 | 4 天 |
| **总计** | | **20 天** |
