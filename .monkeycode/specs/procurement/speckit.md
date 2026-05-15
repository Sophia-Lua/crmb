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

### 供应商管理需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-PROC-001 | 作为一名采购员 | 我希望能够录入供应商基本信息 | 以便建立供应商档案 |
| REQ-PROC-002 | 作为一名采购主管 | 我希望能够管理供应商状态 | 以便控制供应商的启用、停用或黑名单 |
| REQ-PROC-003 | 作为一名采购员 | 我希望能够上传供应商资质文件 | 以便保存供应商资质证明材料 |
| REQ-PROC-004 | 作为一名采购主管 | 我希望能够审核供应商资质 | 以便确认供应商符合合作要求 |
| REQ-PROC-005 | 作为一名采购主管 | 我希望能够通知资质审核结果 | 以便让相关人员了解资质审核结论 |
| REQ-PROC-006 | 作为一名采购主管 | 我希望能够设置供应商评分维度 | 以便建立供应商评估标准 |
| REQ-PROC-007 | 作为一名采购主管 | 我希望能够查看供应商评级结果 | 以便评估供应商综合表现 |
| REQ-PROC-008 | 作为一名采购主管 | 我希望能够调整和更新供应商评级 | 以便动态反映供应商最新表现 |

### 采购订单需求 (P0)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-PROC-009 | 作为一名采购员 | 我希望能够填写和提交采购需求 | 以便发起采购申请 |
| REQ-PROC-010 | 作为一名采购主管 | 我希望能够审批采购需求 | 以便确认采购需求的合理性 |
| REQ-PROC-011 | 作为一名采购员 | 我希望能够跟踪需求状态 | 以便了解采购需求的审批进展 |
| REQ-PROC-012 | 作为一名采购员 | 我希望能够录入采购订单信息 | 以便创建包含商品、数量和价格的订单 |
| REQ-PROC-013 | 作为一名采购员 | 我希望能够选择供应商 | 以便为采购订单指定合适的供应商 |
| REQ-PROC-014 | 作为一名采购员 | 我希望能够生成采购订单编号 | 以便唯一标识每笔采购订单 |
| REQ-PROC-015 | 作为一名采购主管 | 我希望能够配置审批流程 | 以便定义采购订单的审批规则 |
| REQ-PROC-016 | 作为一名采购主管 | 我希望能够流转审批节点 | 以便推动采购订单审批进程 |
| REQ-PROC-017 | 作为一名采购主管 | 我希望能够通知审批结果 | 以便让相关人员了解审批结论 |
| REQ-PROC-018 | 作为一名采购员 | 我希望能够跟踪采购订单执行进度 | 以便监控订单履约情况 |
| REQ-PROC-019 | 作为一名采购员 | 我希望能够跟踪到货状态 | 以便了解采购商品的到货进度 |
| REQ-PROC-020 | 作为一名采购主管 | 我希望能够确认采购订单完成 | 以便完结采购订单流程 |

### 结算管理需求 (P1)

| 编号 | 角色 | 动作 | 目的 |
|------|------|------|------|
| REQ-PROC-021 | 作为一名采购员 | 我希望能够查看应付账款列表 | 以便了解所有待付款项 |
| REQ-PROC-022 | 作为一名采购员 | 我希望能够接收账款到期提醒 | 以便及时处理即将到期的付款 |
| REQ-PROC-023 | 作为一名采购员 | 我希望能够跟踪账款状态 | 以便掌握应付账款的支付进展 |
| REQ-PROC-024 | 作为一名采购主管 | 我希望能够生成对账单 | 以便汇总供应商往来数据 |
| REQ-PROC-025 | 作为一名采购主管 | 我希望能够核对对账数据 | 以便确认与供应商的账目一致 |
| REQ-PROC-026 | 作为一名采购主管 | 我希望能够处理对账差异 | 以便解决与供应商的账目不一致 |
| REQ-PROC-027 | 作为一名采购员 | 我希望能够提交付款申请 | 以便发起供应商付款流程 |
| REQ-PROC-028 | 作为一名采购主管 | 我希望能够审批付款申请 | 以便确认付款的合理性 |
| REQ-PROC-029 | 作为一名采购主管 | 我希望能够执行和确认付款 | 以便完成供应商付款操作 |

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