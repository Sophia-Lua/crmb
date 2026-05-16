import { get, post, put, del } from '@/api/request'

export const getRoutes = (params) => get('/direct-delivery/routes', params)
export const createRoute = (data) => post('/direct-delivery/routes', data)
export const updateRoute = (id, data) => put(`/direct-delivery/routes/${id}`, data)
export const deleteRoute = (id) => del(`/direct-delivery/routes/${id}`)
export const optimizeRoute = (data) => post('/direct-delivery/routes/optimize', data)

export const getStations = (params) => get('/direct-delivery/stations', params)
export const createStation = (data) => post('/direct-delivery/stations', data)
export const updateStation = (id, data) => put(`/direct-delivery/stations/${id}`, data)

export const assignTask = (data) => post('/direct-delivery/tasks/assign', data)
export const autoAssign = () => post('/direct-delivery/tasks/auto-assign')
export const trackDeliveryStatus = (id, data) => put(`/direct-delivery/tasks/${id}/status`, data)
export const handleException = (id, data) => post(`/direct-delivery/tasks/${id}/exception`, data)
export const confirmDelivery = (id) => put(`/direct-delivery/tasks/${id}/confirm`)

export const getRealtimeTrack = (taskId) => get(`/direct-delivery/tracking/realtime/${taskId}`)
export const getHistoryTrack = (taskId) => get(`/direct-delivery/tracking/history/${taskId}`)
export const getDeliveryTimeAnalysis = (params) => get('/direct-delivery/tracking/time-analysis', params)
export const getTrackAbnormalWarning = () => get('/direct-delivery/tracking/abnormal-warning')