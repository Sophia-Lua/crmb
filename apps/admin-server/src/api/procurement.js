import { get, post, put } from '@/api/request'

export const getSuppliers = (params) => get('/procurement/suppliers', params)
export const getSupplierDetail = (id) => get(`/procurement/suppliers/${id}`)
export const createSupplier = (data) => post('/procurement/suppliers', data)
export const updateSupplier = (id, data) => put(`/procurement/suppliers/${id}`, data)
export const auditSupplier = (id, data) => put(`/procurement/suppliers/${id}/audit`, data)
export const getSupplierRating = (id) => get(`/procurement/suppliers/${id}/rating`)

export const getPurchaseRequests = (params) => get('/procurement/purchase-requests', params)
export const createPurchaseRequest = (data) => post('/procurement/purchase-requests', data)
export const approvePurchaseRequest = (id, data) => put(`/procurement/purchase-requests/${id}/approve`, data)

export const getPurchaseOrders = (params) => get('/procurement/purchase-orders', params)
export const createPurchaseOrder = (data) => post('/procurement/purchase-orders', data)
export const approvePurchaseOrder = (id, data) => put(`/procurement/purchase-orders/${id}/approve`, data)
export const trackPurchaseOrder = (id) => get(`/procurement/purchase-orders/${id}/track`)

export const getPayableAccounts = (params) => get('/procurement/payable-accounts', params)
export const generateReconciliation = (data) => post('/procurement/reconciliation/generate', data)
export const confirmReconciliation = (id) => put(`/procurement/reconciliation/${id}/confirm`)
export const createPaymentRequest = (data) => post('/procurement/payment-requests', data)
export const approvePayment = (id, data) => put(`/procurement/payment-requests/${id}/approve`, data)
export const executePayment = (id) => put(`/procurement/payment-requests/${id}/execute`)