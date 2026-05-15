# 支付模块 - Speckit 需求规格

## 模块信息
- **模块名称**: payment
- **模块介绍**: 支付模块负责商家管理、收款管理和结算管理。支持电脑端和手机端。
- **支持平台**: 电脑端 Web + 手机端 UniApp
- **总工期**: 16天
- **版本**: v1.0
- **更新日期**: 2026-05-09

---

## 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 财务人员 | 收款管理、结算管理 | 支付相关功能 |
| 商家 | 查看收款、对账 | 商家相关功能 |
| 管理员 | 全局管理 | 所有功能 |

---

## 子模块清单

| 子模块 | 电脑端 | 手机端 | 核心功能 | 状态 |
|--------|--------|--------|----------|------|
| 商家管理 | ✅ | ✅ | 商家信息、费率设置 | 未开始 |
| 收款管理 | ✅ | ✅ | 收款记录、对账 | 未开始 |
| 结算管理 | ✅ | ✅ | 结算周期、结算报表 | 未开始 |

---

## 功能需求

### 商家管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-PAY-001 | 作为一名管理员 | 我希望能够维护商家基本信息 | 以便管理商家名称、联系人和联系方式 |
| REQ-PAY-002 | 作为一名管理员 | 我希望能够管理商家状态 | 以便控制商家的启用或停用 |
| REQ-PAY-003 | 作为一名管理员 | 我希望能够配置手续费率 | 以便设定商家交易手续费规则 |
| REQ-PAY-004 | 作为一名管理员 | 我希望能够设置分润比例 | 以便分配各方收益分成 |
| REQ-PAY-005 | 作为一名财务人员 | 我希望能够维护商家银行账户信息 | 以便确保商家结算账户正确 |
| REQ-PAY-006 | 作为一名财务人员 | 我希望能够验证和确认结算账户 | 以便保障资金结算安全 |

### 收款管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-PAY-007 | 作为一名财务人员 | 我希望能够查看收款记录列表 | 以便了解所有收款交易情况 |
| REQ-PAY-008 | 作为一名财务人员 | 我希望能够查看收款详情 | 以便核实单笔收款的具体信息 |
| REQ-PAY-009 | 作为一名财务人员 | 我希望能够按状态筛选收款记录 | 以便快速定位特定状态的收款 |
| REQ-PAY-010 | 作为一名财务人员 | 我希望能够进行日结对账统计 | 以便核对每日收款总额 |
| REQ-PAY-011 | 作为一名财务人员 | 我希望能够生成月结对账报表 | 以便汇总每月收款和结算数据 |
| REQ-PAY-012 | 作为一名财务人员 | 我希望能够标记对账差异 | 以便发现和记录对账不一致项 |
| REQ-PAY-013 | 作为一名财务人员 | 我希望能够标记异常收款 | 以便识别收款中的异常交易 |
| REQ-PAY-014 | 作为一名财务人员 | 我希望能够记录异常原因 | 以便追踪收款异常的根因 |
| REQ-PAY-015 | 作为一名财务人员 | 我希望能够执行异常处理流程 | 以便妥善解决异常收款问题 |

### 结算管理需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-PAY-016 | 作为一名管理员 | 我希望能够配置结算周期 | 以便设定日结、周结或月结规则 |
| REQ-PAY-017 | 作为一名管理员 | 我希望能够设置结算规则 | 以便定义结算的计算方式和条件 |
| REQ-PAY-018 | 作为一名财务人员 | 我希望能够汇总结算数据 | 以便统计结算金额明细 |
| REQ-PAY-019 | 作为一名财务人员 | 我希望能够导出结算报表 | 以便存档和分发结算数据 |
| REQ-PAY-020 | 作为一名财务人员 | 我希望能够核对结算金额 | 以便确保结算数据的准确性 |
| REQ-PAY-021 | 作为一名财务人员 | 我希望能够执行结算操作 | 以便完成商家资金结算 |
| REQ-PAY-022 | 作为一名财务人员 | 我希望能够推送结算通知 | 以便及时告知商家结算结果 |
| REQ-PAY-023 | 作为一名财务人员 | 我希望能够确认结算结果 | 以便完成结算流程闭环 |

---

## 数据模型

### Merchant (商家)
```typescript
interface Merchant {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string;
  rate: number;
  settlementAccount: SettlementAccount;
  status: 'active' | 'inactive';
}
```

### PaymentRecord (收款记录)
```typescript
interface PaymentRecord {
  id: string;
  merchantId: string;
  orderId: string;
  amount: number;
  type: 'order' | 'refund' | 'adjustment';
  status: 'success' | 'failed' | 'pending';
  paymentTime: string;
}
```

### Settlement (结算单)
```typescript
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

## API 接口

**基础路径**: `/api/payment`

### 商家管理 API
- `GET /api/payment/merchants` - 商家列表
- `GET /api/payment/merchants/:id` - 商家详情
- `POST /api/payment/merchants` - 创建商家
- `PUT /api/payment/merchants/:id` - 更新商家信息
- `PUT /api/payment/merchants/:id/rate` - 设置费率
- `PUT /api/payment/merchants/:id/account` - 设置结算账户

### 收款管理 API
- `GET /api/payment/records` - 收款记录列表
- `GET /api/payment/records/:id` - 收款记录详情
- `GET /api/payment/records/daily-summary` - 日结汇总
- `GET /api/payment/records/monthly-summary` - 月结汇总

### 结算管理 API
- `GET /api/payment/settlements` - 结算单列表
- `GET /api/payment/settlements/:id` - 结算单详情
- `POST /api/payment/settlements/generate` - 生成结算单
- `PUT /api/payment/settlements/:id/execute` - 执行结算

---

## 技术栈

| 项目 | 电脑端 | 手机端 |
|------|--------|--------|
| 框架 | Vue 3.3+ | UniApp (Vue3) |
| UI 组件 | Element Plus 2.x | uView Plus 3.x |
| 状态管理 | Pinia 1.x | Pinia 1.x |
| HTTP 客户端 | Axios 1.x | uni.request |

---

## 权限控制

### 路由权限
- `payment:merchants:view`: 查看商家信息
- `payment:merchants:manage`: 管理商家
- `payment:records:view`: 查看收款记录
- `payment:settlements:view`: 查看结算
- `payment:settlements:manage`: 管理结算
- `payment:settlements:execute`: 执行结算

### 数据权限
- 财务人员：所有支付数据
- 商家：仅本商家数据
- 管理员：全局数据

---

## 完成进度

| 模块 | 前端页面 | 后端API | 数据库 | 状态 |
|------|---------|---------|--------|------|
| 商家管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 收款管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 结算管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |

**总工期**: 16天
**阶段1 核心功能开发**: 5天（未开始）
**阶段2 辅助功能开发**: 4天（未开始）
**阶段3 移动端适配**: 3天（未开始）
**阶段4 联调测试**: 3天（未开始）