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

### 出库管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-CW-001 | 作为一名仓管员 | 我希望能够查看待出库订单列表 | 以便及时了解需要出库的订单 |
| REQ-CW-002 | 作为一名仓管员 | 我希望能够接收拣货任务 | 以便按照任务指引完成拣货工作 |
| REQ-CW-003 | 作为一名仓管员 | 我希望能够扫描出库商品进行确认 | 以便确保出库商品与订单一致 |
| REQ-CW-004 | 作为一名仓管员 | 我希望能够确认出库完成 | 以便完成出库流程并发送通知 |
| REQ-CW-005 | 作为一名仓管员 | 我希望能够创建退货出库单 | 以便将退回商品退还给供应商 |
| REQ-CW-006 | 作为一名仓管员 | 我希望能够执行退供应商商品出库 | 以便完成供应商退货流程 |
| REQ-CW-007 | 作为一名仓管员 | 我希望能够确认退货出库 | 以便完成退货出库操作 |
| REQ-CW-008 | 作为一名仓管员 | 我希望能够提交紧急出库申请 | 以便处理紧急出库需求 |
| REQ-CW-009 | 作为一名仓管员 | 我希望能够执行调拨出库操作 | 以便完成仓库间的商品调拨 |
| REQ-CW-010 | 作为一名仓库主管 | 我希望能够审核手动出库申请 | 以便确保手动出库操作合规 |

### 入库管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-CW-011 | 作为一名仓管员 | 我希望能够接收采购订单并收货 | 以便确认采购商品的到货情况 |
| REQ-CW-012 | 作为一名仓管员 | 我希望能够对入库商品进行质检检查 | 以便确保入库商品质量达标 |
| REQ-CW-013 | 作为一名仓管员 | 我希望能够确认入库并上架 | 以便完成入库流程并将商品放置到库位 |
| REQ-CW-014 | 作为一名仓管员 | 我希望能够办理客户退货入库 | 以便将客户退回商品重新入库 |
| REQ-CW-015 | 作为一名仓管员 | 我希望能够办理供应商退货入库 | 以便将退回供应商的商品重新入库 |
| REQ-CW-016 | 作为一名仓管员 | 我希望能够确认退货入库 | 以便完成退货入库流程 |
| REQ-CW-017 | 作为一名仓管员 | 我希望能够执行盘盈入库操作 | 以便将盘点多出的商品入库 |
| REQ-CW-018 | 作为一名仓管员 | 我希望能够执行调拨入库操作 | 以便接收从其他仓库调拨的商品 |
| REQ-CW-019 | 作为一名仓库主管 | 我希望能够审核手动入库申请 | 以便确保手动入库操作合规 |

### 库存管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-CW-020 | 作为一名仓管员 | 我希望能够查看实时库存数据 | 以便了解当前仓库库存状况 |
| REQ-CW-021 | 作为一名仓管员 | 我希望能够查询批次库存 | 以便按批次追踪商品库存 |
| REQ-CW-022 | 作为一名仓管员 | 我希望能够查询库位库存 | 以便了解各库位的商品分布 |
| REQ-CW-023 | 作为一名仓库主管 | 我希望能够创建盘点计划 | 以便安排库存盘点工作 |
| REQ-CW-024 | 作为一名仓管员 | 我希望能够录入盘点执行数据 | 以便记录实际盘点结果 |
| REQ-CW-025 | 作为一名仓库主管 | 我希望能够处理盘点差异 | 以便调整库存数据与实际一致 |
| REQ-CW-026 | 作为一名仓库主管 | 我希望能够设置低库存预警 | 以便及时补充低库存商品 |
| REQ-CW-027 | 作为一名仓管员 | 我希望能够接收过期预警提醒 | 以便及时处理过期商品 |
| REQ-CW-028 | 作为一名仓管员 | 我希望能够接收预警通知推送 | 以便第一时间响应库存预警 |

### 行政管理需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-CW-029 | 作为一名仓库主管 | 我希望能够安排卸货计划 | 以便合理调度卸货资源 |
| REQ-CW-030 | 作为一名仓管员 | 我希望能够登记卸货记录 | 以便跟踪卸货完成情况 |
| REQ-CW-031 | 作为一名仓库主管 | 我希望能够跟踪卸货进度 | 以便监控卸货任务执行 |
| REQ-CW-032 | 作为一名仓库主管 | 我希望能够设置仓管员排班 | 以便合理分配人员工作时间 |
| REQ-CW-033 | 作为一名仓管员 | 我希望能够查看排班考勤记录 | 以便确认出勤情况 |
| REQ-CW-034 | 作为一名仓库主管 | 我希望能够审批排班调整 | 以便合理处理排班变更需求 |
| REQ-CW-035 | 作为一名仓库主管 | 我希望能够登记配送车辆 | 以便管理配送车辆信息 |
| REQ-CW-036 | 作为一名仓库主管 | 我希望能够管理司机信息 | 以便掌握司机资质和状态 |
| REQ-CW-037 | 作为一名仓库主管 | 我希望能够安排车辆调度 | 以便合理调配配送车辆 |

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