# 直配模块 - 需求与设计文档

**模块名称**: direct-delivery  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 第一部分：需求概述

### 1.1 模块介绍

直配模块负责配送线路管理和配送流程管理。仅支持手机端（UniApp）。

### 1.2 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 配送员 | 配送执行、线路管理 | 配送基础功能 |
| 配送主管 | 线路分配、数据统计 | 配送全模块 |
| 管理员 | 全局管理 | 所有功能 |

### 1.3 子模块列表

| 子模块 | 手机端 | 核心功能 |
|--------|--------|----------|
| 地图 | ✅ | 我的地图、全员地图 |
| 配送 | ✅ | 线路管理、配送全流程 |
| 行政 | ✅ | 排班、请假 |

---

## 第二部分：功能需求

### 2.1 地图

#### 功能描述
配送地图展示。

#### 核心功能
1. **我的地图**
   - 显示我的配送线路
   - 客户位置标记
   - 配送路线

2. **全员地图**
   - 所有配送员位置
   - 实时定位
   - 配送轨迹

---

### 2.2 配送

#### 功能描述
配送流程管理。

#### 功能流程
```
待领取线路 → 待分拣线路 → 按线路核对出库 → 待装车线路 → 
发车 → 配送中 → 配送完成 → 退货交接 → 收车
```

#### 核心功能
1. **待领取线路**
   - 可领取线路列表
   - 线路详情
   - 领取线路

2. **待分拣线路**
   - 待分拣商品
   - 分拣扫描
   - 分拣确认

3. **按线路核对出库**
   - 出库商品核对
   - 出库确认

4. **待装车线路**
   - 装车确认
   - 装车完成

5. **发车**
   - 发车打卡
   - 发车时间记录

6. **配送完成**
   - 配送完成确认
   - 签收

7. **退货交接**
   - 退货商品
   - 退货交接

8. **收车**
   - 收车打卡
   - 收车确认

9. **配送线路记录**
   - 历史配送记录
   - 配送统计

---

### 2.3 行政

#### 功能描述
配送行政事务。

#### 核心功能
1. **排班**
   - 排班表
   - 我的排班

2. **请假**
   - 请假申请
   - 请假记录

---

## 第三部分：数据模型

### 3.1 配送线路

```typescript
interface DeliveryRoute {
  id: string;
  routeNo: string;
  name: string;
  region: string;
  driverId?: string;
  driverName?: string;
  status: 'unclaimed' | 'claimed' | 'sorting' | 'loading' | 'departed' | 'delivering' | 'completed' | 'returned';
  stops: DeliveryStop[];
  totalQty: number;
  totalWeight: number;
  plannedDepartTime?: string;
  actualDepartTime?: string;
  plannedReturnTime?: string;
  actualReturnTime?: string;
  createdAt: string;
}
```

### 3.2 配送站点

```typescript
interface DeliveryStop {
  id: string;
  routeId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  latitude: number;
  longitude: number;
  orderCount: number;
  totalAmount: number;
  status: 'pending' | 'delivered' | 'partial' | 'failed';
  returnQty: number;                              // 退货数量
  signature?: string;                             // 签收图片
  remark?: string;
  deliveredAt?: string;
}
```

### 3.3 配送记录

```typescript
interface DeliveryRecord {
  id: string;
  routeId: string;
  routeNo: string;
  driverId: string;
  driverName: string;
  status: 'completed' | 'partial' | 'failed';
  totalStops: number;
  deliveredStops: number;
  totalAmount: number;
  returnAmount: number;
  startAt: string;
  endAt: string;
  events: DeliveryEvent[];
}

interface DeliveryEvent {
  id: string;
  type: 'claim' | 'sort' | 'checkout' | 'load' | 'depart' | 'deliver' | 'return' | 'finish';
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  remark?: string;
}
```

### 3.4 排班

```typescript
interface DeliverySchedule {
  id: string;
  driverId: string;
  driverName: string;
  date: string;
  shift: 'morning' | 'afternoon';
  status: 'scheduled' | 'confirmed' | 'cancelled';
  routeId?: string;
}
```

### 3.5 请假

```typescript
interface DeliveryLeave {
  id: string;
  driverId: string;
  driverName: string;
  type: 'sick' | 'personal' | 'annual' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approverId?: string;
  approverName?: string;
  createdAt: string;
}
```

---

## 第四部分：API 接口设计

```typescript
// 基础路径：/api/delivery

// 线路
GET  /api/delivery/routes                          // 线路列表
GET  /api/delivery/routes/:id                      // 线路详情
POST /api/delivery/routes/:id/claim                // 领取线路

// 配送
POST /api/delivery/deliveries/sort                 // 分拣确认
POST /api/delivery/deliveries/checkout             // 出库核对
POST /api/delivery/deliveries/load                 // 装车确认
POST /api/delivery/deliveries/depart               // 发车
POST /api/delivery/deliveries/complete             // 配送完成
POST /api/delivery/deliveries/return               // 退货交接
POST /api/delivery/deliveries/finish               // 收车

// 记录
GET  /api/delivery/records                         // 配送记录

// 行政
GET  /api/delivery/schedules                      // 排班表
POST /api/delivery/leaves                         // 请假申请
```

---

## 第五部分：前端设计

### 5.1 目录结构

```
src/
├── pages/
│   └── delivery/
│       ├── map/                      # 地图
│       │   └── index.vue
│       ├── routes/                   # 线路
│       │   ├── list.vue
│       │   └── detail.vue
│       ├── sorting/                  # 分拣
│       │   └── index.vue
│       ├── checkout/                 # 出库核对
│       │   └── index.vue
│       ├── loading/                  # 装车
│       │   └── index.vue
│       ├── deliver/                  # 配送
│       │   └── index.vue
│       └── admin/                    # 行政
│           ├── schedule.vue
│           └── leave.vue
├── stores/
│   └── delivery.js
├── api/
│   └── delivery.js
└── mock/
    └── delivery.js
```

---

## 第六部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 地图 | 3 天 |
| 2 | 配送流程 | 6 天 |
| 3 | 行政 | 2 天 |
| 4 | 联调测试 | 3 天 |
| **总计** | | **14 天** |
