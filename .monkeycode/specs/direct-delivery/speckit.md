# 直配模块 - Speckit 需求规格

## 模块信息
- **模块名称**: direct-delivery
- **模块介绍**: 直配模块负责线路管理、配送管理和轨迹跟踪。仅支持手机端。
- **支持平台**: 手机端 UniApp
- **总工期**: 20天
- **版本**: v1.0
- **更新日期**: 2026-05-09

---

## 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 配送员 | 配送任务、轨迹上报 | 配送相关功能 |
| 物流主管 | 线路管理、调度管理 | 物流全模块 |
| 管理员 | 全局管理 | 所有功能 |

---

## 子模块清单

| 子模块 | 手机端 | 核心功能 | 状态 |
|--------|--------|----------|------|
| 线路管理 | ✅ | 配送线路、站点管理 | 未开始 |
| 配送管理 | ✅ | 配送任务、状态跟踪 | 未开始 |
| 轨迹跟踪 | ✅ | 实时轨迹、历史轨迹 | 未开始 |

---

## 功能需求

### FR-001: 线路管理
**优先级**: P0
**描述**: 管理配送线路和站点

**子功能**:
- FR-001-1: 配送线路规划
  - 线路创建和编辑
  - 线路站点排序
  - 线路优化算法

- FR-001-2: 站点管理
  - 站点信息维护
  - 站点顺序调整
  - 站点状态管理

- FR-001-3: 线路调整
  - 线路状态切换（启用/停用）
  - 线路分配配送员
  - 线路分配车辆

### FR-002: 配送管理
**优先级**: P0
**描述**: 管理配送任务分配和状态跟踪

**子功能**:
- FR-002-1: 配送任务分配
  - 任务自动分配
  - 手动调整分配
  - 任务优先级设置

- FR-002-2: 配送状态跟踪
  - 实时状态更新
  - 状态变更记录
  - 配送进度展示

- FR-002-3: 异常配送处理
  - 异常类型标记
  - 异常上报流程
  - 异常处理方案

- FR-002-4: 配送完成确认
  - 签收确认
  - 拍照上传
  - 客户评价

### FR-003: 轨迹跟踪
**优先级**: P0
**描述**: 实时和历史轨迹跟踪

**子功能**:
- FR-003-1: 实时位置跟踪
  - GPS实时定位
  - 位置定时上报
  - 当前状态展示

- FR-003-2: 历史轨迹回放
  - 轨迹数据查询
  - 轨迹路线回放
  - 关键节点标注

- FR-003-3: 配送时效分析
  - 配送时长统计
  - 线路效率分析
  - 时效达标率

- FR-003-4: 轨迹异常预警
  - 偏离线路预警
  - 超时预警
  - 异常停留预警

---

## 数据模型

### DeliveryRoute (配送线路)
```typescript
interface DeliveryRoute {
  id: string;
  name: string;
  driverId: string;
  vehicleId: string;
  stations: RouteStation[];
  status: 'active' | 'inactive';
}
```

### DeliveryTask (配送任务)
```typescript
interface DeliveryTask {
  id: string;
  taskId: string;
  orderId: string;
  routeId: string;
  stationIndex: number;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed';
  estimatedTime: string;
  actualTime?: string;
}
```

### TrackPoint (轨迹点)
```typescript
interface TrackPoint {
  taskId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number;
}
```

---

## API 接口

**基础路径**: `/api/direct-delivery`

### 线路管理 API
- `GET /api/direct-delivery/routes` - 配送线路列表
- `POST /api/direct-delivery/routes` - 创建配送线路
- `GET /api/direct-delivery/routes/:id` - 线路详情
- `PUT /api/direct-delivery/routes/:id` - 更新线路
- `DELETE /api/direct-delivery/routes/:id` - 删除线路

### 配送任务 API
- `GET /api/direct-delivery/tasks` - 配送任务列表
- `POST /api/direct-delivery/tasks/assign` - 分配配送任务
- `PUT /api/direct-delivery/tasks/:id/status` - 更新配送状态
- `GET /api/direct-delivery/tasks/:id/detail` - 任务详情

### 轨迹跟踪 API
- `GET /api/direct-delivery/tracks/:taskId` - 获取轨迹数据
- `POST /api/direct-delivery/tracks/report` - 上报轨迹点
- `GET /api/direct-delivery/tracks/history` - 历史轨迹查询

---

## 技术栈

| 项目 | 手机端 |
|------|--------|
| 框架 | UniApp (Vue3) |
| UI 组件 | uView Plus 3.x |
| 状态管理 | Pinia 1.x |
| HTTP 客户端 | uni.request |
| 地图服务 | 高德地图 UniApp SDK |
| GPS | uni.getLocation |

---

## 权限控制

### 路由权限
- `delivery:routes:view`: 查看配送线路
- `delivery:routes:manage`: 管理配送线路
- `delivery:tasks:view`: 查看配送任务
- `delivery:tasks:assign`: 分配配送任务
- `delivery:tracks:view`: 查看配送轨迹
- `delivery:tracks:report`: 上报轨迹

### 数据权限
- 配送员：仅自己的任务和轨迹数据
- 物流主管：所有配送数据
- 管理员：全局数据

---

## 完成进度

| 模块 | 前端页面 | 后端API | 数据库 | 状态 |
|------|---------|---------|--------|------|
| 线路管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 配送管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 轨迹跟踪 | ❌ 0/0 | ❌ | ❌ | 未开始 |

**总工期**: 20天
**阶段1 核心功能开发**: 6天（未开始）
**阶段2 辅助功能开发**: 6天（未开始）
**阶段3 移动端适配**: 4天（未开始）
**阶段4 联调测试**: 5天（未开始）