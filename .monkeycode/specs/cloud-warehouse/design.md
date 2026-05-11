# 云仓模块 - 设计文档

**模块名称**: cloud-warehouse  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 1. 数据模型设计

### 1.1 核心数据模型
```typescript
// 出库单
interface OutboundOrder {
  id: string;
  orderNo: string;
  type: 'sale' | 'return' | 'manual';
  items: OutboundItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  warehouseId: string;
  operatorId: string;
  createdAt: string;
}

// 入库单  
interface InboundOrder {
  id: string;
  orderNo: string;
  type: 'purchase' | 'return' | 'manual';
  items: InboundItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  warehouseId: string;
  operatorId: string;
  createdAt: string;
}

// 库存
interface Inventory {
  sku: string;
  productName: string;
  quantity: number;
  reserved: number;
  warehouseId: string;
  location: string;
  batchNo?: string;
  expiryDate?: string;
}
```

---

## 2. API 接口设计

**基础路径**: `/api/cloud-warehouse`

- `GET /api/cloud-warehouse/outbound` - 出库单列表
- `POST /api/cloud-warehouse/outbound` - 创建出库单
- `GET /api/cloud-warehouse/inbound` - 入库单列表
- `POST /api/cloud-warehouse/inbound` - 创建入库单
- `GET /api/cloud-warehouse/inventory` - 库存查询
- `POST /api/cloud-warehouse/inventory/check` - 库存盘点
- `GET /api/cloud-warehouse/admin/unloading` - 卸货管理

---

## 3. 前端架构设计

### 3.1 技术栈
| 项目 | 电脑端 | 手机端 |
|------|--------|--------|
| 框架 | Vue 3.3+ | UniApp (Vue3) |
| UI 组件 | Element Plus 2.x | uView Plus 3.x |
| 状态管理 | Pinia 1.x | Pinia 1.x |
| HTTP 客户端 | Axios 1.x | uni.request |

### 3.2 目录结构
```
src/
├── views/
│   └── cloud-warehouse/
│       ├── outbound/          # 出库管理
│       ├── inbound/           # 入库管理  
│       ├── inventory/         # 库存管理
│       └── admin/             # 行政管理
├── components/
│   └── cloud-warehouse/
├── stores/
│   └── cloudWarehouse.js
├── api/
│   └── cloudWarehouse.js
└── mock/
    └── cloudWarehouse.js
```

---

## 4. 后端架构设计

### 4.1 目录结构
```
internal/
├── handler/
│   └── cloud-warehouse/
├── service/
│   └── cloud-warehouse/
├── model/
│   └── cloud-warehouse/
└── dto/
    └── cloud-warehouse/
```

### 4.2 核心服务层
- **主要Service**: 处理核心业务逻辑
- **辅助Service**: 处理辅助业务逻辑
- **Repository模式**: 数据访问抽象

---

## 5. 性能优化策略

### 5.1 前端优化
- 列表虚拟化（大数据量）
- 图片懒加载
- 接口防抖/节流
- 数据缓存

### 5.2 后端优化
- 数据库索引优化
- Redis缓存热点数据
- 异步处理耗时操作
- 分页查询优化

