# Admin-Server 前后端 API 路径对比报告

> 前端 baseURL = `/api`（见 request.js），故前端路径 `/sales/visits` 实际请求 `/api/sales/visits`
> 后端路由均在 `/api/...` group 下注册
> 对比时统一去掉 `/api` 前缀，直接比较路径段

---

## 1. Auth 模块（stores/auth.js，无独立 api/auth.js）

| 前端函数 | 方法 | 前端路径 | 后端路径 | 后端方法 | 状态 |
|----------|------|---------|---------|---------|------|
| login | POST | /auth/login | /auth/login | POST | MATCH |
| getUserInfo | GET | /auth/user-info | /auth/userinfo | GET | **PATH DIFF** |

> **关键差异**: 前端用 `/auth/user-info`（有连字符），后端注册 `/auth/userinfo`（无连字符）

---

## 2. Sales 模块（api/sales.js）

| 前端函数 | 方法 | 前端路径 | 后端路径 | 后端方法 | 状态 |
|----------|------|---------|---------|---------|------|
| getVisits | GET | /sales/visits | /sales/visits | GET | MATCH |
| getVisitDetail | GET | /sales/visits/:id | /sales/visits/:id | GET | MATCH |
| createVisit | POST | /sales/visits | /sales/visits | POST | MATCH |
| updateVisit | PUT | /sales/visits/:id | /sales/visits/:id | PUT | MATCH |
| deleteVisit | DELETE | /sales/visits/:id | /sales/visits/:id | DELETE | MATCH |
| getVisitStatistics | GET | /sales/visits/statistics | /sales/visits/statistics | GET | MATCH |
| getUnclaimedStores | GET | /sales/stores/unclaimed | /sales/stores/unclaimed | GET | MATCH |
| getReviewStores | GET | /sales/stores/review | /sales/stores/review | GET | MATCH |
| getStoreDetail | GET | /sales/stores/:id | /sales/stores/:id | GET | MATCH |
| claimStore | POST | /sales/stores/:id/claim | /sales/stores/:id/claim | POST | MATCH |
| reviewStore | POST | /sales/stores/:id/review | /sales/stores/:id/review | POST | MATCH |
| assignStore | POST | /sales/stores/:id/assign | /sales/stores/:id/assign | POST | MATCH |
| getPublicCustomers | GET | /sales/customers/public | /sales/customers/public | GET | MATCH |
| getPrivateCustomers | GET | /sales/customers/private | /sales/customers/private | GET | MATCH |
| searchCustomers | GET | /sales/customers/search | /sales/customers/search | GET | MATCH |
| getCustomerDetail | GET | /sales/customers/:id | /sales/customers/:id | GET | MATCH |
| claimCustomer | POST | /sales/customers/:id/claim | /sales/customers/:id/claim | POST | MATCH |
| returnCustomer | POST | /sales/customers/:id/return | /sales/customers/:id/return | POST | MATCH |
| transferCustomer | POST | /sales/customers/:id/transfer | /sales/customers/:id/transfer | POST | MATCH |
| getComplaints | GET | /customer-service/complaints | /customer-service/complaints | GET | MATCH*(跨模块) |
| getSpecialStockRequests | GET | /sales/special-stock-requests | /sales/special-stock-requests | GET | MATCH |
| getBlacklist | GET | /sales/blacklist | /sales/blacklist | GET | MATCH |

### 后端有但前端未调用的路由

| 后端路径 | 后端方法 | Handler | 前端缺失 |
|----------|---------|---------|---------|
| /sales/stores | GET | ListStores | 无前端函数 |
| /sales/stores/statistics | GET | StoreStatistics | 无前端函数 |
| /sales/map/customers | GET | CustomerDistribution | 无前端函数 |
| /sales/map/unregistered | GET | UnregisteredStores | 无前端函数 |
| /sales/markers/:id | GET | GetMarker | 无前端函数 |

---

## 3. HR 模块（api/hr.js）

| 前端函数 | 方法 | 前端路径 | 后端路径 | 后端方法 | 状态 |
|----------|------|---------|---------|---------|------|
| getEmployees | GET | /hr/employees | /hr/employees | GET | MATCH |
| getEmployeeDetail | GET | /hr/employees/:id | — | — | **MISSING** |
| createEmployee | POST | /hr/employees | — | — | **MISSING** |
| updateEmployee | PUT | /hr/employees/:id | — | — | **MISSING** |
| getAttendance | GET | /hr/attendance | /hr/attendance | GET | MATCH |
| checkIn | POST | /hr/attendance/check-in | /hr/attendance/check-in | POST | MATCH |
| checkOut | POST | /hr/attendance/check-out | /hr/attendance/check-out | POST | MATCH |
| getLeaveApplications | GET | /hr/leave-applications | — | — | **MISSING** |
| approveLeave | PUT | /hr/leave-applications/:id/approve | — | — | **MISSING** |
| getPerformance | GET | /hr/performance | /hr/performance | GET | MATCH |
| createPerformance | POST | /hr/performance | — | — | **MISSING** |
| updatePerformance | PUT | /hr/performance/:id | — | — | **MISSING** |

> checkIn/checkOut 路径完全匹配，无差异

---

## 4. Customer-Service 模块（api/customer-service.js）

| 前端函数 | 方法 | 前端路径 | 后端路径 | 后端方法 | 状态 |
|----------|------|---------|---------|---------|------|
| getOrders | GET | /customer-service/orders | /customer-service/orders | GET | MATCH |
| getOrderDetail | GET | /customer-service/orders/:id | /customer-service/orders/:id | GET | MATCH |
| approveOrder | PUT | /customer-service/orders/:id/confirm | /customer-service/orders/:id/confirm | PUT | MATCH |
| cancelOrder | PUT | /customer-service/orders/:id/cancel | /customer-service/orders/:id/cancel | PUT | MATCH |
| remarkOrder | POST | /customer-service/orders/:id/remark | /customer-service/orders/:id/remark | POST | MATCH |
| modifyPrice | PUT | /customer-service/orders/:id/modify-price | — | — | **MISSING** |
| trackOrder | GET | /customer-service/orders/:id/track | — | — | **MISSING** |
| getAfterSales | GET | /customer-service/after-sales | /customer-service/after-sales | GET | MATCH |
| getAfterSaleDetail | GET | /customer-service/after-sales/:id | /customer-service/after-sales/:id | GET | MATCH |
| auditAfterSale | PUT | /customer-service/after-sales/:id/approve | /customer-service/after-sales/:id/approve | PUT | MATCH |
| confirmReceive | PUT | /customer-service/after-sales/:id/receive | /customer-service/after-sales/:id/receive | PUT | MATCH |
| processRefund | PUT | /customer-service/after-sales/:id/refund | /customer-service/after-sales/:id/refund | PUT | MATCH |
| rejectAfterSale | PUT | /customer-service/after-sales/:id/reject | — | — | **MISSING** |
| getComplaints | GET | /customer-service/complaints | /customer-service/complaints | GET | MATCH |
| getComplaintDetail | GET | /customer-service/complaints/:id | /customer-service/complaints/:id | GET | MATCH |
| acceptComplaint | PUT | /customer-service/complaints/:id/accept | /customer-service/complaints/:id/accept | PUT | MATCH |
| assignComplaint | PUT | /customer-service/complaints/:id/assign | — | — | **MISSING** |
| processComplaint | PUT | /customer-service/complaints/:id/process | /customer-service/complaints/:id/process | PUT | MATCH |
| replyComplaint | PUT | /customer-service/complaints/:id/reply | — | — | **MISSING** |
| closeComplaint | PUT | /customer-service/complaints/:id/close | /customer-service/complaints/:id/close | PUT | MATCH |
| getReviews | GET | /customer-service/reviews | /customer-service/reviews | GET | MATCH |
| replyReview | POST | /customer-service/reviews/:id/reply | /customer-service/reviews/:id/reply | POST | MATCH |
| getReviewStatistics | GET | /customer-service/reviews/statistics | — | — | **MISSING** |
| getFeedbacks | GET | /customer-service/feedbacks | /customer-service/feedbacks | GET | MATCH |
| processFeedback | PUT | /customer-service/feedbacks/:id/process | /customer-service/feedbacks/:id/process | PUT | MATCH |
| getFeedbackStatistics | GET | /customer-service/feedbacks/statistics | — | — | **MISSING** |
| getInvoices | GET | /customer-service/invoices | /customer-service/invoices | GET | MATCH |
| getInvoiceDetail | GET | /customer-service/invoices/:id | /customer-service/invoices/:id | GET | MATCH |
| auditInvoice | PUT | /customer-service/invoices/:id/audit | /customer-service/invoices/:id/approve | PUT | **PATH DIFF** |
| issueInvoice | PUT | /customer-service/invoices/:id/issue | /customer-service/invoices/:id/issue | PUT | MATCH |
| mailInvoice | PUT | /customer-service/invoices/:id/mail | — | — | **MISSING** |
| voidInvoice | PUT | /customer-service/invoices/:id/void | /customer-service/invoices/:id/void | PUT | MATCH |

> **关键差异**: auditInvoice 前端路径 `/customer-service/invoices/:id/audit` vs 后端 `/customer-service/invoices/:id/approve`

---

## 5. Cloud-Warehouse 模块（api/cloud-warehouse.js）

| 前端函数 | 方法 | 前端路径 | 后端路径 | 后端方法 | 状态 |
|----------|------|---------|---------|---------|------|
| getOutboundOrders | GET | /cloud-warehouse/outbound | /cloud-warehouse/outbound | GET | MATCH |
| createOutboundOrder | POST | /cloud-warehouse/outbound | /cloud-warehouse/outbound | POST | MATCH |
| confirmOutbound | PUT | /cloud-warehouse/outbound/:id/confirm | — | — | **MISSING** |
| getReturnOutbound | GET | /cloud-warehouse/outbound/return | — | — | **MISSING** |
| getManualOutbound | GET | /cloud-warehouse/outbound/manual | — | — | **MISSING** |
| getInboundOrders | GET | /cloud-warehouse/inbound | /cloud-warehouse/inbound | GET | MATCH |
| createInboundOrder | POST | /cloud-warehouse/inbound | /cloud-warehouse/inbound | POST | MATCH |
| confirmInbound | PUT | /cloud-warehouse/inbound/:id/confirm | — | — | **MISSING** |
| getReturnInbound | GET | /cloud-warehouse/inbound/return | — | — | **MISSING** |
| getManualInbound | GET | /cloud-warehouse/inbound/manual | — | — | **MISSING** |
| getInventory | GET | /cloud-warehouse/inventory | /cloud-warehouse/inventory | GET | MATCH |
| getBatchInventory | GET | /cloud-warehouse/inventory/batch | — | — | **MISSING** |
| getLocationInventory | GET | /cloud-warehouse/inventory/location | — | — | **MISSING** |
| createCheckPlan | POST | /cloud-warehouse/inventory/check-plan | — | — | **MISSING** |
| executeCheck | POST | /cloud-warehouse/inventory/check | /cloud-warehouse/inventory/check | POST | MATCH |
| processCheckDifference | PUT | /cloud-warehouse/inventory/check/:id/difference | — | — | **MISSING** |
| getLowStockWarning | GET | /cloud-warehouse/inventory/low-stock | — | — | **MISSING** |
| getExpiryWarning | GET | /cloud-warehouse/inventory/expiry | — | — | **MISSING** |
| getUnloadingPlan | GET | /cloud-warehouse/admin/unloading | /cloud-warehouse/admin/unloading | GET | MATCH |
| createUnloadingRecord | POST | /cloud-warehouse/admin/unloading | — | — | **MISSING** |
| getSchedule | GET | /cloud-warehouse/admin/schedule | — | — | **MISSING** |
| getVehicles | GET | /cloud-warehouse/admin/vehicles | — | — | **MISSING** |
| getDrivers | GET | /cloud-warehouse/admin/drivers | — | — | **MISSING** |

---

## 6. Procurement 模块（api/procurement.js）

| 前端函数 | 方法 | 前端路径 | 后端路径 | 后端方法 | 状态 |
|----------|------|---------|---------|---------|------|
| getSuppliers | GET | /procurement/suppliers | /procurement/suppliers | GET | MATCH |
| getSupplierDetail | GET | /procurement/suppliers/:id | /procurement/suppliers/:id | GET | MATCH |
| createSupplier | POST | /procurement/suppliers | /procurement/suppliers | POST | MATCH |
| updateSupplier | PUT | /procurement/suppliers/:id | /procurement/suppliers/:id | PUT | MATCH |
| auditSupplier | PUT | /procurement/suppliers/:id/audit | /procurement/suppliers/:id/audit | PUT | MATCH |
| getSupplierRating | GET | /procurement/suppliers/:id/rating | /procurement/suppliers/:id/rating | GET | MATCH |
| getPurchaseRequests | GET | /procurement/purchase-requests | /procurement/purchase-requests | GET | MATCH |
| createPurchaseRequest | POST | /procurement/purchase-requests | /procurement/purchase-requests | POST | MATCH |
| approvePurchaseRequest | PUT | /procurement/purchase-requests/:id/approve | /procurement/purchase-requests/:id/approve | PUT | MATCH |
| getPurchaseOrders | GET | /procurement/purchase-orders | /procurement/purchase-orders | GET | MATCH |
| createPurchaseOrder | POST | /procurement/purchase-orders | /procurement/purchase-orders | POST | MATCH |
| approvePurchaseOrder | PUT | /procurement/purchase-orders/:id/approve | /procurement/purchase-orders/:id/approve | PUT | MATCH |
| trackPurchaseOrder | GET | /procurement/purchase-orders/:id/track | /procurement/purchase-orders/:id/track | GET | MATCH |
| getPayableAccounts | GET | /procurement/payable-accounts | /procurement/payable-accounts | GET | MATCH |
| generateReconciliation | POST | /procurement/reconciliation/generate | /procurement/reconciliation/generate | POST | MATCH |
| confirmReconciliation | PUT | /procurement/reconciliation/:id/confirm | /procurement/reconciliation/:id/confirm | PUT | MATCH |
| createPaymentRequest | POST | /procurement/payment-requests | /procurement/payment-requests | POST | MATCH |
| approvePayment | PUT | /procurement/payment-requests/:id/approve | /procurement/payment-requests/:id/approve | PUT | MATCH |
| executePayment | PUT | /procurement/payment-requests/:id/execute | /procurement/payment-requests/:id/execute | PUT | MATCH |

> **Procurement 模块：全部 19 个函数路径完全匹配**

---

## 7. Finance 模块（api/finance.js）

| 前端函数 | 方法 | 前端路径 | 后端路径 | 后端方法 | 状态 |
|----------|------|---------|---------|---------|------|
| getTransactions | GET | /finance/transactions | /finance/transactions | GET | MATCH |
| createTransaction | POST | /finance/transactions | — | — | **MISSING** |
| updateTransaction | PUT | /finance/transactions/:id | — | — | **MISSING** |
| getTransactionSummary | GET | /finance/transactions/summary | — | — | **MISSING** |
| getCategories | GET | /finance/categories | — | — | **MISSING** |
| createCategory | POST | /finance/categories | — | — | **MISSING** |
| getCategoryStatistics | GET | /finance/categories/:id/statistics | — | — | **MISSING** |
| calculateCost | POST | /finance/cost/calculate | — | — | **MISSING** |
| getOperatingCost | GET | /finance/cost/operating | — | — | **MISSING** |
| getLaborCost | GET | /finance/cost/labor | — | — | **MISSING** |
| importBankStatement | POST | /finance/bank-statement/import | — | — | **MISSING** |
| matchStatement | PUT | /finance/bank-statement/:id/match | — | — | **MISSING** |
| markDifference | PUT | /finance/bank-statement/:id/difference | — | — | **MISSING** |
| getSupplierReconciliation | GET | /finance/reconciliation/supplier | — | — | **MISSING** |
| getCustomerReconciliation | GET | /finance/reconciliation/customer | — | — | **MISSING** |
| processReconciliationDifference | PUT | /finance/reconciliation/:id/difference | — | — | **MISSING** |
| confirmReconciliation | PUT | /finance/reconciliation/:id/confirm | — | — | **MISSING** |
| generateBalanceSheet | POST | /finance/reports/balance-sheet | — | — | **MISSING** |
| generateIncomeStatement | POST | /finance/reports/income-statement | — | — | **MISSING** |
| generateCashFlowStatement | POST | /finance/reports/cash-flow | — | — | **MISSING** |
| getIncomeTrend | GET | /finance/trend/income | — | — | **MISSING** |
| getExpenseTrend | GET | /finance/trend/expense | — | — | **MISSING** |
| getProfitRate | GET | /finance/trend/profit-rate | — | — | **MISSING** |
| exportExcel | POST | /finance/reports/:id/export/excel | — | — | **MISSING** |
| exportPDF | POST | /finance/reports/:id/export/pdf | — | — | **MISSING** |
| printReport | POST | /finance/reports/:id/print | — | — | **MISSING** |

### 后端有但前端路径不匹配的路由

| 后端路径 | 后端方法 | Handler | 前端对应 |
|----------|---------|---------|---------|
| /finance/reconciliations | GET | ListFinReconciliations | 前端无此路径（用 /finance/reconciliation/supplier 等） |
| /finance/reports | GET | ListFinReports | 前端无此路径 |
| /finance/reports/generate | POST | GenerateFinReport | 前端无此路径（用 /finance/reports/balance-sheet 等） |

---

## 8. Payment 模块（api/payment.js）

| 前端函数 | 方法 | 前端路径 | 后端路径 | 后端方法 | 状态 |
|----------|------|---------|---------|---------|------|
| getMerchants | GET | /payment/merchants | /payment/merchants | GET | MATCH |
| getMerchantDetail | GET | /payment/merchants/:id | /payment/merchants/:id | GET | MATCH |
| createMerchant | POST | /payment/merchants | /payment/merchants | POST | MATCH |
| updateMerchant | PUT | /payment/merchants/:id | /payment/merchants/:id | PUT | MATCH |
| setFeeRate | PUT | /payment/merchants/:id/fee-rate | /payment/merchants/:id/fee-rate | PUT | MATCH |
| manageSettlementAccount | PUT | /payment/merchants/:id/settlement-account | /payment/merchants/:id/settlement-account | PUT | MATCH |
| getReceipts | GET | /payment/receipts | /payment/receipts | GET | MATCH |
| getReceiptDetail | GET | /payment/receipts/:id | /payment/receipts/:id | GET | MATCH |
| dailyReconciliation | POST | /payment/reconciliation/daily | /payment/receipts/daily-summary | GET | **PATH+METHOD DIFF** |
| monthlyReconciliation | POST | /payment/reconciliation/monthly | /payment/receipts/monthly-summary | GET | **PATH+METHOD DIFF** |
| markAbnormalReceipt | PUT | /payment/receipts/:id/abnormal | /payment/receipts/:id/mark-abnormal | PUT | **PATH DIFF** |
| processAbnormal | PUT | /payment/receipts/:id/process-abnormal | /payment/receipts/:id/process-abnormal | PUT | MATCH |
| getSettlementConfig | GET | /payment/settlement/config | /payment/settlement/config | GET | MATCH |
| getSettlementReports | GET | /payment/settlement/reports | /payment/settlement/reports | GET | MATCH |
| executeSettlement | POST | /payment/settlement/execute | /payment/settlement/execute | POST | MATCH |
| notifySettlement | POST | /payment/settlement/:id/notify | /payment/settlement/notify | POST | **PATH DIFF** |

> **关键差异**:
> - dailyReconciliation: 前端 POST `/payment/reconciliation/daily` vs 后端 GET `/payment/receipts/daily-summary`
> - monthlyReconciliation: 前端 POST `/payment/reconciliation/monthly` vs 后端 GET `/payment/receipts/monthly-summary`
> - markAbnormalReceipt: 前端 `/payment/receipts/:id/abnormal` vs 后端 `/payment/receipts/:id/mark-abnormal`
> - notifySettlement: 前端 `/payment/settlement/:id/notify` vs 后端 `/payment/settlement/notify`（无 :id）

---

## 9. Operations 模块（api/operations.js）

| 前端函数 | 方法 | 前端路径 | 后端路径 | 后端方法 | 状态 |
|----------|------|---------|---------|---------|------|
| getProducts | GET | /operations/products | /operations/products | GET | MATCH |
| getProductDetail | GET | /operations/products/:id | /operations/products/:id | GET | MATCH |
| createProduct | POST | /operations/products | /operations/products | POST | MATCH |
| updateProduct | PUT | /operations/products/:id | /operations/products/:id | PUT | MATCH |
| updateProductStatus | PUT | /operations/products/:id/status | /operations/products/:id/status | PUT | MATCH |
| syncStock | PUT | /operations/products/:id/sync-stock | — | — | **MISSING** |
| getCategories | GET | /operations/categories | /operations/categories | GET | MATCH |
| createCategory | POST | /operations/categories | /operations/categories | POST | MATCH |
| updateCategory | PUT | /operations/categories/:id | /operations/categories/:id | PUT | MATCH |
| getPromotions | GET | /operations/promotions | /operations/promotions | GET | MATCH |
| createPromotion | POST | /operations/promotions | /operations/promotions | POST | MATCH |
| updatePromotion | PUT | /operations/promotions/:id | /operations/promotions/:id | PUT | MATCH |
| getPromotionStatistics | GET | /operations/promotions/:id/statistics | /operations/promotions/:id/statistics | GET | MATCH |
| getCoupons | GET | /operations/coupons | /operations/coupons | GET | MATCH |
| createCoupon | POST | /operations/coupons | /operations/coupons | POST | MATCH |
| getCouponStatistics | GET | /operations/coupons/statistics | — | — | **MISSING** |
| getSeckillConfig | GET | /operations/seckill/config | /operations/seckill/config | GET | MATCH |
| updateSeckillConfig | PUT | /operations/seckill/config | — | — | **MISSING** |
| getMerchantApplications | GET | /operations/merchant-applications | /operations/merchant-applications | GET | MATCH |
| reviewMerchant | PUT | /operations/merchant-applications/:id/review | /operations/merchant-applications/:id/review | PUT | MATCH |

### 后端有但前端未调用的路由

| 后端路径 | 后端方法 | Handler | 前端缺失 |
|----------|---------|---------|---------|
| /operations/merchant-applications/:id | GET | GetOpsMerchantApplication | 无前端函数 |

---

## 10. Data-Center 模块（api/data-center.js）

| 前端函数 | 方法 | 前端路径 | 后端路径 | 后端方法 | 状态 |
|----------|------|---------|---------|---------|------|
| queryData | GET | /data-center/query | /data-center/query | POST | **METHOD DIFF** |
| getRealtimeData | GET | /data-center/realtime | /data-center/realtime | GET | MATCH |
| getHistoryData | GET | /data-center/history | /data-center/history | GET | MATCH |
| getSalesAnalysis | GET | /data-center/analysis/sales | /data-center/analysis/sales | GET | MATCH |
| getUserAnalysis | GET | /data-center/analysis/user | /data-center/analysis/user | GET | MATCH |
| getProductAnalysis | GET | /data-center/analysis/product | /data-center/analysis/product | GET | MATCH |
| getChannelAnalysis | GET | /data-center/analysis/channel | /data-center/analysis/channel | GET | MATCH |
| getReportTemplates | GET | /data-center/report/templates | /data-center/report/templates | GET | MATCH |
| generateReport | POST | /data-center/report/generate | /data-center/report/generate | POST | MATCH |
| exportReport | POST | /data-center/report/:id/export | /data-center/report/:id/export | GET | **METHOD DIFF** |
| getAutoExportConfig | GET | /data-center/report/auto-export | /data-center/auto-export/config | GET | **PATH DIFF** |
| updateAutoExportConfig | PUT | /data-center/report/auto-export | /data-center/auto-export/config | PUT | **PATH DIFF** |

> **关键差异**:
> - queryData: 前端 GET vs 后端 POST
> - exportReport: 前端 POST vs 后端 GET
> - auto-export: 前端 `/data-center/report/auto-export` vs 后端 `/data-center/auto-export/config`

---

## 11. Direct-Delivery 模块（api/direct-delivery.js）

| 前端函数 | 方法 | 前端路径 | 后端路径 | 后端方法 | 状态 |
|----------|------|---------|---------|---------|------|
| getRoutes | GET | /direct-delivery/routes | /direct-delivery/routes | GET | MATCH |
| createRoute | POST | /direct-delivery/routes | /direct-delivery/routes | POST | MATCH |
| updateRoute | PUT | /direct-delivery/routes/:id | /direct-delivery/routes/:id | PUT | MATCH |
| deleteRoute | DELETE | /direct-delivery/routes/:id | — | — | **MISSING** |
| optimizeRoute | POST | /direct-delivery/routes/:id/optimize | /direct-delivery/routes/optimize | POST | **PATH DIFF** |
| getStations | GET | /direct-delivery/stations | /direct-delivery/stations | GET | MATCH |
| createStation | POST | /direct-delivery/stations | /direct-delivery/stations | POST | MATCH |
| updateStation | PUT | /direct-delivery/stations/:id | — | — | **MISSING** |
| assignTask | POST | /direct-delivery/tasks/assign | /direct-delivery/tasks/assign | POST | MATCH |
| autoAssign | POST | /direct-delivery/tasks/auto-assign | /direct-delivery/tasks/auto-assign | POST | MATCH |
| trackDeliveryStatus | GET | /direct-delivery/tasks/:id/status | /direct-delivery/tasks/:id/status | PUT | **METHOD DIFF** |
| handleException | PUT | /direct-delivery/tasks/:id/exception | /direct-delivery/tasks/:id/exception | POST | **METHOD DIFF** |
| confirmDelivery | PUT | /direct-delivery/tasks/:id/confirm | /direct-delivery/tasks/:id/confirm | PUT | MATCH |
| getRealtimeTrack | GET | /direct-delivery/tracking/realtime | /direct-delivery/tracking/realtime/:taskId | GET | **PATH DIFF** |
| getHistoryTrack | GET | /direct-delivery/tracking/history | /direct-delivery/tracking/history/:taskId | GET | **PATH DIFF** |
| getDeliveryTimeAnalysis | GET | /direct-delivery/tracking/time-analysis | — | — | **MISSING** |
| getTrackAbnormalWarning | GET | /direct-delivery/tracking/abnormal-warning | — | — | **MISSING** |

### 后端有但前端未调用的路由

| 后端路径 | 后端方法 | Handler | 前端缺失 |
|----------|---------|---------|---------|
| /direct-delivery/tasks | GET | ListDDTasks | 无前端函数 |

---

## 12. Supplier 模块（api/supplier.js）

| 前端函数 | 方法 | 前端路径 | 后端路径 | 后端方法 | 状态 |
|----------|------|---------|---------|---------|------|
| getSupplierOrders | GET | /supplier/orders | /supplier/orders | GET | MATCH |
| confirmOrder | PUT | /supplier/orders/:id/confirm | /supplier/orders/:id/confirm | PUT | MATCH |
| updateOrderStatus | PUT | /supplier/orders/:id/status | — | — | **MISSING** |
| handleOrderException | PUT | /supplier/orders/:id/exception | — | — | **MISSING** |
| createShippingOrder | POST | /supplier/shipping | /supplier/shipping | POST | MATCH |
| inputLogistics | PUT | /supplier/shipping/:id/logistics | — | — | **MISSING** |
| trackShipping | GET | /supplier/shipping/:id/track | — | — | **MISSING** |
| handleShippingException | PUT | /supplier/shipping/:id/exception | — | — | **MISSING** |
| getMonthlyReconciliation | GET | /supplier/reconciliation/monthly | /supplier/reconciliation | GET | **PATH DIFF** |
| processReconciliationDifference | PUT | /supplier/reconciliation/:id/difference | — | — | **MISSING** |
| confirmReconciliation | PUT | /supplier/reconciliation/:id/confirm | /supplier/reconciliation/:id/confirm | PUT | MATCH |
| queryPaymentProgress | GET | /supplier/reconciliation/:id/payment | — | — | **MISSING** |

### 后端有但前端未调用的路由

| 后端路径 | 后端方法 | Handler | 前端缺失 |
|----------|---------|---------|---------|
| /supplier/orders/:id | GET | GetSupplierOrder | 无前端函数 |
| /supplier/orders/:id/ship | PUT | ShipSupplierOrder | 无前端函数 |

---

## 13. Mall 模块（后端有路由，前端无 api/mall.js）

> 后端注册了 `/api/mall/...` 路由组，但前端 `src/api/` 目录下没有 mall.js

| 后端路径 | 后端方法 | Handler | 前端缺失 |
|----------|---------|---------|---------|
| /mall/products | GET | ListProducts | 无前端 API 文件 |
| /mall/products/:id | GET | GetProduct | 无前端 API 文件 |
| /mall/categories | GET | ListCategories | 无前端 API 文件 |
| /mall/home/banner | GET | ListBanners | 无前端 API 文件 |
| /mall/home/announcements | GET | ListAnnouncements | 无前端 API 文件 |
| /mall/home/recommend | GET | RecommendProducts | 无前端 API 文件 |
| /mall/cart | GET | GetCart | 无前端 API 文件 |
| /mall/cart/items | POST | AddCartItem | 无前端 API 文件 |
| /mall/cart/items/:id | PUT | UpdateCartItem | 无前端 API 文件 |
| /mall/cart/items/:id | DELETE | DeleteCartItem | 无前端 API 文件 |
| /mall/orders | GET | ListMallOrders | 无前端 API 文件 |
| /mall/orders/:id | GET | GetMallOrder | 无前端 API 文件 |
| /mall/orders | POST | CreateMallOrder | 无前端 API 文件 |
| /mall/orders/:id/pay | POST | PayOrder | 无前端 API 文件 |
| /mall/after-sales | GET | ListMallAfterSales | 无前端 API 文件 |
| /mall/after-sales | POST | CreateMallAfterSale | 无前端 API 文件 |
| /mall/vip/purchase | POST | PurchaseVip | 无前端 API 文件 |
| /mall/vip/info | GET | GetVipInfo | 无前端 API 文件 |
| /mall/customer-service/phone | GET | GetCSPhone | 无前端 API 文件 |
| /mall/customer-service/feedback | POST | CreateFeedback | 无前端 API 文件 |

---

## Store 函数名与 API 函数名对照

### sales store
| Store 函数 | API 函数 | 前端路径 |
|-----------|---------|---------|
| fetchVisits | getVisits | GET /sales/visits |
| fetchVisitDetail | getVisitDetail | GET /sales/visits/:id |
| createVisit | createVisit | POST /sales/visits |
| updateVisit | updateVisit | PUT /sales/visits/:id |
| deleteVisit | deleteVisit | DELETE /sales/visits/:id |
| fetchVisitStatistics | getVisitStatistics | GET /sales/visits/statistics |
| fetchUnclaimedStores | getUnclaimedStores | GET /sales/stores/unclaimed |
| fetchReviewStores | getReviewStores | GET /sales/stores/review |
| fetchStoreDetail | getStoreDetail | GET /sales/stores/:id |
| claimStore | claimStore | POST /sales/stores/:id/claim |
| reviewStore | reviewStore | POST /sales/stores/:id/review |
| assignStore | assignStore | POST /sales/stores/:id/assign |
| fetchPublicCustomers | getPublicCustomers | GET /sales/customers/public |
| fetchPrivateCustomers | getPrivateCustomers | GET /sales/customers/private |
| fetchCustomerDetail | getCustomerDetail | GET /sales/customers/:id |
| claimCustomer | claimCustomer | POST /sales/customers/:id/claim |
| returnCustomer | returnCustomer | POST /sales/customers/:id/return |
| transferCustomer | transferCustomer | POST /sales/customers/:id/transfer |
| searchCustomers | searchCustomers | GET /sales/customers/search |
| fetchComplaints | getComplaints | GET /customer-service/complaints |
| fetchSpecialStockRequests | getSpecialStockRequests | GET /sales/special-stock-requests |
| fetchBlacklist | getBlacklist | GET /sales/blacklist |

### hr store
| Store 函数 | API 函数 | 前端路径 |
|-----------|---------|---------|
| fetchEmployees | getEmployees | GET /hr/employees |
| fetchEmployeeDetail | getEmployeeDetail | GET /hr/employees/:id |
| createEmployee | createEmployee | POST /hr/employees |
| updateEmployee | updateEmployee | PUT /hr/employees/:id |
| fetchAttendance | getAttendance | GET /hr/attendance |
| checkIn | checkIn | POST /hr/attendance/check-in |
| checkOut | checkOut | POST /hr/attendance/check-out |
| fetchPerformance | getPerformance | GET /hr/performance |
| createPerformance | createPerformance | POST /hr/performance |
| updatePerformance | updatePerformance | PUT /hr/performance/:id |

> 注意: hr store 没有 getLeaveApplications / approveLeave 的调用（API 文件中有定义但 store 未使用）

---

## 汇总：前端函数后端无对应路由的完整列表

### MISSING（后端完全无路由）

| 模块 | 前端函数 | 方法 | 前端路径 |
|------|---------|------|---------|
| HR | getEmployeeDetail | GET | /hr/employees/:id |
| HR | createEmployee | POST | /hr/employees |
| HR | updateEmployee | PUT | /hr/employees/:id |
| HR | getLeaveApplications | GET | /hr/leave-applications |
| HR | approveLeave | PUT | /hr/leave-applications/:id/approve |
| HR | createPerformance | POST | /hr/performance |
| HR | updatePerformance | PUT | /hr/performance/:id |
| CS | modifyPrice | PUT | /customer-service/orders/:id/modify-price |
| CS | trackOrder | GET | /customer-service/orders/:id/track |
| CS | rejectAfterSale | PUT | /customer-service/after-sales/:id/reject |
| CS | assignComplaint | PUT | /customer-service/complaints/:id/assign |
| CS | replyComplaint | PUT | /customer-service/complaints/:id/reply |
| CS | getReviewStatistics | GET | /customer-service/reviews/statistics |
| CS | getFeedbackStatistics | GET | /customer-service/feedbacks/statistics |
| CS | mailInvoice | PUT | /customer-service/invoices/:id/mail |
| CW | confirmOutbound | PUT | /cloud-warehouse/outbound/:id/confirm |
| CW | getReturnOutbound | GET | /cloud-warehouse/outbound/return |
| CW | getManualOutbound | GET | /cloud-warehouse/outbound/manual |
| CW | confirmInbound | PUT | /cloud-warehouse/inbound/:id/confirm |
| CW | getReturnInbound | GET | /cloud-warehouse/inbound/return |
| CW | getManualInbound | GET | /cloud-warehouse/inbound/manual |
| CW | getBatchInventory | GET | /cloud-warehouse/inventory/batch |
| CW | getLocationInventory | GET | /cloud-warehouse/inventory/location |
| CW | createCheckPlan | POST | /cloud-warehouse/inventory/check-plan |
| CW | processCheckDifference | PUT | /cloud-warehouse/inventory/check/:id/difference |
| CW | getLowStockWarning | GET | /cloud-warehouse/inventory/low-stock |
| CW | getExpiryWarning | GET | /cloud-warehouse/inventory/expiry |
| CW | createUnloadingRecord | POST | /cloud-warehouse/admin/unloading |
| CW | getSchedule | GET | /cloud-warehouse/admin/schedule |
| CW | getVehicles | GET | /cloud-warehouse/admin/vehicles |
| CW | getDrivers | GET | /cloud-warehouse/admin/drivers |
| Finance | createTransaction | POST | /finance/transactions |
| Finance | updateTransaction | PUT | /finance/transactions/:id |
| Finance | getTransactionSummary | GET | /finance/transactions/summary |
| Finance | getCategories | GET | /finance/categories |
| Finance | createCategory | POST | /finance/categories |
| Finance | getCategoryStatistics | GET | /finance/categories/:id/statistics |
| Finance | calculateCost | POST | /finance/cost/calculate |
| Finance | getOperatingCost | GET | /finance/cost/operating |
| Finance | getLaborCost | GET | /finance/cost/labor |
| Finance | importBankStatement | POST | /finance/bank-statement/import |
| Finance | matchStatement | PUT | /finance/bank-statement/:id/match |
| Finance | markDifference | PUT | /finance/bank-statement/:id/difference |
| Finance | getSupplierReconciliation | GET | /finance/reconciliation/supplier |
| Finance | getCustomerReconciliation | GET | /finance/reconciliation/customer |
| Finance | processReconciliationDifference | PUT | /finance/reconciliation/:id/difference |
| Finance | confirmReconciliation | PUT | /finance/reconciliation/:id/confirm |
| Finance | generateBalanceSheet | POST | /finance/reports/balance-sheet |
| Finance | generateIncomeStatement | POST | /finance/reports/income-statement |
| Finance | generateCashFlowStatement | POST | /finance/reports/cash-flow |
| Finance | getIncomeTrend | GET | /finance/trend/income |
| Finance | getExpenseTrend | GET | /finance/trend/expense |
| Finance | getProfitRate | GET | /finance/trend/profit-rate |
| Finance | exportExcel | POST | /finance/reports/:id/export/excel |
| Finance | exportPDF | POST | /finance/reports/:id/export/pdf |
| Finance | printReport | POST | /finance/reports/:id/print |
| OPS | syncStock | PUT | /operations/products/:id/sync-stock |
| OPS | getCouponStatistics | GET | /operations/coupons/statistics |
| OPS | updateSeckillConfig | PUT | /operations/seckill/config |
| DD | deleteRoute | DELETE | /direct-delivery/routes/:id |
| DD | updateStation | PUT | /direct-delivery/stations/:id |
| DD | getDeliveryTimeAnalysis | GET | /direct-delivery/tracking/time-analysis |
| DD | getTrackAbnormalWarning | GET | /direct-delivery/tracking/abnormal-warning |
| Supplier | updateOrderStatus | PUT | /supplier/orders/:id/status |
| Supplier | handleOrderException | PUT | /supplier/orders/:id/exception |
| Supplier | inputLogistics | PUT | /supplier/shipping/:id/logistics |
| Supplier | trackShipping | GET | /supplier/shipping/:id/track |
| Supplier | handleShippingException | PUT | /supplier/shipping/:id/exception |
| Supplier | processReconciliationDifference | PUT | /supplier/reconciliation/:id/difference |
| Supplier | queryPaymentProgress | GET | /supplier/reconciliation/:id/payment |
| Mall | (整个模块) | — | 前端无 api/mall.js |

### PATH DIFF（路径不匹配）

| 模块 | 前端函数 | 前端方法 | 前端路径 | 后端路径 | 后端方法 |
|------|---------|---------|---------|---------|---------|
| Auth | getUserInfo | GET | /auth/user-info | /auth/userinfo | GET |
| CS | auditInvoice | PUT | /customer-service/invoices/:id/audit | /customer-service/invoices/:id/approve | PUT |
| Payment | dailyReconciliation | POST | /payment/reconciliation/daily | /payment/receipts/daily-summary | GET |
| Payment | monthlyReconciliation | POST | /payment/reconciliation/monthly | /payment/receipts/monthly-summary | GET |
| Payment | markAbnormalReceipt | PUT | /payment/receipts/:id/abnormal | /payment/receipts/:id/mark-abnormal | PUT |
| Payment | notifySettlement | POST | /payment/settlement/:id/notify | /payment/settlement/notify | POST |
| DC | getAutoExportConfig | GET | /data-center/report/auto-export | /data-center/auto-export/config | GET |
| DC | updateAutoExportConfig | PUT | /data-center/report/auto-export | /data-center/auto-export/config | PUT |
| DD | optimizeRoute | POST | /direct-delivery/routes/:id/optimize | /direct-delivery/routes/optimize | POST |
| DD | getRealtimeTrack | GET | /direct-delivery/tracking/realtime | /direct-delivery/tracking/realtime/:taskId | GET |
| DD | getHistoryTrack | GET | /direct-delivery/tracking/history | /direct-delivery/tracking/history/:taskId | GET |
| Supplier | getMonthlyReconciliation | GET | /supplier/reconciliation/monthly | /supplier/reconciliation | GET |

### METHOD DIFF（方法不匹配但路径近似）

| 模块 | 前端函数 | 前端方法 | 前端路径 | 后端方法 | 后端路径 |
|------|---------|---------|---------|---------|---------|
| DC | queryData | GET | /data-center/query | POST | /data-center/query |
| DC | exportReport | POST | /data-center/report/:id/export | GET | /data-center/report/:id/export |
| DD | trackDeliveryStatus | GET | /direct-delivery/tasks/:id/status | PUT | /direct-delivery/tasks/:id/status |
| DD | handleException | PUT | /direct-delivery/tasks/:id/exception | POST | /direct-delivery/tasks/:id/exception |

---

## 统计

| 模块 | MATCH | MISSING | PATH DIFF | METHOD DIFF |
|------|-------|---------|-----------|-------------|
| Auth | 1 | 0 | 1 | 0 |
| Sales | 22 | 0 | 0 | 0 |
| HR | 4 | 6 | 0 | 0 |
| Customer-Service | 21 | 7 | 1 | 0 |
| Cloud-Warehouse | 5 | 13 | 0 | 0 |
| Procurement | 19 | 0 | 0 | 0 |
| Finance | 1 | 25 | 0 | 0 |
| Payment | 10 | 0 | 4 | 0 |
| Operations | 16 | 3 | 0 | 0 |
| Data-Center | 7 | 0 | 2 | 2 |
| Direct-Delivery | 7 | 4 | 3 | 2 |
| Supplier | 4 | 7 | 1 | 0 |
| Mall | 0 | 20(整个模块) | 0 | 0 |