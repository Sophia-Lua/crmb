# 财务模块 - 设计文档

**模块名称**: finance  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 1. 数据模型设计

### 1.1 财务交易
```typescript
interface FinancialTransaction {
  id: string;
  transactionNo: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  currency: string;
  description: string;
  category: string;
  relatedOrderId?: string;
  relatedCustomerId?: string;
  relatedSupplierId?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}
```

### 1.2 对账记录
```typescript
interface ReconciliationRecord {
  id: string;
  reconciliationNo: string;
  type: 'bank' | 'supplier' | 'customer';
  relatedId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  matchedAmount: number;
  unmatchedAmount: number;
  status: 'pending' | 'completed' | 'disputed';
  createdAt: string;
  completedAt?: string;
}
```

### 1.3 财务报表
```typescript
interface FinancialReport {
  id: string;
  reportNo: string;
  type: 'balance_sheet' | 'income_statement' | 'cash_flow';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  data: Record<string, any>;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  publishedAt?: string;
}
```

---

## 2. API 接口设计

**基础路径**: `/api/finance`

- `GET /api/finance/transactions` - 财务交易列表
- `GET /api/finance/reconciliations` - 对账记录列表
- `GET /api/finance/reports` - 财务报表列表
- `POST /api/finance/reports/generate` - 生成财务报表
