# 销售模块 - 设计文档

**模块名称**: sales-module  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 1. 数据模型设计

### 1.1 拜访记录
```typescript
interface Visit {
  id: string;
  customerId: string;
  customerName: string;
  customerType: 'public' | 'private';
  visitType: 'first' | 'regular' | 'temporary' | 'other';
  visitMethod: 'onsite' | 'phone' | 'video' | 'wechat';
  planDate: string;
  planTime?: string;
  subject: string;
  content: string;
  images?: VisitImage[]; // 图片存储在MinIO中，URL格式为 /api/files/{filename}
  feedback?: string;
  followUpPlan?: string;
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

interface VisitImage {
  id: string;
  url: string; // MinIO文件URL
  name: string;
  size: number;
  type: string;
}
```

### 1.2 店铺
```typescript
interface Store {
  id: string;
  storeName: string;
  storeType: 'supermarket' | 'convenience' | 'restaurant' | 'other';
  address: string;
  province: string;
  city: string;
  district: string;
  latitude?: number;
  longitude?: number;
  area?: number;
  contactName: string;
  contactPhone: string;
  licenses: StoreLicense[]; // 资质图片存储在MinIO中，URL格式为 /api/files/{filename}
  status: 'unclaimed' | 'pending' | 'reviewing' | 'approved' | 'rejected';
  claimBy?: string;
  assignedTo?: string;
  reviewBy?: string;
  rejectReason?: string;
}

interface StoreLicense {
  id: string;
  url: string; // MinIO文件URL
  name: string;
  type: string; // 如：营业执照、食品经营许可证等
  expiryDate?: string; // 过期日期
}
```

### 1.3 客户
```typescript
interface Customer {
  id: string;
  customerName: string;
  customerType: 'public' | 'private' | 'blacklist';
  storeType: 'supermarket' | 'convenience' | 'restaurant' | 'other';
  address: string;
  province: string;
  city: string;
  district: string;
  latitude?: number;
  longitude?: number;
  area?: number;
  contactName: string;
  contactPhone: string;
  businessHours?: string;
  mainCategories?: string[];
  grade?: 'A' | 'B' | 'C' | 'D';
  assignedTo?: string;
  lastVisitDate?: string;
  totalOrderAmount?: number;
  status: 'active' | 'inactive' | 'blacklisted';
  createdAt: string;
  updatedAt: string;
}
```

### 1.4 客诉
```typescript
interface Complaint {
  id: string;
  complaintNo: string;
  customerId: string;
  customerName: string;
  relatedOrderId?: string;
  type: 'quality' | 'service' | 'delivery' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  content: string;
  images?: string[];
  status: 'pending' | 'accepted' | 'processing' | 'resolved' | 'closed';
  assigneeId?: string;
  assigneeName?: string;
  process: ComplaintProcess[];
  satisfaction?: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
  closedAt?: string;
}

interface ComplaintProcess {
  id: string;
  action: string;
  operatorId: string;
  operatorName: string;
  content: string;
  createdAt: string;
}
```

### 1.5 特殊备货需求
```typescript
interface SpecialStockRequest {
  id: string;
  requestId: string;
  customerId: string;
  customerName: string;
  productName: string;
  sku: string;
  quantity: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  approvedBy?: string;
  fulfilledBy?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 1.6 黑名单
```typescript
interface BlacklistCustomer {
  id: string;
  customerId: string;
  customerName: string;
  reason: string;
  blacklistedBy: string;
  blacklistedAt: string;
  notes?: string;
}
```

---

## 2. API 接口设计

**基础路径**: `/api/sales`

### 2.1 拜访记录 API
- `GET /api/sales/visits` - 获取拜访列表
- `GET /api/sales/visits/:id` - 获取拜访详情
- `POST /api/sales/visits` - 创建拜访记录
- `PUT /api/sales/visits/:id` - 更新拜访记录
- `DELETE /api/sales/visits/:id` - 删除拜访记录
- `GET /api/sales/visits/statistics` - 获取统计数据

### 2.2 店铺管理 API
- `GET /api/sales/stores/unclaimed` - 获取待领取店铺列表
- `GET /api/sales/stores/review` - 获取待审核店铺列表
- `GET /api/sales/stores/:id` - 获取店铺详情
- `POST /api/sales/stores/:id/claim` - 领取店铺
- `POST /api/sales/stores/:id/review` - 审核店铺
- `POST /api/sales/stores/:id/assign` - 分配店铺
- `GET /api/sales/stores/statistics` - 获取统计数据

### 2.3 客户管理 API
- `GET /api/sales/customers/public` - 获取公海客户列表
- `GET /api/sales/customers/private` - 获取私海客户列表
- `GET /api/sales/customers/:id` - 获取客户详情
- `POST /api/sales/customers/:id/claim` - 领取客户
- `POST /api/sales/customers/:id/return` - 归还公海
- `POST /api/sales/customers/:id/transfer` - 转移客户
- `GET /api/sales/customers/search` - 客户搜索

### 2.4 销售地图 API
- `GET /api/sales/map/customers` - 获取客户分布数据
- `GET /api/sales/map/unregistered` - 获取未注册店铺数据
- `GET /api/sales/markers/:id` - 获取标记详情

### 2.5 其他 API
- `GET /api/sales/complaints` - 客诉列表
- `GET /api/sales/special-stock-requests` - 特殊备货需求列表
- `GET /api/sales/blacklist` - 黑名单列表

---

## 3. 前端架构设计

### 3.1 技术栈
| 项目 | 电脑端 | 手机端 |
|------|--------|--------|
| 框架 | Vue 3.3+ | UniApp (Vue3) |
| UI 组件 | Element Plus 2.x | uView Plus 3.x |
| 状态管理 | Pinia 1.x | Pinia 1.x |
| HTTP 客户端 | Axios 1.x | uni.request |
| 地图 | 高德地图 JS API | 高德地图 UniApp SDK |

### 3.2 目录结构
```
src/
├── views/
│   └── sales/
│       ├── visits/              # 拜访记录
│       │   ├── List.vue
│       │   ├── Create.vue
│       │   └── Detail.vue
│       ├── stores/              # 店铺管理
│       │   ├── Unclaimed.vue
│       │   ├── Review.vue
│       │   ├── Detail.vue
│       │   └── Assign.vue
│       ├── customers/           # 客户管理
│       │   ├── Public.vue       # 公海
│       │   ├── Private.vue      # 私海
│       │   └── Detail.vue
│       ├── map/                 # 销售地图
│       │   └── Index.vue
│       ├── complaints/          # 客诉
│       │   └── List.vue
│       └── ...
├── components/
│   └── sales/
│       ├── VisitCard.vue
│       ├── StoreCard.vue
│       ├── CustomerCard.vue
│       ├── MapViewer.vue
│       └── ...
├── stores/
│   └── sales.js                 # 销售模块状态管理
├── api/
│   └── sales.js                 # 销售模块 API 封装
└── mock/
    └── sales.js                 # Mock 数据
```

### 3.3 核心组件设计

#### 3.3.1 拜访列表页 (电脑端)
- 统计面板组件
- 筛选区域组件  
- 列表表格组件
- 分页组件

#### 3.3.2 店铺详情页 (手机端)
- 状态栏组件
- 信息卡片组件
- 资质图片网格组件
- 地图定位组件
- 底部操作栏组件

#### 3.3.3 销售地图页 (通用)
- 图层控制组件
- 地图容器组件
- 标记详情弹窗组件

---

## 4. 后端架构设计

### 4.1 目录结构
```
internal/
├── handler/
│   └── sales/
│       ├── visit_handler.go
│       ├── store_handler.go
│       ├── customer_handler.go
│       └── map_handler.go
├── service/
│   └── sales/
│       ├── visit_service.go
│       ├── store_service.go
│       ├── customer_service.go
│       └── map_service.go
├── model/
│   └── sales/
│       ├── visit.go
│       ├── store.go
│       └── customer.go
└── dto/
    └── sales/
        ├── visit_dto.go
        ├── store_dto.go
        └── customer_dto.go
```

### 4.2 核心服务层
- **VisitService**: 处理拜访记录的业务逻辑
- **StoreService**: 处理店铺管理的业务逻辑  
- **CustomerService**: 处理客户管理的业务逻辑
- **MapService**: 处理地图相关业务逻辑

### 4.3 数据访问层
- 使用GORM进行数据库操作
- 实现Repository模式
- 支持分页查询和复杂条件查询

---

## 5. 权限控制设计

### 5.1 路由权限
- `sales:visits:view`: 查看拜访记录
- `sales:visits:create`: 创建拜访记录
- `sales:visits:edit`: 编辑拜访记录
- `sales:stores:claim`: 领取店铺
- `sales:stores:review`: 审核店铺
- `sales:customers:public`: 访问公海客户
- `sales:customers:private`: 访问私海客户

### 5.2 按钮权限
- 基于用户角色和权限码的细粒度控制
- 支持动态权限配置
- 前端指令实现权限控制

---

## 6. 性能优化策略

### 6.1 前端优化
- 列表虚拟化（大数据量）
- 图片懒加载
- 接口防抖（搜索输入500ms）
- 数据缓存（5分钟）

### 6.2 后端优化
- 数据库索引优化
- Redis缓存热点数据
- 异步处理耗时操作
- 分页查询优化