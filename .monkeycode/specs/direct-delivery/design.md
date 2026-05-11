# 直配模块 - 设计文档

**模块名称**: direct-delivery  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 1. 数据模型设计

### 1.1 核心数据模型
```typescript
// 配送线路
interface DeliveryRoute {
  id: string;
  name: string;
  driverId: string;
  vehicleId: string;
  stations: RouteStation[];
  status: 'active' | 'inactive';
}

// 配送任务
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

// 轨迹点
interface TrackPoint {
  taskId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number;
}
```

---

## 2. API 接口设计

**基础路径**: `/api/direct-delivery`

- `GET /api/direct-delivery/routes` - 配送线路列表
- `POST /api/direct-delivery/routes` - 创建配送线路
- `GET /api/direct-delivery/tasks` - 配送任务列表
- `POST /api/direct-delivery/tasks/assign` - 分配配送任务
- `GET /api/direct-delivery/tracks/:taskId` - 获取轨迹数据

---

## 总工期: 20天

