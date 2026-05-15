import { get, post, put } from '@/api/request'

export const getTransactions = (params) => get('/finance/transactions', params)
export const createTransaction = (data) => post('/finance/transactions', data)
export const updateTransaction = (id, data) => put(`/finance/transactions/${id}`, data)
export const getTransactionSummary = (params) => get('/finance/transactions/summary', params)

export const getCategories = () => get('/finance/categories')
export const createCategory = (data) => post('/finance/categories', data)
export const getCategoryStatistics = (id) => get(`/finance/categories/${id}/statistics`)

export const calculateCost = (data) => post('/finance/cost/calculate', data)
export const getOperatingCost = (params) => get('/finance/cost/operating', params)
export const getLaborCost = (params) => get('/finance/cost/labor', params)

export const importBankStatement = (data) => post('/finance/bank-statement/import', data)
export const matchStatement = (id, data) => put(`/finance/bank-statement/${id}/match`, data)
export const markDifference = (id, data) => put(`/finance/bank-statement/${id}/difference`, data)

export const getSupplierReconciliation = (params) => get('/finance/reconciliation/supplier', params)
export const getCustomerReconciliation = (params) => get('/finance/reconciliation/customer', params)
export const processReconciliationDifference = (id, data) => put(`/finance/reconciliation/${id}/difference`, data)
export const confirmReconciliation = (id) => put(`/finance/reconciliation/${id}/confirm`)

export const generateBalanceSheet = (data) => post('/finance/reports/balance-sheet', data)
export const generateIncomeStatement = (data) => post('/finance/reports/income-statement', data)
export const generateCashFlowStatement = (data) => post('/finance/reports/cash-flow', data)

export const getIncomeTrend = (params) => get('/finance/trend/income', params)
export const getExpenseTrend = (params) => get('/finance/trend/expense', params)
export const getProfitRate = (params) => get('/finance/trend/profit-rate', params)

export const exportExcel = (id) => post(`/finance/reports/${id}/export/excel`)
export const exportPDF = (id) => post(`/finance/reports/${id}/export/pdf`)
export const printReport = (id) => post(`/finance/reports/${id}/print`)