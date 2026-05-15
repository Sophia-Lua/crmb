import { get, post, put, del } from '@/api/request'

export const getVisits = (params) => get('/sales/visits', params)
export const getVisitDetail = (id) => get(`/sales/visits/${id}`)
export const createVisit = (data) => post('/sales/visits', data)
export const updateVisit = (id, data) => put(`/sales/visits/${id}`, data)
export const deleteVisit = (id) => del(`/sales/visits/${id}`)
export const getVisitStatistics = () => get('/sales/visits/statistics')

export const getUnclaimedStores = (params) => get('/sales/stores/unclaimed', params)
export const getReviewStores = (params) => get('/sales/stores/review', params)
export const getStoreDetail = (id) => get(`/sales/stores/${id}`)
export const claimStore = (id) => post(`/sales/stores/${id}/claim`)
export const reviewStore = (id, data) => post(`/sales/stores/${id}/review`, data)
export const assignStore = (id, data) => post(`/sales/stores/${id}/assign`, data)

export const getPublicCustomers = (params) => get('/sales/customers/public', params)
export const getPrivateCustomers = (params) => get('/sales/customers/private', params)
export const getCustomerDetail = (id) => get(`/sales/customers/${id}`)
export const claimCustomer = (id) => post(`/sales/customers/${id}/claim`)
export const returnCustomer = (id) => post(`/sales/customers/${id}/return`)
export const transferCustomer = (id, data) => post(`/sales/customers/${id}/transfer`, data)
export const searchCustomers = (params) => get('/sales/customers/search', params)

export const getComplaints = (params) => get('/customer-service/complaints', params)
export const getSpecialStockRequests = (params) => get('/sales/special-stock-requests', params)
export const getBlacklist = (params) => get('/sales/blacklist', params)