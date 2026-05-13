# 商城模块 - Speckit 需求规格

## 模块信息
- **模块名称**: mall
- **模块介绍**: 商城模块是 C 端用户使用的移动商城应用，包含首页、商品浏览、下单支付、订单管理等功能。仅支持手机端（UniApp）。
- **支持平台**: 手机端 UniApp
- **总工期**: 23天
- **版本**: v1.0
- **更新日期**: 2026-05-09

---

## 用户角色

| 角色 | 说明 |
|------|------|
| 普通用户 | 浏览商品、下单购买 |
| VIP 用户 | 享受 VIP 价格和权益 |
| 超级 VIP | 享受最高等级权益 |

---

## 子模块清单

| 子模块 | 手机端 | 核心功能 | 状态 |
|--------|--------|----------|------|
| 首页 | ✅ | 弹窗、轮播图、公告、分类、推荐 | 未开始 |
| 商品分类 | ✅ | 商品搜索、分类筛选 | 未开始 |
| 订单 | ✅ | 订单列表、售后申请 | 未开始 |
| 购物车 | ✅ | 购物车管理 | 未开始 |
| 超级 VIP | ✅ | VIP 开通购买 | 未开始 |
| 客服 | ✅ | 电话/智能客服、反馈 | 未开始 |
| 我的 | ✅ | 个人信息、设置 | 未开始 |

---

## 功能需求

### FR-001: 首页
**优先级**: P0
**描述**: 商城首页展示

**子功能**:
- FR-001-1: 弹窗
  - 活动弹窗展示
  - 优惠券弹窗
  - 首次访问提示

- FR-001-2: 轮播图
  - 活动海报轮播
  - 点击跳转商品/活动页

- FR-001-3: 滚动公告
  - 系统公告滚动展示
  - 活动通知

- FR-001-4: 产品分类
  - 分类图标入口
  - 点击跳转分类页

- FR-001-5: 好物推荐
  - 推荐商品展示
  - 热销排行

- FR-001-6: 商品列表
  - 瀑布流展示
  - 下拉刷新
  - 上拉加载更多

### FR-002: 商品分类
**优先级**: P0
**描述**: 商品浏览和搜索

**子功能**:
- FR-002-1: 商品搜索框
  - 关键词搜索
  - 热门搜索推荐
  - 搜索历史记录

- FR-002-2: 分类选择
  - 一级分类列表
  - 二级分类列表
  - 筛选条件（价格、销量、新品）

### FR-003: 购物车
**优先级**: P0
**描述**: 购物车管理

**子功能**:
- FR-003-1: 购物车列表
  - 商品勾选/取消勾选
  - 商品数量调整
  - 全选/取消全选
  - 删除商品

- FR-003-2: 结算
  - 选中商品合计
  - 运费计算
  - 优惠券选择
  - 提交订单

### FR-004: 订单
**优先级**: P0
**描述**: 订单管理

**子功能**:
- FR-004-1: 订单列表
  - 按状态筛选（全部/待付款/待发货/待收货/已完成）
  - 订单卡片展示

- FR-004-2: 订单详情
  - 订单信息展示
  - 商品清单
  - 物流信息
  - 订单操作（取消、确认收货、评价）

- FR-004-3: 售后申请
  - 破损申请
  - 退货申请
  - 退款申请

### FR-005: 超级 VIP
**优先级**: P1
**描述**: VIP 会员系统

**子功能**:
- FR-005-1: VIP 页面
  - VIP 权益展示
  - VIP 价格对比

- FR-005-2: 开通购买
  - VIP 套餐选择
  - 支付开通

### FR-006: 客服
**优先级**: P1
**描述**: 客服和反馈

**子功能**:
- FR-006-1: 电话客服
  - 一键拨号

- FR-006-2: 意见反馈
  - 反馈表单
  - 图片上传

- FR-006-3: 智能客服
  - 常见问题
  - 智能问答

### FR-007: 我的
**优先级**: P1
**描述**: 个人中心

**子功能**:
- FR-007-1: 专属客服
  - 客服入口

- FR-007-2: 修改信息
  - 头像修改
  - 昵称修改
  - 手机号修改

- FR-007-3: 注册登录
  - 手机号注册
  - 验证码登录

---

## 数据模型

### Product (商品)
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

### Category (分类)
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

### Cart (购物车)
```typescript
interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  selectedItems: string[];
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

### Order (订单)
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

### AfterSale (售后)
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

### VipPackage (VIP 套餐)
```typescript
interface VipPackage {
  id: string;
  name: string;
  level: 'vip' | 'super_vip';
  price: number;
  originalPrice: number;
  duration: number;
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

### Announcement (公告)
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

### Banner (轮播图)
```typescript
interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder: number;
  status: 'active' | 'inactive';
}
```

### Feedback (反馈)
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

## API 接口

**基础路径**: `/api/mall`

### 首页接口
- `GET /api/mall/home/banner` - 轮播图
- `GET /api/mall/home/announcements` - 公告
- `GET /api/mall/home/recommend` - 推荐商品

### 商品接口
- `GET /api/mall/products` - 商品列表
- `GET /api/mall/products/:id` - 商品详情
- `GET /api/mall/categories` - 分类列表
- `GET /api/mall/products/search` - 商品搜索

### 购物车接口
- `GET /api/mall/cart` - 购物车列表
- `POST /api/mall/cart/items` - 添加商品
- `PUT /api/mall/cart/items/:id` - 更新数量
- `DELETE /api/mall/cart/items/:id` - 删除商品
- `PUT /api/mall/cart/select` - 批量选择

### 订单接口
- `GET /api/mall/orders` - 订单列表
- `GET /api/mall/orders/:id` - 订单详情
- `POST /api/mall/orders` - 创建订单
- `POST /api/mall/orders/:id/pay` - 支付订单
- `PUT /api/mall/orders/:id/cancel` - 取消订单
- `PUT /api/mall/orders/:id/confirm` - 确认收货

### 售后接口
- `POST /api/mall/after-sales` - 申请售后
- `GET /api/mall/after-sales` - 售后列表
- `GET /api/mall/after-sales/:id` - 售后详情

### VIP 接口
- `GET /api/mall/vip/info` - VIP 信息
- `POST /api/mall/vip/purchase` - 购买 VIP

### 客服接口
- `GET /api/mall/customer-service/phone` - 客服电话
- `POST /api/mall/customer-service/feedback` - 提交反馈

### 用户接口
- `POST /api/mall/user/register` - 用户注册
- `POST /api/mall/user/login` - 用户登录
- `PUT /api/mall/user/profile` - 更新个人信息

---

## 技术栈

| 项目 | 手机端 |
|------|--------|
| 框架 | UniApp (Vue3 Composition API) |
| UI 组件库 | uView Plus 3.x |
| 状态管理 | Pinia 1.x |
| 网络请求 | uni.request 封装 |
| 地图服务 | 高德地图 UniApp SDK |
| 微信能力 | 微信登录、微信支付、模板消息 |

---

## 权限控制

### 路由权限
- `mall:products:view`: 浏览商品
- `mall:cart:manage`: 购物车管理
- `mall:orders:manage`: 订单管理
- `mall:after-sales:apply`: 申请售后
- `mall:vip:view`: 查看 VIP
- `mall:vip:purchase`: 购买 VIP

### 数据权限
- 普通用户：个人数据
- VIP 用户：享受 VIP 价格
- 超级 VIP：享受最高等级权益

---

## 完成进度

| 模块 | 前端页面 | 后端API | 数据库 | 状态 |
|------|---------|---------|--------|------|
| 首页 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 商品分类 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 购物车 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 订单 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 超级 VIP | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 客服 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 我的 | ❌ 0/0 | ❌ | ❌ | 未开始 |

**总工期**: 23天
**阶段1 首页开发**: 4天（未开始）
**阶段2 商品+分类开发**: 4天（未开始）
**阶段3 购物车开发**: 3天（未开始）
**阶段4 订单系统开发**: 5天（未开始）
**阶段5 VIP+客服+我的开发**: 3天（未开始）
**阶段6 联调测试**: 4天（未开始）