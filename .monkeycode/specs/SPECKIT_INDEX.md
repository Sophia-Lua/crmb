# CRMB 商城配送系统 - Speckit 需求规格索引

## 系统概述

CRMB商城配送系统是一个集成了B端管理后台和C端商城应用的综合性电商平台。系统采用前后端分离架构，支持多终端访问（Web管理后台、微信小程序）。

### 技术架构

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 前端-B端 | Vue 3.3+ + Element Plus 2.x | Web管理后台 |
| 前端-C端 | UniApp (Vue3) + uView Plus 3.x | 微信小程序 |
| 状态管理 | Pinia 1.x | 跨平台状态管理 |
| HTTP客户端 | Axios 1.x (B端) / uni.request (C端) | API请求封装 |
| 后端 | Go (Gin/Echo) + GORM | RESTful API服务 |
| 数据库 | MySQL + Redis | 主数据库 + 缓存 |
| 地图服务 | 高德地图 JS API (B端) / 高德地图 UniApp SDK (C端) | 地理位置服务 |
| 文件存储 | MinIO | 自托管对象存储服务 |
| 消息队列 | RabbitMQ | 异步任务处理 |

---

## 模块依赖关系

```
销售模块 ────┬───→ 商城模块 (客户数据同步)
             ├───→ 云仓模块 (库存查询)
             └───→ 财务模块 (业绩统计)

商城模块 ────┬───→ 支付模块 (支付回调)
             ├───→ 客服模块 (订单状态)
             ├───→ 云仓模块 (库存扣减)
             └───→ 直配模块 (配送信息)

云仓模块 ────┬───→ 采购模块 (库存预警)
             ├───→ 财务模块 (成本核算)
             └───→ 数据中心 (库存报表)

采购模块 ────┬───→ 供应商模块 (订单同步)
             ├───→ 云仓模块 (入库通知)
             └───→ 财务模块 (应付账款)

财务模块 ←───┼─── 所有业务模块 (资金流水)
             └───→ 数据中心 (财务报表)

人事模块 ────┬───→ 销售模块 (人员信息)
             ├───→ 云仓模块 (仓管员信息)
             └───→ 直配模块 (配送员信息)

数据中心 ←───┴─── 所有业务模块 (数据聚合)
```

---

## 模块清单

| 模块 | 名称 | 工期 | 支持平台 | 前端进度 | 后端进度 | 文档 |
|------|------|------|----------|----------|----------|------|
| sales-module | 销售模块 | 31天 | B端+C端 | 完成 | 未开始 | [speckit.md](sales-module/speckit.md) |
| hr | 人事模块 | 12天 | B端+C端 | 未开始 | 未开始 | [speckit.md](hr/speckit.md) |
| direct-delivery | 直配模块 | 20天 | C端 | 未开始 | 未开始 | [speckit.md](direct-delivery/speckit.md) |
| customer-service | 客服模块 | 16天 | B端+C端 | 未开始 | 未开始 | [speckit.md](customer-service/speckit.md) |
| operations | 运营模块 | 18天 | B端 | 未开始 | 未开始 | [speckit.md](operations/speckit.md) |
| data-center | 数据中心 | 22天 | B端 | 未开始 | 未开始 | [speckit.md](data-center/speckit.md) |
| mall | 商城模块 | 23天 | C端 | 未开始 | 未开始 | [speckit.md](mall/speckit.md) |
| supplier | 供应商模块 | 16天 | B端 | 未开始 | 未开始 | [speckit.md](supplier/speckit.md) |
| cloud-warehouse | 云仓模块 | 20天 | B端+C端 | 未开始 | 未开始 | [speckit.md](cloud-warehouse/speckit.md) |
| payment | 支付模块 | 16天 | B端+C端 | 未开始 | 未开始 | [speckit.md](payment/speckit.md) |
| procurement | 采购模块 | 18天 | B端 | 未开始 | 未开始 | [speckit.md](procurement/speckit.md) |
| finance | 财务模块 | 12天 | B端 | 未开始 | 未开始 | [speckit.md](finance/speckit.md) |

**总工期**: 238天

---

## 快速导航

- [销售模块](sales-module/speckit.md) - 客户开发、拜访管理、店铺审核
- [人事模块](hr/speckit.md) - 员工管理、考勤、绩效
- [直配模块](direct-delivery/speckit.md) - 线路管理、配送管理、轨迹跟踪
- [客服模块](customer-service/speckit.md) - 订单管理、售后、客诉、发票
- [运营模块](operations/speckit.md) - 商品管理、活动管理、商家审核
- [数据中心](data-center/speckit.md) - 数据查询、统计分析、报表导出
- [商城模块](mall/speckit.md) - C端商城、商品浏览、下单支付
- [供应商模块](supplier/speckit.md) - 订单管理、发货管理、对账
- [云仓模块](cloud-warehouse/speckit.md) - 出入库管理、库存管理、行政管理
- [支付模块](payment/speckit.md) - 商家管理、收款管理、结算管理
- [采购模块](procurement/speckit.md) - 供应商管理、采购订单、结算管理
- [财务模块](finance/speckit.md) - 财务核算、对账、报表

---

## 公共服务模块

- **认证授权服务**: JWT Token + RBAC权限控制
- **文件服务**: MinIO对象存储文件上传下载
- **消息服务**: 站内信、短信、微信模板消息
- **日志服务**: 操作日志、访问日志
- **监控服务**: 系统监控、业务监控

---

## 相关文档

- [系统架构设计文档](ARCHITECTURE.md)
- [跨模块依赖关系说明](MODULE_DEPENDENCIES.md)