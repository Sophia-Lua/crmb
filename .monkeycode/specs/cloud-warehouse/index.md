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
// 基础路径：/api/warehouse

// 出库
GET  /api/warehouse/out-orders                     // 出库单列表
POST /api/warehouse/out-orders                     // 创建出库单
PUT  /api/warehouse/out-orders/:id/confirm         // 确认出库

// 入库
GET  /api/warehouse/in-orders                      // 入库单列表
POST /api/warehouse/in-orders                      // 创建入库单
PUT  /api/warehouse/in-orders/:id/confirm          // 确认入库

// 库存
GET  /api/warehouse/inventory                      // 库存列表
GET  /api/warehouse/inventory/:sku                 // 商品库存
GET  /api/warehouse/inventory/warning              // 库存预警

// 盘点
GET  /api/warehouse/stocktake                      // 盘点单列表
POST /api/warehouse/stocktake                      // 创建盘点单
PUT  /api/warehouse/stocktake/:id/confirm          // 确认盘点

// 库位
GET  /api/warehouse/locations                      // 库位列表
POST /api/warehouse/locations                      // 创建库位

// 行政
GET  /api/warehouse/unload-tasks                   // 卸货任务
GET  /api/warehouse/schedules                      // 排班表
GET  /api/warehouse/vehicles                       // 车辆列表
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

### 5.2 API 封装

```javascript
// src/api/warehouse.js
import request from '@/utils/request';

// 出库管理
export function getOutOrders(params) {
  return request({ url: '/api/warehouse/out-orders', method: 'GET', params });
}

export function createOutOrder(data) {
  return request({ url: '/api/warehouse/out-orders', method: 'POST', data });
}

export function confirmOutOrder(id, data) {
  return request({ url: `/api/warehouse/out-orders/${id}/confirm`, method: 'PUT', data });
}

// 入库管理
export function getInOrders(params) {
  return request({ url: '/api/warehouse/in-orders', method: 'GET', params });
}

export function createInOrder(data) {
  return request({ url: '/api/warehouse/in-orders', method: 'POST', data });
}

export function confirmInOrder(id, data) {
  return request({ url: `/api/warehouse/in-orders/${id}/confirm`, method: 'PUT', data });
}

// 库存管理
export function getInventory(params) {
  return request({ url: '/api/warehouse/inventory', method: 'GET', params });
}

export function getInventoryBySku(sku) {
  return request({ url: `/api/warehouse/inventory/${sku}`, method: 'GET' });
}

export function getInventoryWarning(params) {
  return request({ url: '/api/warehouse/inventory/warning', method: 'GET', params });
}

// 盘点管理
export function getStocktakeList(params) {
  return request({ url: '/api/warehouse/stocktake', method: 'GET', params });
}

export function createStocktake(data) {
  return request({ url: '/api/warehouse/stocktake', method: 'POST', data });
}

export function confirmStocktake(id, data) {
  return request({ url: `/api/warehouse/stocktake/${id}/confirm`, method: 'PUT', data });
}

// 库位管理
export function getLocations(params) {
  return request({ url: '/api/warehouse/locations', method: 'GET', params });
}

export function createLocation(data) {
  return request({ url: '/api/warehouse/locations', method: 'POST', data });
}

// 行政管理
export function getUnloadTasks(params) {
  return request({ url: '/api/warehouse/unload-tasks', method: 'GET', params });
}

export function getSchedules(params) {
  return request({ url: '/api/warehouse/schedules', method: 'GET', params });
}

export function getVehicles(params) {
  return request({ url: '/api/warehouse/vehicles', method: 'GET', params });
}
```

### 5.3 后端Go实现

#### 目录结构
```
internal/
├── handler/
│   └── warehouse/
│       ├── out_order_handler.go
│       ├── in_order_handler.go
│       ├── inventory_handler.go
│       ├── stocktake_handler.go
│       ├── location_handler.go
│       └── admin_handler.go
├── service/
│   └── warehouse/
│       ├── out_order_service.go
│       ├── in_order_service.go
│       ├── inventory_service.go
│       ├── stocktake_service.go
│       ├── location_service.go
│       └── admin_service.go
├── model/
│   └── warehouse/
│       ├── out_order.go
│       ├── in_order.go
│       ├── inventory.go
│       ├── stocktake.go
│       ├── location.go
│       └── admin.go
└── dto/
    └── warehouse/
        ├── out_order_dto.go
        ├── in_order_dto.go
        ├── inventory_dto.go
        ├── stocktake_dto.go
        ├── location_dto.go
        └── admin_dto.go
```

#### 核心Handler示例
```go
// internal/handler/warehouse/out_order_handler.go
package warehouse

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "your-project/internal/service/warehouse"
    "your-project/internal/dto/warehouse"
)

type OutOrderHandler struct {
    outOrderService *warehouse.OutOrderService
}

func NewOutOrderHandler(outOrderService *warehouse.OutOrderService) *OutOrderHandler {
    return &OutOrderHandler{
        outOrderService: outOrderService,
    }
}

// GetOutOrders 获取出库单列表
func (h *OutOrderHandler) GetOutOrders(c *gin.Context) {
    var req warehouse.GetOutOrdersRequest
    if err := c.ShouldBindQuery(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    outOrders, total, err := h.outOrderService.GetOutOrders(c.Request.Context(), &req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "code": 200,
        "message": "success",
        "data": gin.H{
            "list": outOrders,
            "total": total,
            "page": req.Page,
            "pageSize": req.PageSize,
        },
    })
}

// CreateOutOrder 创建出库单
func (h *OutOrderHandler) CreateOutOrder(c *gin.Context) {
    var req warehouse.CreateOutOrderRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    outOrder, err := h.outOrderService.CreateOutOrder(c.Request.Context(), &req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "code": 200,
        "message": "success",
        "data": outOrder,
    })
}

// ConfirmOutOrder 确认出库
func (h *OutOrderHandler) ConfirmOutOrder(c *gin.Context) {
    id := c.Param("id")
    var req warehouse.ConfirmOutOrderRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    err := h.outOrderService.ConfirmOutOrder(c.Request.Context(), id, &req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "code": 200,
        "message": "success",
    })
}
```

#### Service层示例
```go
// internal/service/warehouse/out_order_service.go
package warehouse

import (
    "context"
    "your-project/internal/model/warehouse"
    "your-project/internal/repository"
    "your-project/pkg/transaction"
)

type OutOrderService struct {
    outOrderRepo repository.OutOrderRepository
    txManager    transaction.Manager
}

func NewOutOrderService(outOrderRepo repository.OutOrderRepository, txManager transaction.Manager) *OutOrderService {
    return &OutOrderService{
        outOrderRepo: outOrderRepo,
        txManager:    txManager,
    }
}

func (s *OutOrderService) GetOutOrders(ctx context.Context, req *GetOutOrdersRequest) ([]*warehouse.OutOrder, int64, error) {
    outOrders, total, err := s.outOrderRepo.FindByConditions(ctx, req.ToQueryConditions())
    if err != nil {
        return nil, 0, err
    }
    
    return outOrders, total, nil
}

func (s *OutOrderService) CreateOutOrder(ctx context.Context, req *CreateOutOrderRequest) (*warehouse.OutOrder, error) {
    if err := req.Validate(); err != nil {
        return nil, err
    }
    
    // 开启事务
    txCtx, cancel := s.txManager.Begin(ctx)
    defer cancel()
    
    outOrder := &warehouse.OutOrder{
        OrderNo:     s.generateOrderNo(),
        Type:        req.Type,
        SourceID:    req.SourceID,
        WarehouseID: req.WarehouseID,
        Status:      "pending",
        OperatorID:  req.OperatorID,
        OperatorName: req.OperatorName,
        Items:       req.Items,
        Reason:      req.Reason,
        Remark:      req.Remark,
    }
    
    err := s.outOrderRepo.Create(txCtx, outOrder)
    if err != nil {
        s.txManager.Rollback(txCtx)
        return nil, err
    }
    
    // 提交事务
    if err := s.txManager.Commit(txCtx); err != nil {
        return nil, err
    }
    
    return outOrder, nil
}

func (s *OutOrderService) ConfirmOutOrder(ctx context.Context, id string, req *ConfirmOutOrderRequest) error {
    // 开启事务
    txCtx, cancel := s.txManager.Begin(ctx)
    defer cancel()
    
    // 获取出库单
    outOrder, err := s.outOrderRepo.FindByID(txCtx, id)
    if err != nil {
        return err
    }
    
    if outOrder.Status != "pending" && outOrder.Status != "picking" {
        return errors.New("出库单状态不允许确认")
    }
    
    // 更新出库单状态
    outOrder.Status = "confirmed"
    outOrder.ConfirmedAt = time.Now()
    
    err = s.outOrderRepo.Update(txCtx, outOrder)
    if err != nil {
        s.txManager.Rollback(txCtx)
        return err
    }
    
    // 扣减库存
    err = s.deductInventory(txCtx, outOrder.Items)
    if err != nil {
        s.txManager.Rollback(txCtx)
        return err
    }
    
    // 提交事务
    if err := s.txManager.Commit(txCtx); err != nil {
        return err
    }
    
    return nil
}

func (s *OutOrderService) deductInventory(ctx context.Context, items []warehouse.OutOrderItem) error {
    // 扣减库存的业务逻辑
    for _, item := range items {
        // 更新库存数量
        err := s.inventoryRepo.DeductQuantity(ctx, item.Sku, item.Quantity)
        if err != nil {
            return err
        }
    }
    return nil
}

func (s *OutOrderService) generateOrderNo() string {
    return "OUT" + time.Now().Format("20060102") + strconv.Itoa(rand.Intn(10000))
}
```

---

## 第六部分：Mock 数据方案

### 6.1 Mock 配置

```javascript
// src/mock/warehouse.js
import Mock from 'mockjs';

// 出库单 Mock
Mock.mock(/\/api\/warehouse\/out-orders(\?.*)?$/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(params.get('page')) || 1;
  const pageSize = parseInt(params.get('pageSize')) || 20;
  
  const outOrders = Mock.mock({
    'list|50': [{
      'id|+1': 1,
      'orderNo': '@string("OUT", 8)',
      'type|1': ['order', 'return', 'manual'],
      'warehouseId|1-5': 1,
      'status|1': ['pending', 'picking', 'confirmed', 'completed', 'cancelled'],
      'operatorId|1-20': 1,
      'operatorName': '@cname',
      'items|1-10': [{
        'sku': '@string("SKU", 8)',
        'productName': '@ctitle(5,10)',
        'quantity|1-100': 1,
        'locationId': '@string("LOC", 6)'
      }],
      'createdAt': '@datetime'
    }]
  });
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: outOrders.list.slice(start, end),
      total: outOrders.list.length,
      page,
      pageSize
    }
  };
});

// 库存数据 Mock
Mock.mock(/\/api\/warehouse\/inventory(\?.*)?$/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(params.get('page')) || 1;
  const pageSize = parseInt(params.get('pageSize')) || 20;
  
  const inventory = Mock.mock({
    'list|100': [{
      'id|+1': 1,
      'sku': '@string("SKU", 8)',
      'productName': '@ctitle(5,10)',
      'warehouseId|1-5': 1,
      'warehouseName': '@ctitle(2,4)仓库',
      'locationId': '@string("LOC", 6)',
      'locationName': '@string("A", 3)-@integer(1,10)-@integer(1,10)',
      'quantity|0-1000': 1,
      'lockedQty|0-100': 1,
      'availableQty': function() {
        return this.quantity - this.lockedQty;
      },
      'warningQty|10-50': 1,
      'staleDays|0-365': 1,
      'lastInDate': '@date',
      'lastOutDate': '@date'
    }]
  });
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: inventory.list.slice(start, end),
      total: inventory.list.length,
      page,
      pageSize
    }
  };
});
```

---

## 第七部分：权限控制

### 7.1 路由权限

```javascript
// src/router/permission.js
const routePermissions = {
  'warehouse:out-orders:view': ['/warehouse/out-orders', '/warehouse/out-orders/:id'],
  'warehouse:out-orders:create': ['/warehouse/out-orders/create'],
  'warehouse:out-orders:confirm': ['/warehouse/out-orders/:id/confirm'],
  'warehouse:in-orders:view': ['/warehouse/in-orders', '/warehouse/in-orders/:id'],
  'warehouse:in-orders:create': ['/warehouse/in-orders/create'],
  'warehouse:in-orders:confirm': ['/warehouse/in-orders/:id/confirm'],
  'warehouse:inventory:view': ['/warehouse/inventory'],
  'warehouse:stocktake:view': ['/warehouse/stocktake', '/warehouse/stocktake/:id'],
  'warehouse:stocktake:create': ['/warehouse/stocktake/create'],
  'warehouse:locations:view': ['/warehouse/locations'],
  'warehouse:locations:create': ['/warehouse/locations/create'],
  'warehouse:admin:view': ['/warehouse/admin']
};

router.beforeEach((to, from, next) => {
  const userPermissions = getUserPermissions();
  const requiredPermission = getRoutePermission(to.path);
  
  if (requiredPermission && !userPermissions.includes(requiredPermission)) {
    next('/403');
  } else {
    next();
  }
});
```

### 7.2 按钮权限

```vue
<template>
  <!-- 出库管理 -->
  <el-button
    v-permission="'warehouse:out-orders:create'"
    type="primary"
    @click="handleCreateOutOrder"
  >
    创建出库单
  </el-button>
  
  <el-button
    v-permission="'warehouse:out-orders:confirm'"
    @click="handleConfirmOutOrder"
  >
    确认出库
  </el-button>
  
  <!-- 库存管理 -->
  <el-button
    v-permission="'warehouse:stocktake:create'"
    @click="handleCreateStocktake"
  >
    创建盘点单
  </el-button>
</template>
```

### 7.3 数据权限

- **仓管员**: 只能操作自己负责的仓库
- **仓库主管**: 可以管理本仓库所有数据
- **管理员**: 拥有全部仓库权限

---

## 第八部分：注意事项

### 8.1 开发规范

1. **代码风格**: 遵循 ESLint + Prettier 配置
2. **组件命名**: 使用 PascalCase 命名组件
3. **注释规范**: 关键逻辑必须添加中文注释
4. **错误处理**: 所有 API 调用必须捕获错误

### 8.2 性能优化

1. **列表虚拟化**: 大数据量库存列表使用虚拟滚动
2. **图片懒加载**: 商品图片使用懒加载
3. **接口防抖**: 库存搜索输入防抖 500ms
4. **数据缓存**: 库存数据缓存 1 分钟（实时性要求高）

### 8.3 安全控制

1. **XSS 防护**: 商品名称等文本内容必须过滤
2. **CSRF 防护**: API 请求携带 CSRF token
3. **数据脱敏**: 敏感信息前端脱敏显示
4. **权限验证**: 严格的仓库数据权限控制

### 8.4 移动端适配

1. **UniApp兼容**: 仓管员移动端操作界面
2. **扫码功能**: 支持商品条码扫描
3. **离线支持**: 关键操作支持离线模式
4. **性能优化**: 移动端简化复杂操作流程

---

## 第九部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 出库管理 | 4 天 |
| 2 | 入库管理 | 4 天 |
| 3 | 库存管理 | 4 天 |
| 4 | 行政管理 | 2 天 |
| 5 | 权限控制 | 1 天 |
| 6 | 移动端适配 | 2 天 |
| 7 | Go后端开发 | 6 天 |
| 8 | 联调测试 | 3 天 |
| **总计** | | **26 天** |
