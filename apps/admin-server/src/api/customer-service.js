import { get, post, put } from '@/api/request'

export const getOrders = (params) => get('/customer-service/orders', params)
export const getOrderDetail = (id) => get(`/customer-service/orders/${id}`)
export const approveOrder = (id) => put(`/customer-service/orders/${id}/confirm`)
export const cancelOrder = (id) => put(`/customer-service/orders/${id}/cancel`)
export const remarkOrder = (id, data) => post(`/customer-service/orders/${id}/remark`, data)
export const modifyPrice = (id, data) => put(`/customer-service/orders/${id}/modify-price`, data)
export const trackOrder = (id) => get(`/customer-service/orders/${id}/track`)

export const getAfterSales = (params) => get('/customer-service/after-sales', params)
export const getAfterSaleDetail = (id) => get(`/customer-service/after-sales/${id}`)
export const auditAfterSale = (id, data) => put(`/customer-service/after-sales/${id}/approve`, data)
export const confirmReceive = (id) => put(`/customer-service/after-sales/${id}/receive`)
export const processRefund = (id) => put(`/customer-service/after-sales/${id}/refund`)
export const rejectAfterSale = (id, data) => put(`/customer-service/after-sales/${id}/reject`, data)

export const getComplaints = (params) => get('/customer-service/complaints', params)
export const getComplaintDetail = (id) => get(`/customer-service/complaints/${id}`)
export const acceptComplaint = (id) => put(`/customer-service/complaints/${id}/accept`)
export const assignComplaint = (id, data) => put(`/customer-service/complaints/${id}/assign`, data)
export const processComplaint = (id) => put(`/customer-service/complaints/${id}/process`)
export const replyComplaint = (id, data) => put(`/customer-service/complaints/${id}/reply`, data)
export const closeComplaint = (id, data) => put(`/customer-service/complaints/${id}/close`, data)

export const getReviews = (params) => get('/customer-service/reviews', params)
export const replyReview = (id, data) => post(`/customer-service/reviews/${id}/reply`, data)
export const getReviewStatistics = () => get('/customer-service/reviews/statistics')

export const getFeedbacks = (params) => get('/customer-service/feedbacks', params)
export const processFeedback = (id, data) => put(`/customer-service/feedbacks/${id}/process`, data)
export const getFeedbackStatistics = () => get('/customer-service/feedbacks/statistics')

export const getInvoices = (params) => get('/customer-service/invoices', params)
export const getInvoiceDetail = (id) => get(`/customer-service/invoices/${id}`)
export const auditInvoice = (id, data) => put(`/customer-service/invoices/${id}/audit`, data)
export const issueInvoice = (id) => put(`/customer-service/invoices/${id}/issue`)
export const mailInvoice = (id, data) => put(`/customer-service/invoices/${id}/mail`, data)
export const voidInvoice = (id, data) => put(`/customer-service/invoices/${id}/void`, data)