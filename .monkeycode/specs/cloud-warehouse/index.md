# 云仓模块 - 需求与设计文档

**模块名称**: cloud-warehouse  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 第一部分：需求概述

### 1.1 模块介绍

云仓模块负责仓库的出入库管理、库存管理和行政管理。支持电脑端和手机端。

### 1.2 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 仓管员 | 出入库操作、库存管理 | 仓库基础功能 |
| 仓库主管 | 库存审核、数据统计 | 仓库全模块 |
| 管理员 | 全局管理 | 所有功能 |

### 1.3 子模块列表

| 子模块 | 电脑端 | 手机端 | 核心功能 |
|--------|--------|--------|----------|
| 出库管理 | ✅ | ✅ | 订单出库、退货出库、手动出库 |
| 入库管理 | ✅ | ✅ | 采购入库、退货入库、手动入库 |
| 库存管理 | ✅ | ✅ | 库存查询、盘点、预警 |
| 行政管理 | ✅ | ✅ | 卸货管理、排班、车辆 |

---

## 第二部分：功能需求

### 2.1 出库管理

#### 功能描述
管理仓库出库操作。

#### 核心功能
1. **订单出库**
   - 待出库订单列表
   - 拣货任务
   - 出库扫描
   - 出库确认

2. **退货出库**
   - 退货出库单
   - 退供应商商品
   - 出库确认

3. **手动出库**
   - 手动创建出库单
   - 选择商品
   - 出库原因

4. **出库单**
   - 出库单列表
   - 出库单详情
   - 导出

---

### 2.2 入库管理

#### 功能描述
管理仓库入库操作。

#### 核心功能
1. **采购入库**
   - 待入库采购单
   - 入库扫描
   - 质检
   - 入库确认

2. **退货入库**
   - 客户退货入库
   - 入库质检
   - 入库上架

3. **手动入库**
   - 手动创建入库单
   - 入库原因

4. **入库单**
   - 入库单列表
   - 入库单详情

---

### 2.3 库存管理

#### 功能描述
管理仓库库存。

#### 核心功能
1. **库存查询**
   - 库存列表
   - 商品搜索
   - 库位筛选
   - 库存详情

2. **盘点**
   - 盘点任务
   - 盘点单创建
   - 盘点结果
   - 盘盈盘亏

3. **库存预警**
   - 低库存预警
   - 预警商品列表
   - 补货建议

4. **库存呆滞预警**
   - 呆滞商品识别
   - 呆滞时长统计
   - 处理建议

5. **库位管理**
   - 库位列表
   - 库位创建/编辑
   - 库位商品

---

### 2.4 行政管理

#### 功能描述
仓库行政管理。

#### 核心功能
1. **卸货管理**
   - 到货登记
   - 卸货安排
   - 卸货记录

2. **排班**
   - 仓库人员排班
   - 排班表

3. **请假**
   - 请假申请
   - 请假记录

4. **车辆管理**
   - 车辆信息
   - 车辆使用记录
   - 车辆维护

---

## 第三部分：数据模型

### 3.1 出库单

```typescript
interface OutOrder {
  id: string;
  orderNo: string;
  type: 'order' | 'return' | 'manual';       // 订单出库/退货出库/手动出库
  sourceId?: string;                          // 关联订单号/退货单号
  warehouseId: string;
  status: 'pending' | 'picking' | 'confirmed' | 'completed' | 'cancelled';
  operatorId: string;
  operatorName: string;
  items: OutOrderItem[];
  reason?: string;                            // 手动出库原因
  remark?: string;
  createdAt: string;
  confirmedAt?: string;
}

interface OutOrderItem {
  sku: string;
  productName: string;
  quantity: number;
  locationId?: string;
}
```

### 3.2 入库单

```typescript
interface InOrder {
  id: string;
  orderNo: string;
  type: 'purchase' | 'return' | 'manual';     // 采购入库/退货入库/手动入库
  sourceId?: string;                          // 关联采购单号/退货单号
  supplierId?: string;
  supplierName?: string;
  warehouseId: string;
  status: 'pending' | 'inspecting' | 'shelved' | 'completed' | 'cancelled';
  operatorId: string;
  operatorName: string;
  items: InOrderItem[];
  remark?: string;
  createdAt: string;
  confirmedAt?: string;
}

interface InOrderItem {
  sku: string;
  productName: string;
  expectedQty: number;
  actualQty: number;
  qualityStatus: 'pass' | 'fail' | 'partial';
  locationId?: string;
}
```

### 3.3 库存

```typescript
interface Inventory {
  id: string;
  sku: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  locationId: string;
  locationName: string;
  quantity: number;
  lockedQty: number;                          // 锁定数量（待出库）
  availableQty: number;                       // 可用数量
  warningQty: number;                         // 预警阈值
  staleDays: number;                          // 呆滞天数
  lastInDate?: string;
  lastOutDate?: string;
}
```

### 3.4 盘点单

```typescript
interface Stocktake {
  id: string;
  orderNo: string;
  warehouseId: string;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  creatorId: string;
  creatorName: string;
  items: StocktakeItem[];
  totalDiff: number;                          // 总差异
  remark?: string;
  createdAt: string;
  completedAt?: string;
}

interface StocktakeItem {
  sku: string;
  productName: string;
  locationId: string;
  systemQty: number;                          // 系统数量
  actualQty: number;                          // 实际数量
  diff: number;                               // 差异
  diffType: 'surplus' | 'loss' | 'match';     // 盘盈/盘亏/一致
}
```

### 3.5 库位

```typescript
interface Location {
  id: string;
  warehouseId: string;
  warehouseName: string;
  code: string;                               // 库位编码，如 A-01-02
  zone: string;                               // 区域
  type: 'normal' | 'cold' | 'hazardous';      // 常温/冷藏/危险品
  capacity: number;                           // 容量
  usedCapacity: number;
  status: 'active' | 'disabled';
}
```

### 3.6 卸货任务

```typescript
interface UnloadTask {
  id: string;
  vehiclePlate: string;
  driverName: string;
  driverPhone: string;
  relatedOrderId?: string;
  warehouseId: string;
  status: 'registered' | 'unloading' | 'completed';
  assigneeId?: string;
  assigneeName?: string;
  arrivalTime: string;
  startTime?: string;
  endTime?: string;
  remark?: string;
}
```

### 3.7 排班

```typescript
interface Schedule {
  id: string;
  warehouseId: string;
  staffId: string;
  staffName: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';   // 早班/中班/晚班
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
}
```

### 3.8 车辆

```typescript
interface Vehicle {
  id: string;
  plate: string;
  type: 'truck' | 'van' | 'forklift';         // 货车/厢式车/叉车
  capacity: number;                           // 载重（吨）
  status: 'available' | 'in_use' | 'maintenance';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  usageRecords: VehicleUsage[];
}

interface VehicleUsage {
  id: string;
  vehicleId: string;
  operatorId: string;
  operatorName: string;
  purpose: string;
  startTime: string;
  endTime?: string;
  mileage?: number;
}
```

---

## 第四部分：API 接口设计

```typescript
// 基础路径：/api/v1/warehouse

// 出库
GET  /api/v1/warehouse/out-orders                     // 出库单列表
POST /api/v1/warehouse/out-orders                     // 创建出库单
PUT  /api/v1/warehouse/out-orders/:id/confirm         // 确认出库

// 入库
GET  /api/v1/warehouse/in-orders                      // 入库单列表
POST /api/v1/warehouse/in-orders                      // 创建入库单
PUT  /api/v1/warehouse/in-orders/:id/confirm          // 确认入库

// 库存
GET  /api/v1/warehouse/inventory                      // 库存列表
GET  /api/v1/warehouse/inventory/:sku                 // 商品库存
GET  /api/v1/warehouse/inventory/warning              // 库存预警

// 盘点
GET  /api/v1/warehouse/stocktake                      // 盘点单列表
POST /api/v1/warehouse/stocktake                      // 创建盘点单
PUT  /api/v1/warehouse/stocktake/:id/confirm          // 确认盘点

// 库位
GET  /api/v1/warehouse/locations                      // 库位列表
POST /api/v1/warehouse/locations                      // 创建库位

// 行政
GET  /api/v1/warehouse/unload-tasks                   // 卸货任务
GET  /api/v1/warehouse/schedules                      // 排班表
GET  /api/v1/warehouse/vehicles                       // 车辆列表
```

---

## 第五部分：前端设计

### 5.1 目录结构

```
src/
├── views/
│   └── warehouse/
│       ├── out-orders/
│       │   ├── List.vue
│       │   └── Confirm.vue
│       ├── in-orders/
│       │   ├── List.vue
│       │   └── Confirm.vue
│       ├── inventory/
│       │   ├── List.vue
│       │   └── Detail.vue
│       ├── stocktake/
│       │   ├── List.vue
│       │   └── Create.vue
│       ├── locations/
│       │   └── List.vue
│       └── admin/
│           ├── unload.vue
│           ├── schedule.vue
│           └── vehicles.vue
├── stores/
│   └── warehouse.js
├── api/
│   └── warehouse.js
└── mock/
    └── warehouse.js
```

---

## 第六部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 出库管理 | 4 天 |
| 2 | 入库管理 | 4 天 |
| 3 | 库存管理 | 4 天 |
| 4 | 行政管理 | 2 天 |
| 5 | 联调测试 | 3 天 |
| **总计** | | **17 天** |
