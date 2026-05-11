# 商城模块 - 设计文档

**模块名称**: mall  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 1. 数据模型设计

### 1.1 商品
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

### 1.2 分类
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

### 1.3 购物车
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

### 1.4 订单
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

### 1.5 售后
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

### 1.6 VIP 套餐
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

### 1.7 公告
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

### 1.8 轮播图
```typescript
interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder: number;
  status: 'active' | 'inactive';
}
```

### 1.9 反馈
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

## 2. API 接口设计

**基础路径**: `/api/mall`

### 2.1 首页接口
- `GET /api/mall/home/banner` - 轮播图
- `GET /api/mall/home/announcements` - 公告
- `GET /api/mall/home/recommend` - 推荐商品

### 2.2 商品接口
- `GET /api/mall/products` - 商品列表
- `GET /api/mall/products/:id` - 商品详情
- `GET /api/mall/categories` - 分类列表

### 2.3 购物车接口
- `GET /api/mall/cart` - 购物车列表
- `POST /api/mall/cart/items` - 添加商品
- `PUT /api/mall/cart/items/:id` - 更新数量
- `DELETE /api/mall/cart/items/:id` - 删除商品

### 2.4 订单接口
- `GET /api/mall/orders` - 订单列表
- `GET /api/mall/orders/:id` - 订单详情
- `POST /api/mall/orders` - 创建订单
- `POST /api/mall/orders/:id/pay` - 支付订单

### 2.5 售后接口
- `POST /api/mall/after-sales` - 申请售后
- `GET /api/mall/after-sales` - 售后列表

### 2.6 VIP 接口
- `GET /api/mall/vip/info` - VIP 信息
- `POST /api/mall/vip/purchase` - 购买 VIP

### 2.7 客服接口
- `GET /api/mall/customer-service/phone` - 客服电话
- `POST /api/mall/customer-service/feedback` - 提交反馈

---

## 3. 前端架构设计

### 3.1 目录结构
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

### 3.2 技术栈
- **框架**: UniApp (Vue3 Composition API)
- **UI组件库**: uView Plus 3.x
- **状态管理**: Pinia 1.x
- **网络请求**: uni.request 封装
- **地图服务**: 高德地图 UniApp SDK
- **微信能力**: 微信登录、微信支付、模板消息