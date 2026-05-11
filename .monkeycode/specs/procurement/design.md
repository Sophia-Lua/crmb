# 采购模块 - 设计文档

**模块名称**: procurement  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 1. 数据模型设计

### 1.1 核心数据模型
```typescript
// 供应商
interface Supplier {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string;
  email: string;
  address: string;
  rating: number;
  status: 'active' | 'inactive' | 'blacklisted';
  licenses: SupplierLicense[];
}

// 采购订单
interface PurchaseOrder {
  id: string;
  orderNo: string;
  supplierId: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'executing' | 'completed' | 'cancelled';
  approverId?: string;
  createdAt: string;
}

// 应付账款
interface AccountsPayable {
  id: string;
  supplierId: string;
  orderId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}
```

---

## 2. API 接口设计

**基础路径**: `/api/procurement`

- `GET /api/procurement/suppliers` - 供应商列表
- `POST /api/procurement/suppliers` - 创建供应商
- `GET /api/procurement/purchase-orders` - 采购订单列表
- `POST /api/procurement/purchase-orders` - 创建采购订单
- `GET /api/procurement/accounts-payable` - 应付账款列表
- `POST /api/procurement/settlement` - 结算申请

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
│   └── procurement/
│       ├── suppliers/         # 供应商管理
│       ├── purchase-orders/   # 采购订单
│       └── settlement/        # 结算管理
├── components/
│   └── procurement/
├── stores/
│   └── procurement.js
├── api/
│   └── procurement.js
└── mock/
    └── procurement.js
```

---

## 4. 后端架构设计

### 4.1 目录结构
```
internal/
├── handler/
│   └── procurement/
├── service/
│   └── procurement/
├── model/
│   └── procurement/
└── dto/
    └── procurement/
```

---

## 5. 性能优化策略

### 5.1 前端优化
- 列表虚拟化（大数据量）
- 接口防抖/节流
- 数据缓存

### 5.2 后端优化
- 数据库索引优化
- Redis缓存热点数据
- 异步处理耗时操作

