import request from '../request'

// 拜访记录 API
export function getVisits(params: Record<string, any>) {
  return request({
    url: '/api/sales/visits',
    method: 'get',
    params
  })
}

export function getVisitDetail(id: string) {
  return request({
    url: `/api/sales/visits/${id}`,
    method: 'get'
  })
}

export function createVisit(data: Record<string, any>) {
  return request({
    url: '/api/sales/visits',
    method: 'post',
    data
  })
}

export function updateVisit(id: string, data: Record<string, any>) {
  return request({
    url: `/api/sales/visits/${id}`,
    method: 'put',
    data
  })
}

export function deleteVisit(id: string) {
  return request({
    url: `/api/sales/visits/${id}`,
    method: 'delete'
  })
}

export function getVisitStatistics() {
  return request({
    url: '/api/sales/visits/statistics',
    method: 'get'
  })
}

// 店铺管理 API
export function getUnclaimedStores(params: Record<string, any>) {
  return request({
    url: '/api/sales/stores/unclaimed',
    method: 'get',
    params
  })
}

export function getReviewStores(params: Record<string, any>) {
  return request({
    url: '/api/sales/stores/review',
    method: 'get',
    params
  })
}

export function getStoreDetail(id: string) {
  return request({
    url: `/api/sales/stores/${id}`,
    method: 'get'
  })
}

export function claimStore(id: string) {
  return request({
    url: `/api/sales/stores/${id}/claim`,
    method: 'post'
  })
}

export function reviewStore(id: string, data: Record<string, any>) {
  return request({
    url: `/api/sales/stores/${id}/review`,
    method: 'post',
    data
  })
}

export function assignStore(id: string, data: Record<string, any>) {
  return request({
    url: `/api/sales/stores/${id}/assign`,
    method: 'post',
    data
  })
}

export function getStoreStatistics() {
  return request({
    url: '/api/sales/stores/statistics',
    method: 'get'
  })
}

// 客户管理 API
export function getPublicCustomers(params: Record<string, any>) {
  return request({
    url: '/api/sales/customers/public',
    method: 'get',
    params
  })
}

export function getPrivateCustomers(params: Record<string, any>) {
  return request({
    url: '/api/sales/customers/private',
    method: 'get',
    params
  })
}

export function getCustomerDetail(id: string) {
  return request({
    url: `/api/sales/customers/${id}`,
    method: 'get'
  })
}

export function claimCustomer(id: string) {
  return request({
    url: `/api/sales/customers/${id}/claim`,
    method: 'post'
  })
}

export function returnCustomerToPublic(id: string) {
  return request({
    url: `/api/sales/customers/${id}/return`,
    method: 'post'
  })
}

export function transferCustomer(id: string, data: Record<string, any>) {
  return request({
    url: `/api/sales/customers/${id}/transfer`,
    method: 'post',
    data
  })
}

export function searchCustomers(params: Record<string, any>) {
  return request({
    url: '/api/sales/customers/search',
    method: 'get',
    params
  })
}

// 销售地图 API
export function getMapCustomers(params: Record<string, any>) {
  return request({
    url: '/api/sales/map/customers',
    method: 'get',
    params
  })
}

export function getUnregisteredStores(params: Record<string, any>) {
  return request({
    url: '/api/sales/map/unregistered',
    method: 'get',
    params
  })
}

export function getMapMarkerDetail(id: string) {
  return request({
    url: `/api/sales/markers/${id}`,
    method: 'get'
  })
}

// 其他子模块 API
export function getComplaints(params: Record<string, any>) {
  return request({
    url: '/api/sales/complaints',
    method: 'get',
    params
  })
}

export function getSpecialStockRequests(params: Record<string, any>) {
  return request({
    url: '/api/sales/special-stock-requests',
    method: 'get',
    params
  })
}

export function getBlacklist(params: Record<string, any>) {
  return request({
    url: '/api/sales/blacklist',
    method: 'get',
    params
  })
}
