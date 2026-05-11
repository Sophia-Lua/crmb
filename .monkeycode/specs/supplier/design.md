# 供应商模块 - 设计文档

**模块名称**: supplier  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 1. 数据模型设计

### 1.1 核心数据模型
```typescript
// 供应商订单
interface SupplierOrder {
  id: string;
  orderId: string;
  items: SupplierOrderItem[];
  status: 'received' | 'confirmed' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  confirmTime?: string;
  shipTime?: string;
}

// 发货单
interface ShippingOrder {
  id: string;
  supplierOrderId: string;
  logisticsCompany: string;
  trackingNo: string;
  items: ShippingItem[];
  status: 'created' | 'shipped' | 'delivered' | 'returned';
}

// 对账单
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

## 2. API 接口设计

**基础路径**: `/api/supplier`

- `GET /api/supplier/orders` - 供应商订单列表
- `PUT /api/supplier/orders/:id/confirm` - 确认订单
- `POST /api/supplier/shipping` - 创建发货单
- `GET /api/supplier/reconciliation` - 对账单列表
- `PUT /api/supplier/reconciliation/:id/confirm` - 确认对账

---

## 总工期: 16天

