import { get, post, put } from '@/api/request'

export const queryData = (data) => post('/data-center/query', data)
export const getRealtimeData = (params) => get('/data-center/realtime', params)
export const getHistoryData = (params) => get('/data-center/history', params)

export const getSalesAnalysis = (params) => get('/data-center/analysis/sales', params)
export const getUserAnalysis = (params) => get('/data-center/analysis/user', params)
export const getProductAnalysis = (params) => get('/data-center/analysis/product', params)
export const getChannelAnalysis = (params) => get('/data-center/analysis/channel', params)

export const getReportTemplates = () => get('/data-center/report/templates')
export const generateReport = (data) => post('/data-center/report/generate', data)
export const exportReport = (id) => get(`/data-center/report/${id}/export`)
export const getAutoExportConfig = () => get('/data-center/auto-export/config')
export const updateAutoExportConfig = (data) => put('/data-center/auto-export/config', data)