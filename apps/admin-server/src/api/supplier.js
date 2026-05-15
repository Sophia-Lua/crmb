import { get, post, put } from '@/api/request'

export const getSupplierOrders = (params) => get('/supplier/orders', params)
export const confirmOrder = (id) => put(`/supplier/orders/${id}/confirm`)
export const updateOrderStatus = (id, data) => put(`/supplier/orders/${id}/status`, data)
export const handleOrderException = (id, data) => put(`/supplier/orders/${id}/exception`, data)

export const createShippingOrder = (data) => post('/supplier/shipping', data)
export const inputLogistics = (id, data) => put(`/supplier/shipping/${id}/logistics`, data)
export const trackShipping = (id) => get(`/supplier/shipping/${id}/track`)
export const handleShippingException = (id, data) => put(`/supplier/shipping/${id}/exception`, data)

export const getMonthlyReconciliation = (params) => get('/supplier/reconciliation/monthly', params)
export const processReconciliationDifference = (id, data) => put(`/supplier/reconciliation/${id}/difference`, data)
export const confirmReconciliation = (id) => put(`/supplier/reconciliation/${id}/confirm`)
export const queryPaymentProgress = (id) => get(`/supplier/reconciliation/${id}/payment`)