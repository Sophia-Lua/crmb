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

### FR-001: 商家管理
**优先级**: P0
**描述**: 管理商家信息和费率设置

**子功能**:
- FR-001-1: 商家信息维护
  - 商家基本信息管理（名称、联系人、联系方式）
  - 商家状态管理（启用/停用）

- FR-001-2: 费率设置
  - 手续费率配置
  - 分润比例设置

- FR-001-3: 结算账户管理
  - 银行账户信息维护
  - 账户验证和确认

### FR-002: 收款管理
**优先级**: P0
**描述**: 管理收款记录和对账

**子功能**:
- FR-002-1: 收款记录查询
  - 收款记录列表查看
  - 收款详情查看
  - 收款状态筛选

- FR-002-2: 日结/月结对账
  - 日结对账统计
  - 月结对账报表
  - 对账差异标记

- FR-002-3: 异常收款处理
  - 异常收款标记
  - 异常原因记录
  - 异常处理流程

### FR-003: 结算管理
**优先级**: P1
**描述**: 管理结算周期和结算报表

**子功能**:
- FR-003-1: 结算周期设置
  - 结算周期配置（日结/周结/月结）
  - 结算规则设置

- FR-003-2: 结算报表生成
  - 结算数据汇总
  - 结算报表导出
  - 结算金额核对

- FR-003-3: 结算执行和通知
  - 结算执行操作
  - 结算通知推送
  - 结算结果确认

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