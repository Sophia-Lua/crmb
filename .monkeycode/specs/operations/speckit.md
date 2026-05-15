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

### 商品管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-001 | 作为一名运营人员 | 我希望能够录入商品基础信息（名称、SKU、价格、描述）、上传商品图片、管理商品规格 | 以便商品能在商城正确展示和销售 |
| REQ-002 | 作为一名运营人员 | 我希望能够管理分类层级（一级/二级分类）、设置分类图标和排序、控制分类状态 | 以便用户能按分类快速找到商品 |
| REQ-003 | 作为一名运营人员 | 我希望能够对商品执行上架/下架操作、批量上下架、标记缺货状态 | 以便灵活控制商品的可售状态 |
| REQ-004 | 作为一名运营人员 | 我希望能够同步库存数据（对接云仓模块）并接收库存预警提醒 | 以便及时掌握库存情况避免超卖 |

### 活动管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-005 | 作为一名运营人员 | 我希望能够创建促销活动（折扣/满减/赠品）、设置活动时间和规则、管理活动状态 | 以便吸引用户下单提升销量 |
| REQ-006 | 作为一名运营人员 | 我希望能够创建和发放优惠券、设置使用规则、统计核销数据 | 以便通过优惠激励用户消费 |
| REQ-007 | 作为一名运营人员 | 我希望能够配置秒杀商品、时间窗口和限量库存 | 以便在短时间内制造抢购热度 |
| REQ-008 | 作为一名运营主管 | 我希望能够查看活动数据统计、转化率分析和ROI计算 | 以便评估活动效果指导后续运营策略 |

### 商家审核需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-009 | 作为一名运营主管 | 我希望能够查看商家入驻申请和商家信息登记 | 以便评估商家是否符合入驻条件 |
| REQ-010 | 作为一名运营主管 | 我希望能够查看资质文件、填写审核意见、执行审核通过或驳回 | 以便确保入驻商家资质合规 |
| REQ-011 | 作为一名运营主管 | 我希望能够管理审核节点流转和审核进度跟踪 | 以便把控审核流程效率 |
| REQ-012 | 作为一名运营主管 | 我希望能够发送审核通过或驳回通知（含驳回原因） | 以便商家及时了解审核进展并做相应处理 |

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