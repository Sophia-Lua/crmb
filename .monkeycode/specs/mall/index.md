# 商城模块 - 需求与设计文档

**模块名称**: mall  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 第一部分：需求概述

### 1.1 模块介绍

商城模块是 C 端用户使用的移动商城应用，包含首页、商品浏览、下单支付、订单管理等功能。仅支持手机端（UniApp）。

### 1.2 用户角色

| 角色 | 说明 |
|------|------|
| 普通用户 | 浏览商品、下单购买 |
| VIP 用户 | 享受 VIP 价格和权益 |
| 超级 VIP | 享受最高等级权益 |

### 1.3 子模块列表

| 子模块 | 手机端 | 核心功能 |
|--------|--------|----------|
| 首页 | ✅ | 弹窗、轮播图、公告、分类、推荐 |
| 商品分类 | ✅ | 商品搜索、分类筛选 |
| 订单 | ✅ | 订单列表、售后申请 |
| 购物车 | ✅ | 购物车管理 |
| 超级 VIP | ✅ | VIP 开通购买 |
| 客服 | ✅ | 电话/智能客服、反馈 |
| 我的 | ✅ | 个人信息、设置 |

---

## 第二部分：功能需求

### 2.1 首页

#### 功能描述
商城首页展示。

#### 核心功能
1. **弹窗**
   - 活动弹窗
   - 优惠券弹窗
   - 首次访问提示

2. **轮播图**
   - 活动海报轮播
   - 点击跳转

3. **滚动公告**
   - 系统公告
   - 活动通知

4. **产品分类**
   - 分类图标入口
   - 点击跳转分类页

5. **好物推荐**
   - 推荐商品展示
   - 热销排行

6. **商品列表**
   - 瀑布流展示
   - 下拉刷新
   - 上拉加载更多

---

### 2.2 商品分类

#### 功能描述
商品浏览和搜索。

#### 核心功能
1. **商品搜索框**
   - 关键词搜索
   - 热门搜索
   - 搜索历史

2. **分类选择**
   - 一级分类
   - 二级分类
   - 筛选条件

---

### 2.3 订单

#### 功能描述
订单管理。

#### 核心功能
1. **订单列表**
   - 按状态筛选（全部/待付款/待发货/待收货/已完成）
   - 订单卡片展示

2. **订单详情**
   - 订单信息
   - 商品清单
   - 物流信息
   - 订单操作

3. **售后申请**
   - 破损申请
   - 退货申请
   - 退款申请

---

### 2.4 购物车

#### 功能描述
购物车管理。

#### 核心功能
1. **购物车列表**
   - 商品勾选
   - 数量调整
   - 全选/取消全选
   - 删除商品

2. **结算**
   - 选中商品合计
   - 运费计算
   - 优惠券选择
   - 提交订单

---

### 2.5 超级 VIP

#### 功能描述
VIP 会员系统。

#### 核心功能
1. **VIP 页面**
   - VIP 权益展示
   - VIP 价格对比

2. **开通购买**
   - VIP 套餐选择
   - 支付开通

---

### 2.6 客服

#### 功能描述
客服和反馈。

#### 核心功能
1. **电话客服**
   - 一键拨号

2. **意见反馈**
   - 反馈表单
   - 图片上传

3. **智能客服**
   - 常见问题
   - 智能问答

---

### 2.7 我的

#### 功能描述
个人中心。

#### 核心功能
1. **专属客服**
   - 客服入口

2. **修改信息**
   - 头像
   - 昵称
   - 手机号

3. **注册登录**
   - 手机号注册
   - 验证码登录

---

### 2.8 其他说明

#### 下单流程
```
选择商品 → 加入购物车 → 结算 → 选择地址 → 选择优惠券 → 
提交订单 → 支付 → 等待发货 → 确认收货 → 完成
```

#### 支付
- 微信支付
- 支付宝支付
- 余额支付

#### 收货
- 地址管理
- 物流跟踪
- 确认收货
- 评价

---

## 第三部分：数据模型

### 3.1 商品

```typescript
interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  description: string;
  price: number;
  vipPrice?: number;
  superVipPrice?: number;
  stock: number;
  status: 'on_sale' | 'off_sale' | 'out_of_stock';
  tags: string[];
  salesCount: number;
  createdAt: string;
  updatedAt: string;
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

### 3.3 购物车

```typescript
interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  selectedItems: string[];                        // 已勾选的商品 ID
  updatedAt: string;
}

interface CartItem {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  selected: boolean;
}
```

### 3.4 订单

```typescript
interface Order {
  id: string;
  orderNo: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  freight: number;
  payAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  payType?: 'wechat' | 'alipay' | 'balance';
  payTime?: string;
  address: ShippingAddress;
  couponId?: string;
  couponDiscount?: number;
  remark?: string;
  logistics?: LogisticsInfo;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
}

interface OrderItem {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
}

interface LogisticsInfo {
  company: string;
  trackingNo: string;
  records: LogisticsRecord[];
}

interface LogisticsRecord {
  timestamp: string;
  description: string;
}
```

### 3.5 售后

```typescript
interface AfterSale {
  id: string;
  afterSaleNo: string;
  orderId: string;
  orderNo: string;
  type: 'return' | 'exchange' | 'refund';
  reason: string;
  description: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  refundAmount?: number;
  createdAt: string;
}
```

### 3.6 VIP 套餐

```typescript
interface VipPackage {
  id: string;
  name: string;
  level: 'vip' | 'super_vip';
  price: number;
  originalPrice: number;
  duration: number;                               // 天数
  benefits: string[];
  status: 'active' | 'inactive';
}

interface UserVip {
  userId: string;
  level: 'normal' | 'vip' | 'super_vip';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}
```

### 3.7 公告

```typescript
interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'activity';
  status: 'draft' | 'published' | 'archived';
  publishAt?: string;
  createdAt: string;
}
```

### 3.8 轮播图

```typescript
interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder: number;
  status: 'active' | 'inactive';
}
```

### 3.9 反馈

```typescript
interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  content: string;
  images?: string[];
  status: 'pending' | 'processed' | 'closed';
  handlerReply?: string;
  createdAt: string;
}
```

---

## 第四部分：API 接口设计

```typescript
// 基础路径：/api/v1/mall

// 首页
GET  /api/v1/mall/home/banner                         // 轮播图
GET  /api/v1/mall/home/announcements                  // 公告
GET  /api/v1/mall/home/recommend                       // 推荐商品

// 商品
GET  /api/v1/mall/products                            // 商品列表
GET  /api/v1/mall/products/:id                        // 商品详情
GET  /api/v1/mall/categories                          // 分类列表

// 购物车
GET  /api/v1/mall/cart                                // 购物车列表
POST /api/v1/mall/cart/items                          // 添加商品
PUT  /api/v1/mall/cart/items/:id                      // 更新数量
DELETE /api/v1/mall/cart/items/:id                    // 删除商品

// 订单
GET  /api/v1/mall/orders                              // 订单列表
GET  /api/v1/mall/orders/:id                          // 订单详情
POST /api/v1/mall/orders                              // 创建订单
POST /api/v1/mall/orders/:id/pay                      // 支付订单

// 售后
POST /api/v1/mall/after-sales                         // 申请售后
GET  /api/v1/mall/after-sales                         // 售后列表

// VIP
GET  /api/v1/mall/vip/info                            // VIP 信息
POST /api/v1/mall/vip/purchase                        // 购买 VIP

// 客服
GET  /api/v1/mall/customer-service/phone              // 客服电话
POST /api/v1/mall/customer-service/feedback           // 提交反馈
```

---

## 第五部分：前端设计

### 5.1 目录结构

```
src/
├── pages/
│   └── mall/
│       ├── index/                   # 首页
│       │   └── index.vue
│       ├── category/                # 分类
│       │   └── index.vue
│       ├── product/                 # 商品详情
│       │   └── detail.vue
│       ├── cart/                    # 购物车
│       │   └── index.vue
│       ├── order/                   # 订单
│       │   ├── list.vue
│       │   └── detail.vue
│       ├── vip/                     # VIP
│       │   └── index.vue
│       ├── customer/                # 客服
│       │   └── index.vue
│       └── mine/                    # 我的
│           └── index.vue
├── components/
│   └── mall/
│       ├── ProductCard.vue
│       ├── Banner.vue
│       └── CartItem.vue
├── stores/
│   └── mall.js
├── api/
│   └── mall.js
└── mock/
    └── mall.js
```

---

## 第六部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 首页 | 4 天 |
| 2 | 商品 + 分类 | 4 天 |
| 3 | 购物车 | 3 天 |
| 4 | 订单系统 | 5 天 |
| 5 | VIP+ 客服 + 我的 | 3 天 |
| 6 | 联调测试 | 4 天 |
| **总计** | | **23 天** |
