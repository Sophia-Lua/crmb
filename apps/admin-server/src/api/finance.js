import { get, post, put } from '@/api/request'

export const getTransactions = (params) => get('/finance/transactions', params)

export const getReconciliations = (params) => get('/finance/reconciliations', params)

export const getReports = (params) => get('/finance/reports', params)
export const generateReport = (data) => post('/finance/reports/generate', data)
export const exportReport = (id) => get(`/data-center/report/${id}/export`)