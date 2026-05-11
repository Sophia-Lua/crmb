# 支付模块 - 设计文档

**模块名称**: payment  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 1. 数据模型设计

### 1.1 核心数据模型
```typescript
// 商家
interface Merchant {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string;
  rate: number;
  settlementAccount: SettlementAccount;
  status: 'active' | 'inactive';
}

// 收款记录
interface PaymentRecord {
  id: string;
  merchantId: string;
  orderId: string;
  amount: number;
  type: 'order' | 'refund' | 'adjustment';
  status: 'success' | 'failed' | 'pending';
  paymentTime: string;
}

// 结算单
interface Settlement {
  id: string;
  merchantId: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  feeAmount: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}
```

---

## 2. API 接口设计

**基础路径**: `/api/payment`

- `GET /api/payment/merchants` - 商家列表
- `POST /api/payment/merchants` - 创建商家
- `GET /api/payment/records` - 收款记录
- `GET /api/payment/settlements` - 结算单列表
- `POST /api/payment/settlements/generate` - 生成结算单

---

## 3. 前端架构设计

### 3.1 技术栈
| 项目 | 电脑端 | 手机端 |
|------|--------|--------|
| 框架 | Vue 3.3+ | UniApp (Vue3) |
| UI 组件 | Element Plus 2.x | uView Plus 3.x |
| 状态管理 | Pinia 1.x | Pinia 1.x |
| HTTP 客户端 | Axios 1.x | uni.request |

### 3.2 目录结构
```
src/
├── views/
│   └── payment/
│       ├── merchants/         # 商家管理
│       ├── records/           # 收款管理
│       └── settlement/        # 结算管理
├── components/
│   └── payment/
├── stores/
│   └── payment.js
├── api/
│   └── payment.js
└── mock/
    └── payment.js
```

---

## 总工期: 16天

