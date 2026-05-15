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

### 首页需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-001 | 作为一名普通用户 | 我希望能够查看活动弹窗展示 | 以便第一时间了解当前活动信息 |
| REQ-002 | 作为一名普通用户 | 我希望能够查看优惠券弹窗并领取优惠券 | 以便享受优惠减少购物支出 |
| REQ-003 | 作为一名普通用户 | 我希望能够查看首次访问提示 | 以便快速了解商城使用方式 |
| REQ-004 | 作为一名普通用户 | 我希望能够浏览活动海报轮播并点击跳转到商品或活动页 | 以便发现感兴趣的促销活动 |
| REQ-005 | 作为一名普通用户 | 我希望能够查看滚动公告和活动通知 | 以便获取重要通知信息 |
| REQ-006 | 作为一名普通用户 | 我希望能够通过分类图标入口快速跳转分类页 | 以便按分类浏览商品 |
| REQ-007 | 作为一名普通用户 | 我希望能够浏览推荐商品展示和热销排行 | 以便发现热门优质商品 |
| REQ-008 | 作为一名普通用户 | 我希望能够通过瀑布流方式浏览商品列表 | 以便高效浏览大量商品 |
| REQ-009 | 作为一名普通用户 | 我希望能够下拉刷新商品列表 | 以便获取最新商品数据 |
| REQ-010 | 作为一名普通用户 | 我希望能够上拉加载更多商品 | 以便持续浏览更多商品 |

### 商品分类需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-011 | 作为一名普通用户 | 我希望能够通过关键词搜索商品 | 以便快速找到目标商品 |
| REQ-012 | 作为一名普通用户 | 我希望能够查看热门搜索推荐 | 以便发现当前热门商品趋势 |
| REQ-013 | 作为一名普通用户 | 我希望能够查看搜索历史记录 | 以便快速复用之前搜索 |
| REQ-014 | 作为一名普通用户 | 我希望能够查看一级分类列表 | 以便选择商品大类 |
| REQ-015 | 作为一名普通用户 | 我希望能够查看二级分类列表 | 以便精确定位商品子类 |
| REQ-016 | 作为一名普通用户 | 我希望能够使用价格、销量、新品筛选条件 | 以便按偏好精准筛选商品 |

### 购物车需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-017 | 作为一名普通用户 | 我希望能够勾选或取消勾选购物车商品 | 以便选择需要结算的商品 |
| REQ-018 | 作为一名普通用户 | 我希望能够调整购物车商品数量 | 以便控制购买数量 |
| REQ-019 | 作为一名普通用户 | 我希望能够全选或取消全选购物车商品 | 以便快速批量选择商品结算 |
| REQ-020 | 作为一名普通用户 | 我希望能够删除购物车中不需要的商品 | 以便保持购物车整洁 |
| REQ-021 | 作为一名普通用户 | 我希望能够查看选中商品合计金额 | 以便了解待支付总额 |
| REQ-022 | 作为一名普通用户 | 我希望能够查看运费计算结果 | 以便预估订单总成本 |
| REQ-023 | 作为一名普通用户 | 我能够在结算时选择可用优惠券 | 以便享受优惠减少支出 |
| REQ-024 | 作为一名普通用户 | 我希望能够提交购物车结算订单 | 以便完成购买流程 |

### 订单需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-025 | 作为一名普通用户 | 我希望能够按状态筛选订单（全部/待付款/待发货/待收货/已完成） | 以便快速找到特定状态的订单 |
| REQ-026 | 作为一名普通用户 | 我希望能够以卡片形式查看订单列表 | 以便快速浏览订单概况 |
| REQ-027 | 作为一名普通用户 | 我希望能够查看订单详细信息 | 以便了解订单状态和详情 |
| REQ-028 | 作为一名普通用户 | 我希望能够查看订单商品清单 | 以便确认购买的商品明细 |
| REQ-029 | 作为一名普通用户 | 我希望能够查看物流配送信息 | 以便跟踪商品配送进度 |
| REQ-030 | 作为一名普通用户 | 我希望能够执行取消、确认收货、评价等订单操作 | 以便管理订单生命周期 |
| REQ-031 | 作为一名普通用户 | 我希望能够提交破损售后申请 | 以便处理收到的破损商品 |
| REQ-032 | 作为一名普通用户 | 我希望能够提交退货申请 | 以便退回不满意的商品 |
| REQ-033 | 作为一名普通用户 | 我希望能够提交退款申请 | 以便收回已支付的款项 |

### 超级VIP需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-034 | 作为一名VIP用户 | 我希望能够查看VIP权益展示 | 以便了解VIP等级对应的专属权益 |
| REQ-035 | 作为一名VIP用户 | 我希望能够查看VIP价格对比 | 以便直观感受VIP购物优惠力度 |
| REQ-036 | 作为一名普通用户 | 我希望能够选择VIP套餐 | 以便根据需求选择合适的会员等级 |
| REQ-037 | 作为一名普通用户 | 我希望能够支付开通VIP会员 | 以便享受VIP专属权益和优惠 |

### 客服需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-038 | 作为一名普通用户 | 我希望能够一键拨打客服电话 | 以便紧急问题时直接联系人工客服 |
| REQ-039 | 作为一名普通用户 | 我希望能够提交意见反馈表单 | 以便向平台反馈问题和建议 |
| REQ-040 | 作为一名普通用户 | 我能够在反馈中上传图片 | 以便更清晰地描述问题 |
| REQ-041 | 作为一名普通用户 | 我希望能够查看常见问题解答 | 以便快速找到问题答案自助解决 |
| REQ-042 | 作为一名普通用户 | 我希望能够使用智能问答获取帮助 | 以便24小时随时获得客服支持 |

### 我的需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-043 | 作为一名普通用户 | 我能够在个人中心找到客服入口 | 以便随时联系客服解决问题 |
| REQ-044 | 作为一名普通用户 | 我希望能够修改头像、昵称和手机号 | 以便维护个人资料准确性 |
| REQ-045 | 作为一名普通用户 | 我希望能够通过手机号注册账号 | 以便创建商城账户开始购物 |
| REQ-046 | 作为一名普通用户 | 我希望能够通过验证码登录账号 | 以便快速便捷地登录商城 |

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