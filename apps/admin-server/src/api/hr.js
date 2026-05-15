import { get, post, put } from '@/api/request'

export const getEmployees = (params) => get('/hr/employees', params)
export const getEmployeeDetail = (id) => get(`/hr/employees/${id}`)
export const createEmployee = (data) => post('/hr/employees', data)
export const updateEmployee = (id, data) => put(`/hr/employees/${id}`, data)

export const getAttendance = (params) => get('/hr/attendance', params)
export const checkIn = () => post('/hr/attendance/check-in')
export const checkOut = () => post('/hr/attendance/check-out')
export const getLeaveApplications = (params) => get('/hr/leave-applications', params)
export const approveLeave = (id, data) => put(`/hr/leave-applications/${id}/approve`, data)

export const getPerformance = (params) => get('/hr/performance', params)
export const createPerformance = (data) => post('/hr/performance', data)
export const updatePerformance = (id, data) => put(`/hr/performance/${id}`, data)