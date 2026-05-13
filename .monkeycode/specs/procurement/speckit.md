# 采购模块 - Speckit 需求规格

## 模块信息
- **模块名称**: procurement
- **模块介绍**: 采购模块负责供应商管理、采购订单管理和结算管理。支持电脑端。
- **支持平台**: 电脑端 Web
- **总工期**: 18天
- **版本**: v1.0
- **更新日期**: 2026-05-09

---

## 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 采购员 | 采购订单管理 | 采购相关功能 |
| 采购主管 | 供应商管理、数据审核 | 采购全模块 |
| 管理员 | 全局管理 | 所有功能 |

---

## 子模块清单

| 子模块 | 电脑端 | 手机端 | 核心功能 | 状态 |
|--------|--------|--------|----------|------|
| 供应商管理 | ✅ | ✅ | 供应商信息、资质审核 | 未开始 |
| 采购订单 | ✅ | ✅ | 采购单创建、审批、执行 | 未开始 |
| 结算管理 | ✅ | ✅ | 应付账款、对账、付款 | 未开始 |

---

## 功能需求

### FR-001: 供应商管理
**优先级**: P0
**描述**: 管理供应商信息和资质审核

**子功能**:
- FR-001-1: 供应商信息维护
  - 供应商基本信息录入（名称、联系人、联系方式、地址）
  - 供应商状态管理（启用/停用/黑名单）

- FR-001-2: 供应商资质审核
  - 资质文件上传和查看
  - 资质审核流程
  - 审核结果通知

- FR-001-3: 供应商评级管理
  - 供应商评分维度设置
  - 评级计算和展示
  - 评级调整和更新

### FR-002: 采购订单
**优先级**: P0
**描述**: 管理采购订单创建、审批和执行

**子功能**:
- FR-002-1: 采购需求申请
  - 需求填写和提交
  - 需求审批流程
  - 需求状态跟踪

- FR-002-2: 采购订单创建
  - 采购订单信息录入（商品、数量、价格）
  - 供应商选择
  - 订单编号生成

- FR-002-3: 采购订单审批
  - 审批流程配置
  - 审批节点流转
  - 审批结果通知

- FR-002-4: 采购订单执行跟踪
  - 订单执行进度
  - 到货状态跟踪
  - 订单完成确认

### FR-003: 结算管理
**优先级**: P1
**描述**: 管理应付账款和对账付款

**子功能**:
- FR-003-1: 应付账款管理
  - 应付账款列表
  - 账款到期提醒
  - 账款状态跟踪

- FR-003-2: 月度对账
  - 对账单生成
  - 对账数据核对
  - 差异处理

- FR-003-3: 付款申请和执行
  - 付款申请提交
  - 付款审批流程
  - 付款执行和确认

---

## 数据模型

### Supplier (供应商)
```typescript
interface Supplier {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string;
  email: string;
  address: string;
  rating: number;
  status: 'active' | 'inactive' | 'blacklisted';
  licenses: SupplierLicense[];
}
```

### PurchaseOrder (采购订单)
```typescript
interface PurchaseOrder {
  id: string;
  orderNo: string;
  supplierId: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'executing' | 'completed' | 'cancelled';
  approverId?: string;
  createdAt: string;
}
```

### AccountsPayable (应付账款)
```typescript
interface AccountsPayable {
  id: string;
  supplierId: string;
  orderId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}
```

---

## API 接口

**基础路径**: `/api/procurement`

### 供应商管理 API
- `GET /api/procurement/suppliers` - 供应商列表
- `GET /api/procurement/suppliers/:id` - 供应商详情
- `POST /api/procurement/suppliers` - 创建供应商
- `PUT /api/procurement/suppliers/:id` - 更新供应商
- `PUT /api/procurement/suppliers/:id/rating` - 更新评级
- `PUT /api/procurement/suppliers/:id/status` - 更新供应商状态

### 采购订单 API
- `GET /api/procurement/purchase-orders` - 采购订单列表
- `GET /api/procurement/purchase-orders/:id` - 订单详情
- `POST /api/procurement/purchase-orders` - 创建采购订单
- `PUT /api/procurement/purchase-orders/:id/approve` - 审批订单
- `PUT /api/procurement/purchase-orders/:id/status` - 更新订单状态

### 结算管理 API
- `GET /api/procurement/accounts-payable` - 应付账款列表
- `GET /api/procurement/accounts-payable/:id` - 应付账款详情
- `POST /api/procurement/settlement` - 结算申请
- `PUT /api/procurement/settlement/:id/approve` - 审批结算
- `PUT /api/procurement/settlement/:id/execute` - 执行付款

---

## 技术栈

| 项目 | 电脑端 |
|------|--------|
| 框架 | Vue 3.3+ |
| UI 组件 | Element Plus 2.x |
| 状态管理 | Pinia 1.x |
| HTTP 客户端 | Axios 1.x |

---

## 权限控制

### 路由权限
- `proc:suppliers:view`: 查看供应商
- `proc:suppliers:manage`: 管理供应商
- `proc:orders:view`: 查看采购订单
- `proc:orders:create`: 创建采购订单
- `proc:orders:approve`: 审批采购订单
- `proc:settlement:view`: 查看结算
- `proc:settlement:apply`: 申请结算
- `proc:settlement:approve`: 审批结算

### 数据权限
- 采购员：采购订单数据
- 采购主管：全模块数据 + 审核权限
- 管理员：全局数据

---

## 完成进度

| 模块 | 前端页面 | 后端API | 数据库 | 状态 |
|------|---------|---------|--------|------|
| 供应商管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 采购订单 | ❌ 0/0 | ❌ | ❌ | 未开始 |
| 结算管理 | ❌ 0/0 | ❌ | ❌ | 未开始 |

**总工期**: 18天
**阶段1 核心功能开发**: 5天（未开始）
**阶段2 辅助功能开发**: 5天（未开始）
**阶段3 联调测试**: 4天（未开始）