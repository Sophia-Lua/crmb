import { get, post, put } from '@/api/request'

export const getOutboundOrders = (params) => get('/cloud-warehouse/outbound', params)
export const createOutboundOrder = (data) => post('/cloud-warehouse/outbound', data)
export const confirmOutbound = (id) => put(`/cloud-warehouse/outbound/${id}/confirm`)
export const getReturnOutbound = (params) => get('/cloud-warehouse/outbound/return', params)
export const getManualOutbound = (params) => get('/cloud-warehouse/outbound/manual', params)

export const getInboundOrders = (params) => get('/cloud-warehouse/inbound', params)
export const createInboundOrder = (data) => post('/cloud-warehouse/inbound', data)
export const confirmInbound = (id) => put(`/cloud-warehouse/inbound/${id}/confirm`)
export const getReturnInbound = (params) => get('/cloud-warehouse/inbound/return', params)
export const getManualInbound = (params) => get('/cloud-warehouse/inbound/manual', params)

export const getInventory = (params) => get('/cloud-warehouse/inventory', params)
export const getBatchInventory = (params) => get('/cloud-warehouse/inventory/batch', params)
export const getLocationInventory = (params) => get('/cloud-warehouse/inventory/location', params)
export const createCheckPlan = (data) => post('/cloud-warehouse/inventory/check-plan', data)
export const executeCheck = (data) => post('/cloud-warehouse/inventory/check', data)
export const processCheckDifference = (id, data) => put(`/cloud-warehouse/inventory/check/${id}/difference`, data)
export const getLowStockWarning = () => get('/cloud-warehouse/inventory/low-stock')
export const getExpiryWarning = () => get('/cloud-warehouse/inventory/expiry')

export const getUnloadingPlan = () => get('/cloud-warehouse/admin/unloading')
export const createUnloadingRecord = (data) => post('/cloud-warehouse/admin/unloading', data)
export const getSchedule = () => get('/cloud-warehouse/admin/schedule')
export const getVehicles = () => get('/cloud-warehouse/admin/vehicles')
export const getDrivers = () => get('/cloud-warehouse/admin/drivers')