import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as supApi from '@/api/supplier'

export const useSupplierStore = defineStore('supplier', () => {
  const orders = ref([])
  const orderTotal = ref(0)
  const shippingOrders = ref([])
  const shippingTotal = ref(0)
  const monthlyReconciliation = ref([])
  const reconciliationTotal = ref(0)
  const loading = ref(false)

  const fetchOrders = async (params) => {
    loading.value = true
    try {
      const res = await supApi.getSupplierOrders(params)
      orders.value = res.data.list
      orderTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const confirmOrder = async (id) => {
    return await supApi.confirmOrder(id)
  }

  const updateOrderStatus = async (id, data) => {
    return await supApi.updateOrderStatus(id, data)
  }

  const handleOrderException = async (id, data) => {
    return await supApi.handleOrderException(id, data)
  }

  const createShippingOrder = async (data) => {
    return await supApi.createShippingOrder(data)
  }

  const inputLogistics = async (id, data) => {
    return await supApi.inputLogistics(id, data)
  }

  const trackShipping = async (id) => {
    return await supApi.trackShipping(id)
  }

  const handleShippingException = async (id, data) => {
    return await supApi.handleShippingException(id, data)
  }

  const fetchMonthlyReconciliation = async (params) => {
    loading.value = true
    try {
      const res = await supApi.getMonthlyReconciliation(params)
      monthlyReconciliation.value = res.data.list
      reconciliationTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const processReconciliationDifference = async (id, data) => {
    return await supApi.processReconciliationDifference(id, data)
  }

  const confirmReconciliation = async (id) => {
    return await supApi.confirmReconciliation(id)
  }

  const queryPaymentProgress = async (id) => {
    return await supApi.queryPaymentProgress(id)
  }

  return {
    orders, orderTotal,
    shippingOrders, shippingTotal,
    monthlyReconciliation, reconciliationTotal,
    loading,
    fetchOrders, confirmOrder, updateOrderStatus, handleOrderException,
    createShippingOrder, inputLogistics, trackShipping, handleShippingException,
    fetchMonthlyReconciliation, processReconciliationDifference, confirmReconciliation, queryPaymentProgress
  }
})