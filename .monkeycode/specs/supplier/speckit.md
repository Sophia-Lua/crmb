# 供应商模块 - Speckit 需求规格

## 模块信息
- **模块名称**: supplier
- **模块介绍**: 供应商模块负责订单管理、发货管理和对账。支持电脑端。
- **支持平台**: 电脑端 Web
- **总工期**: 16天
- **版本**: v1.0
- **更新日期**: 2026-05-09

---

## 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 供应商 | 订单管理、发货管理 | 供应商相关功能 |
| 采购员 | 供应商对接、对账 | 采购相关功能 |
| 管理员 | 全局管理 | 所有功能 |

---

## 子模块清单

| 子模块 | 电脑端 | 手机端 | 核心功能 | 状态 |
|--------|--------|--------|----------|------|
| 订单管理 | ✅ | ✅ | 采购订单查看、确认 | 未开始 |
| 发货管理 | ✅ | ✅ | 发货单创建、物流跟踪 | 未开始 |
| 对账管理 | ✅ | ✅ | 月度对账、差异处理 | 未开始 |

---

## 功能需求

### FR-001: 订单管理
**优先级**: P0
**描述**: 供应商端查看和确认采购订单

**子功能**:
- FR-001-1: 采购订单查看
  - 订单列表查看
  - 订单详情查看（商品、数量、金额）
  - 订单筛选和搜索

- FR-001-2: 订单确认
  - 确认接受订单
  - 拒绝订单（需填写原因）
  - 确认时间记录

- FR-001-3: 订单状态更新
  - 订单处理进度更新
  - 异常状态标记

- FR-001-4: 订单异常处理
  - 异常订单标记
  - 异常原因填写
  - 异常订单跟进

### FR-002: 发货管理
**优先级**: P0
**描述**: 管理发货单和物流信息

**子功能**:
- FR-002-1: 发货单创建
  - 选择订单发货
  - 填写发货数量
  - 发货单号生成

- FR-002-2: 物流信息录入
  - 物流公司选择
  - 物流单号录入
  - 物流信息跟踪

- FR-002-3: 发货状态跟踪
  - 发货状态更新
  - 在途状态跟踪
  - 签收状态确认

- FR-002-4: 发货异常处理
  - 发货异常标记
  - 异常原因填写
  - 异常处理方案

### FR-003: 对账管理
**优先级**: P1
**描述**: 月度对账和差异处理

**子功能**:
- FR-003-1: 月度对账单
  - 对账单查看
  - 对账明细核对
  - 对账金额确认

- FR-003-2: 差异处理
  - 差异金额标记
  - 差异原因说明
  - 差异协商记录

- FR-003-3: 对账确认
  - 对账单确认签署
  - 确认结果通知

- FR-003-4: 付款进度查询
  - 付款状态查看
  - 付款计划查看
  - 付款到账通知

---

## 数据模型

### SupplierOrder (供应商订单)
```typescript
interface SupplierOrder {
  id: string;
  orderId: string;
  items: SupplierOrderItem[];
  status: 'received' | 'confirmed' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  confirmTime?: string;
  shipTime?: string;
}
```

### ShippingOrder (发货单)
```typescript
interface ShippingOrder {
  id: string;
  supplierOrderId: string;
  logisticsCompany: string;
  trackingNo: string;
  items: ShippingItem[];
  status: 'created' | 'shipped' | 'delivered' | 'returned';
}
```

### ReconciliationBill (对账单)
```typescript
interface ReconciliationBill {
  id: string;
  supplierId: string;
  period: string;
  totalAmount: number;
  discrepancyAmount: number;
  status: 'generated' | 'reviewed' | 'confirmed' | 'settled';
}
```

---

## API 接口

**基础路径**: `/api/supplier`

### 订单管理 API
- `GET /api/supplier/orders` - 供应商订单列表
- `GET /api/supplier/orders/:id` - 订单详情
- `PUT /api/supplier/orders/:id/confirm` - 确认订单
- `PUT /api/supplier/orders/:id/reject` - 拒绝订单
- `PUT /api/supplier/orders/:id/status` - 更新订单状态

### 发货管理 API
- `POST /api/supplier/shipping` - 创建发货单
- `GET /api/supplier/shipping` - 发货单列表
- `GET /api/supplier/shipping/:id` - 发货单详情
- `PUT /api/supplier/shipping/:id/status` - 更新发货状态
- `POST /api/supplier/shipping/:id/logistics` - 录入物流信息

### 对账管理 API
- `GET /api/supplier/reconciliation` - 对账单列表
- `GET /api/supplier/reconciliation/:id` - 对账单详情
- `PUT /api/supplier/reconciliation/:id/confirm` - 确认对账
- `POST /api/supplier/reconciliation/:id/dispute` - 差异申报

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
- `supplier:orders:view`: 查看供应商订单
- `supplier:orders:confirm`: 确认订单
- `supplier:shipping:view`: 查看发货管理
- `supplier:shipping:manage`: 管理发货
- `supplier:reconciliation:view`: 查看对账
- `supplier:reconciliation:confirm`: 确认对账

### 数据权限
- 供应商：仅本供应商数据
- 采购员：所有供应商数据
- 管理员：全局数据

---

## 完成进度

| 模块 | 前端页面 | 后端API | 数据库 | 状态 |
|------|---------|---------|--------|------|
| 订单管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 发货管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 对账管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |

**总工期**: 16天
**阶段1 核心功能开发**: 5天（未开始）
**阶段2 辅助功能开发**: 4天（未开始）
**阶段3 联调测试**: 3天（未开始）