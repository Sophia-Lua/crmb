import { get, post, put } from '@/api/request'

export const getMerchants = (params) => get('/payment/merchants', params)
export const getMerchantDetail = (id) => get(`/payment/merchants/${id}`)
export const createMerchant = (data) => post('/payment/merchants', data)
export const updateMerchant = (id, data) => put(`/payment/merchants/${id}`, data)
export const setFeeRate = (id, data) => put(`/payment/merchants/${id}/fee-rate`, data)
export const manageSettlementAccount = (id, data) => put(`/payment/merchants/${id}/settlement-account`, data)

export const getReceipts = (params) => get('/payment/receipts', params)
export const getReceiptDetail = (id) => get(`/payment/receipts/${id}`)
export const dailyReconciliation = (data) => post('/payment/reconciliation/daily', data)
export const monthlyReconciliation = (data) => post('/payment/reconciliation/monthly', data)
export const markAbnormalReceipt = (id, data) => put(`/payment/receipts/${id}/abnormal`, data)
export const processAbnormal = (id, data) => put(`/payment/receipts/${id}/process-abnormal`, data)

export const getSettlementConfig = () => get('/payment/settlement/config')
export const getSettlementReports = (params) => get('/payment/settlement/reports', params)
export const executeSettlement = (data) => post('/payment/settlement/execute', data)
export const notifySettlement = (id) => post(`/payment/settlement/${id}/notify`)