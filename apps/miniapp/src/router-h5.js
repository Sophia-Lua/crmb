import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/pages/index/index' },
  { path: '/pages/index/index', component: () => import('./pages/index/index.vue') },
  { path: '/pages/category/index', component: () => import('./pages/category/index.vue') },
  { path: '/pages/cart/index', component: () => import('./pages/cart/index.vue') },
  { path: '/pages/order/list', component: () => import('./pages/order/list.vue') },
  { path: '/pages/mine/index', component: () => import('./pages/mine/index.vue') },
  { path: '/pages/sales/visits/list', component: () => import('./pages/sales/visits/list.vue') },
  { path: '/pages/sales/visits/detail', component: () => import('./pages/sales/visits/detail.vue') },
  { path: '/pages/sales/visits/create', component: () => import('./pages/sales/visits/create.vue') },
  { path: '/pages/sales/stores/unclaimed', component: () => import('./pages/sales/stores/unclaimed.vue') },
  { path: '/pages/sales/stores/detail', component: () => import('./pages/sales/stores/detail.vue') },
  { path: '/pages/sales/stores/review', component: () => import('./pages/sales/stores/review.vue') },
  { path: '/pages/sales/customers/public', component: () => import('./pages/sales/customers/public.vue') },
  { path: '/pages/sales/customers/private', component: () => import('./pages/sales/customers/private.vue') },
  { path: '/pages/sales/customers/detail', component: () => import('./pages/sales/customers/detail.vue') },
  { path: '/pages/sales/map/index', component: () => import('./pages/sales/map/index.vue') },
  { path: '/pages/sales/complaints/list', component: () => import('./pages/sales/complaints/list.vue') },
  { path: '/pages/sales/special-stock/list', component: () => import('./pages/sales/special-stock/list.vue') },
  { path: '/pages/sales/blacklist/list', component: () => import('./pages/sales/blacklist/list.vue') },
  { path: '/pages/order/detail', component: () => import('./pages/order/detail.vue') },
  { path: '/pages/search/index', component: () => import('./pages/search/index.vue') },
  { path: '/pages/product/detail', component: () => import('./pages/product/detail.vue') },
  { path: '/pages/address/list', component: () => import('./pages/address/list.vue') },
  { path: '/pages/address/edit', component: () => import('./pages/address/edit.vue') },
  { path: '/pages/vip/index', component: () => import('./pages/vip/index.vue') },
  { path: '/pages/payment/index', component: () => import('./pages/payment/index.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router