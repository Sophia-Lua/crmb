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

### 订单管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-001 | 作为一名供应商 | 我希望能够查看采购订单列表和详情 | 以便了解采购需求和订单内容 |
| REQ-002 | 作为一名供应商 | 我希望能够确认接受或拒绝订单（需填写拒绝原因） | 以便及时响应采购需求安排供货 |
| REQ-003 | 作为一名供应商 | 我希望能够更新订单处理进度和标记异常状态 | 以便让采购方了解订单执行情况 |
| REQ-004 | 作为一名供应商 | 我希望能够标记异常订单、填写异常原因并跟进处理 | 以便及时解决订单异常避免延误 |

### 发货管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-005 | 作为一名供应商 | 我能够选择订单创建发货单并填写发货数量 | 以便安排发货配送 |
| REQ-006 | 作为一名供应商 | 我能够录入物流公司和物流单号 | 以便跟踪发货配送进度 |
| REQ-007 | 作为一名供应商 | 我能够更新和跟踪发货、在途、签收状态 | 以便掌握商品配送全流程 |
| REQ-008 | 作为一名供应商 | 我能够标记发货异常、填写原因和处理方案 | 以便及时处理配送中的异常问题 |

### 对账管理需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-009 | 作为一名供应商 | 我能够查看月度对账单和对账明细核对 | 以便核对交易金额准确性 |
| REQ-010 | 作为一名采购员 | 我能够标记差异金额、说明原因并记录协商过程 | 以便解决对账差异达成一致 |
| REQ-011 | 作为一名供应商 | 我能够确认签署对账单 | 以便正式确认对账结果推进结算 |
| REQ-012 | 作为一名供应商 | 我能够查看付款状态和付款计划 | 以便掌握回款进度做好资金规划 |

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