# 云仓模块 - Speckit 需求规格

## 模块信息
- **模块名称**: cloud-warehouse
- **模块介绍**: 云仓模块负责仓库的出入库管理、库存管理和行政管理。支持电脑端和手机端。
- **支持平台**: 电脑端 Web + 手机端 UniApp
- **总工期**: 20天
- **版本**: v1.0
- **更新日期**: 2026-05-09

---

## 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 仓管员 | 出入库操作、库存管理 | 仓库基础功能 |
| 仓库主管 | 库存审核、数据统计 | 仓库全模块 |
| 管理员 | 全局管理 | 所有功能 |

---

## 子模块清单

| 子模块 | 电脑端 | 手机端 | 核心功能 | 状态 |
|--------|--------|--------|----------|------|
| 出库管理 | ✅ | ✅ | 订单出库、退货出库、手动出库 | 未开始 |
| 入库管理 | ✅ | ✅ | 采购入库、退货入库、手动入库 | 未开始 |
| 库存管理 | ✅ | ✅ | 库存查询、盘点、预警 | 未开始 |
| 行政管理 | ✅ | ✅ | 卸货管理、排班、车辆 | 未开始 |

---

## 功能需求

### FR-001: 出库管理
**优先级**: P0
**描述**: 管理仓库出库流程

**子功能**:
- FR-001-1: 订单出库
  - 待出库订单列表
  - 拣货任务分配
  - 出库扫描确认
  - 出库完成通知

- FR-001-2: 退货出库
  - 退货出库单创建
  - 退供应商商品出库
  - 退货出库确认

- FR-001-3: 手动出库
  - 紧急出库申请
  - 调拨出库操作
  - 手动出库审核

### FR-002: 入库管理
**优先级**: P0
**描述**: 管理仓库入库流程

**子功能**:
- FR-002-1: 采购入库
  - 采购订单收货
  - 商品质检检查
  - 入库确认和上架

- FR-002-2: 退货入库
  - 客户退货入库
  - 供应商退货入库
  - 退货入库确认

- FR-002-3: 手动入库
  - 盘盈入库操作
  - 调拨入库操作
  - 手动入库审核

### FR-003: 库存管理
**优先级**: P0
**描述**: 管理库存数据、盘点和预警

**子功能**:
- FR-003-1: 库存查询
  - 实时库存查看
  - 批次库存查询
  - 库位库存查询

- FR-003-2: 库存盘点
  - 盘点计划创建
  - 盘点执行录入
  - 盘点差异处理

- FR-003-3: 库存预警
  - 低库存预警设置
  - 过期预警提醒
  - 预警通知推送

### FR-004: 行政管理
**优先级**: P1
**描述**: 管理仓库行政事务

**子功能**:
- FR-004-1: 卸货管理
  - 卸货计划安排
  - 卸货记录登记
  - 卸货进度跟踪

- FR-004-2: 排班管理
  - 仓管员排班设置
  - 排班考勤记录
  - 排班调整审批

- FR-004-3: 车辆管理
  - 配送车辆登记
  - 司机信息管理
  - 车辆调度安排

---

## 数据模型

### OutboundOrder (出库单)
```typescript
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
```

### InboundOrder (入库单)
```typescript
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
```

### Inventory (库存)
```typescript
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

## API 接口

**基础路径**: `/api/cloud-warehouse`

### 出库管理 API
- `GET /api/cloud-warehouse/outbound` - 出库单列表
- `GET /api/cloud-warehouse/outbound/:id` - 出库单详情
- `POST /api/cloud-warehouse/outbound` - 创建出库单
- `PUT /api/cloud-warehouse/outbound/:id/status` - 更新出库状态

### 入库管理 API
- `GET /api/cloud-warehouse/inbound` - 入库单列表
- `GET /api/cloud-warehouse/inbound/:id` - 入库单详情
- `POST /api/cloud-warehouse/inbound` - 创建入库单
- `PUT /api/cloud-warehouse/inbound/:id/status` - 更新入库状态

### 库存管理 API
- `GET /api/cloud-warehouse/inventory` - 库存查询
- `GET /api/cloud-warehouse/inventory/batch` - 批次库存
- `GET /api/cloud-warehouse/inventory/location` - 库位库存
- `POST /api/cloud-warehouse/inventory/check` - 库存盘点
- `GET /api/cloud-warehouse/inventory/warning` - 库存预警

### 行政管理 API
- `GET /api/cloud-warehouse/admin/unloading` - 卸货管理
- `POST /api/cloud-warehouse/admin/unloading` - 创建卸货计划
- `GET /api/cloud-warehouse/admin/schedule` - 排班管理
- `POST /api/cloud-warehouse/admin/schedule` - 设置排班
- `GET /api/cloud-warehouse/admin/vehicles` - 车辆列表
- `POST /api/cloud-warehouse/admin/vehicles` - 创建车辆

---

## 技术栈

| 项目 | 电脑端 | 手机端 |
|------|--------|--------|
| 框架 | Vue 3.3+ | UniApp (Vue3) |
| UI 组件 | Element Plus 2.x | uView Plus 3.x |
| 状态管理 | Pinia 1.x | Pinia 1.x |
| HTTP 客户端 | Axios 1.x | uni.request |

---

## 权限控制

### 路由权限
- `wh:outbound:view`: 查看出库
- `wh:outbound:manage`: 管理出库
- `wh:inbound:view`: 查看入库
- `wh:inbound:manage`: 管理入库
- `wh:inventory:view`: 查看库存
- `wh:inventory:check`: 库存盘点
- `wh:admin:view`: 查看行政管理
- `wh:admin:manage`: 管理行政事务

### 数据权限
- 仓管员：基础操作权限
- 仓库主管：审核和数据统计权限
- 管理员：全局数据

---

## 完成进度

| 模块 | 前端页面 | 后端API | 数据库 | 状态 |
|------|---------|---------|--------|------|
| 出库管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 入库管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 库存管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 行政管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |

**总工期**: 20天
**阶段1 核心功能开发**: 6天（未开始）
**阶段2 辅助功能开发**: 5天（未开始）
**阶段3 移动端适配**: 4天（未开始）
**阶段4 联调测试**: 5天（未开始）