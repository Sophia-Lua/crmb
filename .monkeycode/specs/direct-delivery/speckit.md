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

### 线路管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-001 | 作为一名物流主管 | 我能够规划配送线路（创建、编辑、站点排序） | 以便建立高效的配送路线体系 |
| REQ-002 | 作为一名物流主管 | 我能够优化配送线路 | 以便减少配送时间和成本 |
| REQ-003 | 作为一名物流主管 | 我能够管理站点信息（维护、顺序调整、状态管理） | 以便保持站点数据的准确和完整 |
| REQ-004 | 作为一名物流主管 | 我能够调整线路状态（启用/停用）并分配配送员与车辆 | 以便灵活调度配送资源 |

### 配送管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-005 | 作为一名物流主管 | 我能够分配配送任务（自动分配、手动调整、优先级设置） | 以便合理调度配送员完成配送工作 |
| REQ-006 | 作为一名配送员 | 我能够跟踪配送状态（实时更新、进度展示） | 以便及时了解任务执行情况 |
| REQ-007 | 作为一名配送员 | 我能够处理异常配送（标记类型、上报异常） | 以便及时应对配送过程中的突发问题 |
| REQ-008 | 作为一名配送员 | 我能够确认配送完成（签收确认、拍照上传） | 以便记录配送结果并完成任务闭环 |

### 轨迹跟踪需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-009 | 作为一名配送员 | 我能够实时上报GPS位置 | 以便让主管实时掌握我的配送位置 |
| REQ-010 | 作为一名物流主管 | 我能够实时跟踪配送员位置和状态 | 以便监控配送进度和调度资源 |
| REQ-011 | 作为一名物流主管 | 我能够回放历史轨迹并查看关键节点 | 以便分析配送路径和优化线路规划 |
| REQ-012 | 作为一名物流主管 | 我能够分析配送时效（时长统计、效率分析、达标率） | 以便评估配送效率和改进配送策略 |
| REQ-013 | 作为一名物流主管 | 我能够接收轨迹异常预警（偏离线路、超时、异常停留） | 以便及时发现和处理配送异常 |

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