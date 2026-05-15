import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as csApi from '@/api/customer-service'

export const useCustomerServiceStore = defineStore('customerService', () => {
  const orders = ref([])
  const orderTotal = ref(0)
  const orderDetail = ref(null)
  const afterSales = ref([])
  const afterSaleTotal = ref(0)
  const afterSaleDetail = ref(null)
  const complaints = ref([])
  const complaintTotal = ref(0)
  const complaintDetail = ref(null)
  const reviews = ref([])
  const reviewTotal = ref(0)
  const reviewStatistics = ref({})
  const feedbacks = ref([])
  const feedbackTotal = ref(0)
  const feedbackStatistics = ref({})
  const invoices = ref([])
  const invoiceTotal = ref(0)
  const invoiceDetail = ref(null)
  const loading = ref(false)

  const fetchOrders = async (params) => {
    loading.value = true
    try {
      const res = await csApi.getOrders(params)
      orders.value = res.data.list
      orderTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchOrderDetail = async (id) => {
    loading.value = true
    try {
      const res = await csApi.getOrderDetail(id)
      orderDetail.value = res.data
    } finally {
      loading.value = false
    }
  }

  const approveOrder = async (id) => {
    return await csApi.approveOrder(id)
  }

  const cancelOrder = async (id) => {
    return await csApi.cancelOrder(id)
  }

  const remarkOrder = async (id, data) => {
    return await csApi.remarkOrder(id, data)
  }

  const fetchAfterSales = async (params) => {
    loading.value = true
    try {
      const res = await csApi.getAfterSales(params)
      afterSales.value = res.data.list
      afterSaleTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchAfterSaleDetail = async (id) => {
    loading.value = true
    try {
      const res = await csApi.getAfterSaleDetail(id)
      afterSaleDetail.value = res.data
    } finally {
      loading.value = false
    }
  }

  const auditAfterSale = async (id, data) => {
    return await csApi.auditAfterSale(id, data)
  }

  const confirmReceive = async (id) => {
    return await csApi.confirmReceive(id)
  }

  const processRefund = async (id) => {
    return await csApi.processRefund(id)
  }

  const rejectAfterSale = async (id, data) => {
    return await csApi.rejectAfterSale(id, data)
  }

  const fetchComplaints = async (params) => {
    loading.value = true
    try {
      const res = await csApi.getComplaints(params)
      complaints.value = res.data.list
      complaintTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchComplaintDetail = async (id) => {
    loading.value = true
    try {
      const res = await csApi.getComplaintDetail(id)
      complaintDetail.value = res.data
    } finally {
      loading.value = false
    }
  }

  const acceptComplaint = async (id) => {
    return await csApi.acceptComplaint(id)
  }

  const assignComplaint = async (id, data) => {
    return await csApi.assignComplaint(id, data)
  }

  const processComplaint = async (id) => {
    return await csApi.processComplaint(id)
  }

  const replyComplaint = async (id, data) => {
    return await csApi.replyComplaint(id, data)
  }

  const closeComplaint = async (id, data) => {
    return await csApi.closeComplaint(id, data)
  }

  const fetchReviews = async (params) => {
    loading.value = true
    try {
      const res = await csApi.getReviews(params)
      reviews.value = res.data.list
      reviewTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const replyReview = async (id, data) => {
    return await csApi.replyReview(id, data)
  }

  const fetchReviewStatistics = async () => {
    const res = await csApi.getReviewStatistics()
    reviewStatistics.value = res.data
  }

  const fetchFeedbacks = async (params) => {
    loading.value = true
    try {
      const res = await csApi.getFeedbacks(params)
      feedbacks.value = res.data.list
      feedbackTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const processFeedback = async (id, data) => {
    return await csApi.processFeedback(id, data)
  }

  const fetchFeedbackStatistics = async () => {
    const res = await csApi.getFeedbackStatistics()
    feedbackStatistics.value = res.data
  }

  const fetchInvoices = async (params) => {
    loading.value = true
    try {
      const res = await csApi.getInvoices(params)
      invoices.value = res.data.list
      invoiceTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchInvoiceDetail = async (id) => {
    loading.value = true
    try {
      const res = await csApi.getInvoiceDetail(id)
      invoiceDetail.value = res.data
    } finally {
      loading.value = false
    }
  }

  const auditInvoice = async (id, data) => {
    return await csApi.auditInvoice(id, data)
  }

  const issueInvoice = async (id) => {
    return await csApi.issueInvoice(id)
  }

  const mailInvoice = async (id, data) => {
    return await csApi.mailInvoice(id, data)
  }

  const voidInvoice = async (id, data) => {
    return await csApi.voidInvoice(id, data)
  }

  return {
    orders, orderTotal, orderDetail,
    afterSales, afterSaleTotal, afterSaleDetail,
    complaints, complaintTotal, complaintDetail,
    reviews, reviewTotal, reviewStatistics,
    feedbacks, feedbackTotal, feedbackStatistics,
    invoices, invoiceTotal, invoiceDetail,
    loading,
    fetchOrders, fetchOrderDetail, approveOrder, cancelOrder, remarkOrder,
    fetchAfterSales, fetchAfterSaleDetail, auditAfterSale, confirmReceive, processRefund, rejectAfterSale,
    fetchComplaints, fetchComplaintDetail, acceptComplaint, assignComplaint, processComplaint, replyComplaint, closeComplaint,
    fetchReviews, replyReview, fetchReviewStatistics,
    fetchFeedbacks, processFeedback, fetchFeedbackStatistics,
    fetchInvoices, fetchInvoiceDetail, auditInvoice, issueInvoice, mailInvoice, voidInvoice
  }
})