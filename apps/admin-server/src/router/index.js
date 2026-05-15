import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'sales/visits',
        name: 'SalesVisits',
        component: () => import('@/views/sales/VisitsList.vue'),
        meta: { title: '拜访管理' }
      },
      {
        path: 'sales/visits/create',
        name: 'VisitCreate',
        component: () => import('@/views/sales/VisitCreate.vue'),
        meta: { title: '新建拜访' }
      },
      {
        path: 'sales/visits/:id',
        name: 'VisitDetail',
        component: () => import('@/views/sales/VisitDetail.vue'),
        meta: { title: '拜访详情' }
      },
      {
        path: 'sales/stores/unclaimed',
        name: 'StoresUnclaimed',
        component: () => import('@/views/sales/StoresUnclaimed.vue'),
        meta: { title: '待领取店铺' }
      },
      {
        path: 'sales/stores/review',
        name: 'StoresReview',
        component: () => import('@/views/sales/StoresReview.vue'),
        meta: { title: '待审核店铺' }
      },
      {
        path: 'sales/customers/public',
        name: 'CustomersPublic',
        component: () => import('@/views/sales/CustomersPublic.vue'),
        meta: { title: '公海客户' }
      },
      {
        path: 'sales/customers/private',
        name: 'CustomersPrivate',
        component: () => import('@/views/sales/CustomersPrivate.vue'),
        meta: { title: '私海客户' }
      },
      {
        path: 'sales/customers/:id',
        name: 'CustomerDetail',
        component: () => import('@/views/sales/CustomerDetail.vue'),
        meta: { title: '客户详情' }
      },
      {
        path: 'sales/complaints',
        name: 'SalesComplaints',
        component: () => import('@/views/sales/ComplaintsList.vue'),
        meta: { title: '客诉管理' }
      },
      {
        path: 'sales/special-stock',
        name: 'SpecialStock',
        component: () => import('@/views/sales/SpecialStockList.vue'),
        meta: { title: '特殊备货' }
      },
      {
        path: 'sales/blacklist',
        name: 'Blacklist',
        component: () => import('@/views/sales/BlacklistList.vue'),
        meta: { title: '黑名单' }
      },
      {
        path: 'hr/employees',
        name: 'HrEmployees',
        component: () => import('@/views/hr/Employees.vue'),
        meta: { title: '员工管理' }
      },
      {
        path: 'hr/attendance',
        name: 'HrAttendance',
        component: () => import('@/views/hr/Attendance.vue'),
        meta: { title: '考勤管理' }
      },
      {
        path: 'hr/performance',
        name: 'HrPerformance',
        component: () => import('@/views/hr/Performance.vue'),
        meta: { title: '绩效管理' }
      },
      {
        path: 'customer-service/orders',
        name: 'CsOrders',
        component: () => import('@/views/customer-service/Orders.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'customer-service/after-sales',
        name: 'CsAfterSales',
        component: () => import('@/views/customer-service/AfterSales.vue'),
        meta: { title: '售后管理' }
      },
      {
        path: 'customer-service/complaints',
        name: 'CsComplaints',
        component: () => import('@/views/customer-service/Complaints.vue'),
        meta: { title: '客诉管理' }
      },
      {
        path: 'customer-service/satisfaction',
        name: 'CsSatisfaction',
        component: () => import('@/views/customer-service/Satisfaction.vue'),
        meta: { title: '客户满意度' }
      },
      {
        path: 'customer-service/invoices',
        name: 'CsInvoices',
        component: () => import('@/views/customer-service/Invoices.vue'),
        meta: { title: '发票管理' }
      },
      {
        path: 'operations/products',
        name: 'OpsProducts',
        component: () => import('@/views/operations/Products.vue'),
        meta: { title: '商品管理' }
      },
      {
        path: 'operations/promotions',
        name: 'OpsPromotions',
        component: () => import('@/views/operations/Promotions.vue'),
        meta: { title: '活动管理' }
      },
      {
        path: 'operations/merchants',
        name: 'OpsMerchants',
        component: () => import('@/views/operations/Merchants.vue'),
        meta: { title: '商家审核' }
      },
      {
        path: 'data-center/query',
        name: 'DcQuery',
        component: () => import('@/views/data-center/DataQuery.vue'),
        meta: { title: '数据查询' }
      },
      {
        path: 'data-center/analysis',
        name: 'DcAnalysis',
        component: () => import('@/views/data-center/Analysis.vue'),
        meta: { title: '统计分析' }
      },
      {
        path: 'data-center/reports',
        name: 'DcReports',
        component: () => import('@/views/data-center/Reports.vue'),
        meta: { title: '报表导出' }
      },
      {
        path: 'cloud-warehouse/outbound',
        name: 'CwOutbound',
        component: () => import('@/views/cloud-warehouse/Outbound.vue'),
        meta: { title: '出库管理' }
      },
      {
        path: 'cloud-warehouse/inbound',
        name: 'CwInbound',
        component: () => import('@/views/cloud-warehouse/Inbound.vue'),
        meta: { title: '入库管理' }
      },
      {
        path: 'cloud-warehouse/inventory',
        name: 'CwInventory',
        component: () => import('@/views/cloud-warehouse/Inventory.vue'),
        meta: { title: '库存管理' }
      },
      {
        path: 'cloud-warehouse/admin',
        name: 'CwAdmin',
        component: () => import('@/views/cloud-warehouse/WarehouseAdmin.vue'),
        meta: { title: '行政管理' }
      },
      {
        path: 'procurement/suppliers',
        name: 'ProcSuppliers',
        component: () => import('@/views/procurement/Suppliers.vue'),
        meta: { title: '供应商管理' }
      },
      {
        path: 'procurement/orders',
        name: 'ProcOrders',
        component: () => import('@/views/procurement/PurchaseOrders.vue'),
        meta: { title: '采购订单' }
      },
      {
        path: 'procurement/settlement',
        name: 'ProcSettlement',
        component: () => import('@/views/procurement/ProcurementSettlement.vue'),
        meta: { title: '结算管理' }
      },
      {
        path: 'payment/merchants',
        name: 'PayMerchants',
        component: () => import('@/views/payment/Merchants.vue'),
        meta: { title: '商家管理' }
      },
      {
        path: 'payment/receipts',
        name: 'PayReceipts',
        component: () => import('@/views/payment/Receipts.vue'),
        meta: { title: '收款管理' }
      },
      {
        path: 'payment/settlement',
        name: 'PaySettlement',
        component: () => import('@/views/payment/PaymentSettlement.vue'),
        meta: { title: '结算管理' }
      },
      {
        path: 'supplier/orders',
        name: 'SupOrders',
        component: () => import('@/views/supplier/SupplierOrders.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'supplier/shipping',
        name: 'SupShipping',
        component: () => import('@/views/supplier/Shipping.vue'),
        meta: { title: '发货管理' }
      },
      {
        path: 'supplier/reconciliation',
        name: 'SupReconciliation',
        component: () => import('@/views/supplier/Reconciliation.vue'),
        meta: { title: '对账管理' }
      },
      {
        path: 'finance/transactions',
        name: 'FinTransactions',
        component: () => import('@/views/finance/Transactions.vue'),
        meta: { title: '财务核算' }
      },
      {
        path: 'finance/reconciliation',
        name: 'FinReconciliation',
        component: () => import('@/views/finance/Reconciliation.vue'),
        meta: { title: '对账管理' }
      },
      {
        path: 'finance/reports',
        name: 'FinReports',
        component: () => import('@/views/finance/Reports.vue'),
        meta: { title: '报表管理' }
      },
      {
        path: 'direct-delivery/routes',
        name: 'DdRoutes',
        component: () => import('@/views/direct-delivery/Routes.vue'),
        meta: { title: '线路管理' }
      },
      {
        path: 'direct-delivery/tasks',
        name: 'DdTasks',
        component: () => import('@/views/direct-delivery/DeliveryTasks.vue'),
        meta: { title: '配送管理' }
      },
      {
        path: 'direct-delivery/tracking',
        name: 'DdTracking',
        component: () => import('@/views/direct-delivery/Tracking.vue'),
        meta: { title: '轨迹跟踪' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    next()
  } else if (!token) {
    next('/login')
  } else {
    next()
  }
})

export default router