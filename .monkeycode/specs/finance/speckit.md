# 财务模块 - Speckit 需求规格

## 模块信息
- **模块名称**: finance
- **模块介绍**: 财务模块负责处理财务核算、对账、报表等财务管理相关工作。支持电脑端。
- **支持平台**: 电脑端 Web
- **总工期**: 12天
- **版本**: v1.0
- **更新日期**: 2026-05-09

---

## 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 财务人员 | 日常财务处理、对账 | 财务相关功能 |
| 财务主管 | 财务审核、报表管理 | 财务全模块 + 数据 |
| 管理员 | 全局管理 | 所有功能 |

---

## 子模块清单

| 子模块 | 电脑端 | 手机端 | 核心功能 | 状态 |
|--------|--------|--------|----------|------|
| 财务核算 | ✅ | ✅ | 收入/支出管理、成本核算 | 未开始 |
| 对账 | ✅ | ✅ | 银行对账、供应商对账、客户对账 | 未开始 |
| 报表 | ✅ | ✅ | 财务报表、统计分析 | 未开始 |

---

## 功能需求

### FR-001: 财务核算
**优先级**: P0
**描述**: 管理收入、支出和成本核算

**子功能**:
- FR-001-1: 财务交易管理
  - 收入记录录入
  - 支出记录录入
  - 转账记录管理
  - 交易状态跟踪（待处理/已完成/已取消）

- FR-001-2: 收入/支出分类管理
  - 收入分类配置
  - 支出分类配置
  - 分类统计汇总

- FR-001-3: 成本核算
  - 商品成本核算
  - 运营成本统计
  - 人力成本核算

### FR-002: 对账管理
**优先级**: P0
**描述**: 处理银行对账、供应商对账和客户对账

**子功能**:
- FR-002-1: 银行对账
  - 银行流水导入
  - 系统流水匹配
  - 差异标记和处理

- FR-002-2: 供应商对账
  - 供应商对账单生成
  - 对账数据核对
  - 差异处理和确认

- FR-002-3: 客户对账
  - 客户对账单生成
  - 对账数据核对
  - 差异处理和确认

### FR-003: 报表管理
**优先级**: P1
**描述**: 生成和管理财务报表

**子功能**:
- FR-003-1: 财务报表生成
  - 资产负债表
  - 利润表（收入支出表）
  - 现金流量表

- FR-003-2: 统计分析
  - 收入趋势分析
  - 支出趋势分析
  - 利润率统计

- FR-003-3: 报表导出
  - Excel 格式导出
  - PDF 格式导出
  - 报表打印

---

## 数据模型

### FinancialTransaction (财务交易)
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

### ReconciliationRecord (对账记录)
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

### FinancialReport (财务报表)
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

## API 接口

**基础路径**: `/api/finance`

### 财务交易 API
- `GET /api/finance/transactions` - 财务交易列表
- `GET /api/finance/transactions/:id` - 交易详情
- `POST /api/finance/transactions` - 创建交易记录
- `PUT /api/finance/transactions/:id` - 更新交易记录
- `GET /api/finance/transactions/summary` - 交易汇总统计

### 对账管理 API
- `GET /api/finance/reconciliations` - 对账记录列表
- `GET /api/finance/reconciliations/:id` - 对账详情
- `POST /api/finance/reconciliations` - 创建对账记录
- `PUT /api/finance/reconciliations/:id/complete` - 完成对账
- `PUT /api/finance/reconciliations/:id/dispute` - 标记差异

### 报表管理 API
- `GET /api/finance/reports` - 财务报表列表
- `GET /api/finance/reports/:id` - 报表详情
- `POST /api/finance/reports/generate` - 生成财务报表
- `GET /api/finance/reports/:id/export` - 导出报表

---

## 技术栈

| 项目 | 电脑端 |
|------|--------|
| 框架 | Vue 3.3+ |
| UI 组件 | Element Plus 2.x |
| 状态管理 | Pinia 1.x |
| HTTP 客户端 | Axios 1.x |
| 图表库 | ECharts 5.x |
| 导出库 | xlsx (Excel) + jsPDF (PDF) |

---

## 权限控制

### 路由权限
- `fin:transactions:view`: 查看财务交易
- `fin:transactions:manage`: 管理财务交易
- `fin:reconciliations:view`: 查看对账记录
- `fin:reconciliations:manage`: 管理对账
- `fin:reports:view`: 查看报表
- `fin:reports:generate`: 生成报表
- `fin:reports:export`: 导出报表

### 数据权限
- 财务人员：财务相关数据
- 财务主管：全模块数据 + 审核权限
- 管理员：全局数据

---

## 完成进度

| 模块 | 前端页面 | 后端API | 数据库 | 状态 |
|------|---------|---------|--------|------|
| 财务核算 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 对账 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 报表 | ❌ 0/0 | ❌ | ❌ | 未开始 |

**总工期**: 12天
**阶段1 财务核算开发**: 4天（未开始）
**阶段2 对账开发**: 3天（未开始）
**阶段3 报表开发**: 3天（未开始）
**阶段4 联调测试**: 2天（未开始）