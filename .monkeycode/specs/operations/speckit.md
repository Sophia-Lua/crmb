# 运营模块 - Speckit 需求规格

## 模块信息
- **模块名称**: operations
- **模块介绍**: 运营模块负责商品管理、活动管理和商家审核。支持电脑端。
- **支持平台**: 电脑端 Web
- **总工期**: 18天
- **版本**: v1.0
- **更新日期**: 2026-05-09

---

## 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 运营人员 | 商品管理、活动管理 | 运营相关功能 |
| 运营主管 | 商家审核、数据管理 | 运营全模块 |
| 管理员 | 全局管理 | 所有功能 |

---

## 子模块清单

| 子模块 | 电脑端 | 手机端 | 核心功能 | 状态 |
|--------|--------|--------|----------|------|
| 商品管理 | ✅ | ✅ | 商品信息、分类、上下架 | 未开始 |
| 活动管理 | ✅ | ✅ | 促销活动、优惠券、秒杀 | 未开始 |
| 商家审核 | ✅ | ✅ | 商家入驻审核、资质管理 | 未开始 |

---

## 功能需求

### FR-001: 商品管理
**优先级**: P0
**描述**: 管理商品信息、分类和上下架控制

**子功能**:
- FR-001-1: 商品信息维护
  - 商品基础信息录入（名称、SKU、价格、描述）
  - 商品图片上传（多图、主图设置）
  - 商品规格管理

- FR-001-2: 商品分类管理
  - 分类层级管理（一级/二级分类）
  - 分类图标和排序
  - 分类状态控制

- FR-001-3: 商品上下架控制
  - 上架/下架操作
  - 批量上下架
  - 缺货状态标记

- FR-001-4: 商品库存同步
  - 库存数据同步（对接云仓模块）
  - 库存预警提醒

### FR-002: 活动管理
**优先级**: P0
**描述**: 管理促销活动、优惠券和秒杀

**子功能**:
- FR-002-1: 促销活动创建
  - 活动类型设置（折扣、满减、赠品）
  - 活动时间设置
  - 活动规则配置
  - 活动状态管理（草稿/上线/过期/取消）

- FR-002-2: 优惠券管理
  - 优惠券创建和发放
  - 优惠券使用规则
  - 优惠券核销统计

- FR-002-3: 秒杀活动配置
  - 秒杀商品设置
  - 秒杀时间窗口
  - 库存限量设置

- FR-002-4: 活动效果分析
  - 活动数据统计
  - 转化率分析
  - ROI计算

### FR-003: 商家审核
**优先级**: P1
**描述**: 管理商家入驻审核和资质管理

**子功能**:
- FR-003-1: 商家入驻申请
  - 商家信息登记
  - 入驻申请提交

- FR-003-2: 资质文件审核
  - 资质文件查看
  - 审核意见填写
  - 审核通过/驳回

- FR-003-3: 审核流程管理
  - 审核节点流转
  - 审核进度跟踪

- FR-003-4: 审核结果通知
  - 审核通过通知
  - 审核驳回通知（含驳回原因）

---

## 数据模型

### Product (商品)
```typescript
interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
  status: 'on_sale' | 'off_sale' | 'out_of_stock';
}
```

### Promotion (促销活动)
```typescript
interface Promotion {
  id: string;
  name: string;
  type: 'discount' | 'coupon' | 'flash_sale';
  startTime: string;
  endTime: string;
  rules: PromotionRule[];
  status: 'draft' | 'active' | 'expired' | 'cancelled';
}
```

### MerchantReview (商家审核)
```typescript
interface MerchantReview {
  id: string;
  merchantId: string;
  documents: ReviewDocument[];
  status: 'pending' | 'approved' | 'rejected';
  reviewerId?: string;
  rejectReason?: string;
}
```

---

## API 接口

**基础路径**: `/api/operations`

### 商品管理 API
- `GET /api/operations/products` - 商品列表
- `GET /api/operations/products/:id` - 商品详情
- `POST /api/operations/products` - 创建商品
- `PUT /api/operations/products/:id` - 更新商品
- `PUT /api/operations/products/:id/status` - 上下架控制

### 分类管理 API
- `GET /api/operations/categories` - 分类列表
- `POST /api/operations/categories` - 创建分类
- `PUT /api/operations/categories/:id` - 更新分类

### 活动管理 API
- `GET /api/operations/promotions` - 促销活动列表
- `POST /api/operations/promotions` - 创建促销活动
- `PUT /api/operations/promotions/:id` - 更新活动
- `GET /api/operations/promotions/:id/stats` - 活动效果统计

### 商家审核 API
- `GET /api/operations/merchant-reviews` - 商家审核列表
- `GET /api/operations/merchant-reviews/:id` - 审核详情
- `PUT /api/operations/merchant-reviews/:id/approve` - 审核通过
- `PUT /api/operations/merchant-reviews/:id/reject` - 审核驳回

---

## 技术栈

| 项目 | 电脑端 |
|------|--------|
| 框架 | Vue 3.3+ |
| UI 组件 | Element Plus 2.x |
| 状态管理 | Pinia 1.x |
| HTTP 客户端 | Axios 1.x |

---

## 权限控制

### 路由权限
- `ops:products:view`: 查看商品
- `ops:products:manage`: 管理商品
- `ops:promotions:view`: 查看活动
- `ops:promotions:manage`: 管理活动
- `ops:merchant-reviews:view`: 查看商家审核
- `ops:merchant-reviews:approve`: 审核商家

### 数据权限
- 运营人员：商品和活动数据
- 运营主管：全模块数据 + 审核权限
- 管理员：全局数据

---

## 完成进度

| 模块 | 前端页面 | 后端API | 数据库 | 状态 |
|------|---------|---------|--------|------|
| 商品管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 活动管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 商家审核 | ❌ 0/0 | ❌ | ❌ | 未开始 |

**总工期**: 18天
**阶段1 核心功能开发**: 6天（未开始）
**阶段2 辅助功能开发**: 5天（未开始）
**阶段3 联调测试**: 4天（未开始）