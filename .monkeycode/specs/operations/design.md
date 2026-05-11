# 运营模块 - 设计文档

**模块名称**: operations  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 1. 数据模型设计

### 1.1 核心数据模型
```typescript
// 商品
interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
  status: 'on_sale' | 'off_sale' | 'out_of_stock';
}

// 促销活动
interface Promotion {
  id: string;
  name: string;
  type: 'discount' | 'coupon' | 'flash_sale';
  startTime: string;
  endTime: string;
  rules: PromotionRule[];
  status: 'draft' | 'active' | 'expired' | 'cancelled';
}

// 商家审核
interface MerchantReview {
  id: string;
  merchantId: string;
  documents: ReviewDocument[];
  status: 'pending' | 'approved' | 'rejected';
  reviewerId?: string;
  rejectReason?: string;
}
```

---

## 2. API 接口设计

**基础路径**: `/api/operations`

- `GET /api/operations/products` - 商品列表
- `POST /api/operations/products` - 创建商品
- `GET /api/operations/promotions` - 促销活动列表
- `POST /api/operations/promotions` - 创建促销活动
- `GET /api/operations/merchant-reviews` - 商家审核列表
- `PUT /api/operations/merchant-reviews/:id/approve` - 审核通过

---

## 总工期: 18天

