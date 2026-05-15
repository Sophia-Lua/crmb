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

### 财务核算需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-FIN-001 | 作为一名财务人员 | 我希望能够录入收入记录 | 以便记录所有收入交易 |
| REQ-FIN-002 | 作为一名财务人员 | 我希望能够录入支出记录 | 以便记录所有支出交易 |
| REQ-FIN-003 | 作为一名财务人员 | 我希望能够管理转账记录 | 以便跟踪资金流转情况 |
| REQ-FIN-004 | 作为一名财务人员 | 我希望能够跟踪交易状态 | 以便了解交易的处理进展 |
| REQ-FIN-005 | 作为一名财务主管 | 我希望能够配置收入分类 | 以便规范收入类别的划分 |
| REQ-FIN-006 | 作为一名财务主管 | 我希望能够配置支出分类 | 以便规范支出类别的划分 |
| REQ-FIN-007 | 作为一名财务人员 | 我希望能够汇总分类统计数据 | 以便分析各类收支的构成 |
| REQ-FIN-008 | 作为一名财务人员 | 我希望能够核算商品成本 | 以便计算商品的精确成本 |
| REQ-FIN-009 | 作为一名财务人员 | 我希望能够统计运营成本 | 以便掌握日常运营开支 |
| REQ-FIN-010 | 作为一名财务人员 | 我希望能够核算人力成本 | 以便了解人力支出情况 |

### 对账管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-FIN-011 | 作为一名财务人员 | 我希望能够导入银行流水 | 以便获取银行交易数据 |
| REQ-FIN-012 | 作为一名财务人员 | 我希望能够匹配系统流水与银行流水 | 以便核对交易记录的一致性 |
| REQ-FIN-013 | 作为一名财务主管 | 我希望能够标记和处理流水差异 | 以便解决银行对账中的不一致项 |
| REQ-FIN-014 | 作为一名财务主管 | 我希望能够生成供应商对账单 | 以便汇总与供应商的往来账目 |
| REQ-FIN-015 | 作为一名财务主管 | 我希望能够核对供应商对账数据 | 以便确认与供应商账目一致 |
| REQ-FIN-016 | 作为一名财务主管 | 我希望能够处理和确认供应商对账差异 | 以便解决与供应商的账目不一致 |
| REQ-FIN-017 | 作为一名财务主管 | 我希望能够生成客户对账单 | 以便汇总与客户的往来账目 |
| REQ-FIN-018 | 作为一名财务主管 | 我希望能够核对客户对账数据 | 以便确认与客户账目一致 |
| REQ-FIN-019 | 作为一名财务主管 | 我希望能够处理和确认客户对账差异 | 以便解决与客户的账目不一致 |

### 报表管理需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-FIN-020 | 作为一名财务主管 | 我希望能够生成资产负债表 | 以便反映企业财务状况 |
| REQ-FIN-021 | 作为一名财务主管 | 我希望能够生成利润表 | 以便展示企业收入支出和利润 |
| REQ-FIN-022 | 作为一名财务主管 | 我希望能够生成现金流量表 | 以便反映企业资金流动情况 |
| REQ-FIN-023 | 作为一名财务主管 | 我希望能够分析收入趋势 | 以便洞察收入变化方向 |
| REQ-FIN-024 | 作为一名财务主管 | 我希望能够分析支出趋势 | 以便洞察支出变化方向 |
| REQ-FIN-025 | 作为一名财务主管 | 我希望能够统计利润率 | 以便评估企业盈利能力 |
| REQ-FIN-026 | 作为一名财务人员 | 我希望能够以Excel格式导出报表 | 以便进行后续数据分析和存档 |
| REQ-FIN-027 | 作为一名财务人员 | 我希望能够以PDF格式导出报表 | 以便正式分发和打印存档 |
| REQ-FIN-028 | 作为一名财务人员 | 我希望能够打印报表 | 以便提供纸质版本的财务报表 |

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