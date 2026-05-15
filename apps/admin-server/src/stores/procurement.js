import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as procApi from '@/api/procurement'

export const useProcurementStore = defineStore('procurement', () => {
  const suppliers = ref([])
  const supplierTotal = ref(0)
  const supplierDetail = ref(null)
  const purchaseRequests = ref([])
  const purchaseRequestTotal = ref(0)
  const purchaseOrders = ref([])
  const purchaseOrderTotal = ref(0)
  const payableAccounts = ref([])
  const loading = ref(false)

  const fetchSuppliers = async (params) => {
    loading.value = true
    try {
      const res = await procApi.getSuppliers(params)
      suppliers.value = res.data.list
      supplierTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchSupplierDetail = async (id) => {
    loading.value = true
    try {
      const res = await procApi.getSupplierDetail(id)
      supplierDetail.value = res.data
    } finally {
      loading.value = false
    }
  }

  const createSupplier = async (data) => {
    return await procApi.createSupplier(data)
  }

  const updateSupplier = async (id, data) => {
    return await procApi.updateSupplier(id, data)
  }

  const auditSupplier = async (id, data) => {
    return await procApi.auditSupplier(id, data)
  }

  const fetchPurchaseRequests = async (params) => {
    loading.value = true
    try {
      const res = await procApi.getPurchaseRequests(params)
      purchaseRequests.value = res.data.list
      purchaseRequestTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const createPurchaseRequest = async (data) => {
    return await procApi.createPurchaseRequest(data)
  }

  const approvePurchaseRequest = async (id, data) => {
    return await procApi.approvePurchaseRequest(id, data)
  }

  const fetchPurchaseOrders = async (params) => {
    loading.value = true
    try {
      const res = await procApi.getPurchaseOrders(params)
      purchaseOrders.value = res.data.list
      purchaseOrderTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const createPurchaseOrder = async (data) => {
    return await procApi.createPurchaseOrder(data)
  }

  const approvePurchaseOrder = async (id, data) => {
    return await procApi.approvePurchaseOrder(id, data)
  }

  const fetchPayableAccounts = async (params) => {
    loading.value = true
    try {
      const res = await procApi.getPayableAccounts(params)
      payableAccounts.value = res.data.list
    } finally {
      loading.value = false
    }
  }

  const generateReconciliation = async (data) => {
    return await procApi.generateReconciliation(data)
  }

  const confirmReconciliation = async (id) => {
    return await procApi.confirmReconciliation(id)
  }

  const createPaymentRequest = async (data) => {
    return await procApi.createPaymentRequest(data)
  }

  const approvePayment = async (id, data) => {
    return await procApi.approvePayment(id, data)
  }

  const executePayment = async (id) => {
    return await procApi.executePayment(id)
  }

  return {
    suppliers, supplierTotal, supplierDetail,
    purchaseRequests, purchaseRequestTotal,
    purchaseOrders, purchaseOrderTotal,
    payableAccounts,
    loading,
    fetchSuppliers, fetchSupplierDetail, createSupplier, updateSupplier, auditSupplier,
    fetchPurchaseRequests, createPurchaseRequest, approvePurchaseRequest,
    fetchPurchaseOrders, createPurchaseOrder, approvePurchaseOrder,
    fetchPayableAccounts, generateReconciliation, confirmReconciliation,
    createPaymentRequest, approvePayment, executePayment
  }
})