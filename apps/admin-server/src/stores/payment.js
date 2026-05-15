import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as payApi from '@/api/payment'

export const usePaymentStore = defineStore('payment', () => {
  const merchants = ref([])
  const merchantTotal = ref(0)
  const merchantDetail = ref(null)
  const receipts = ref([])
  const receiptTotal = ref(0)
  const receiptDetail = ref(null)
  const settlementConfig = ref(null)
  const settlementReports = ref([])
  const loading = ref(false)

  const fetchMerchants = async (params) => {
    loading.value = true
    try {
      const res = await payApi.getMerchants(params)
      merchants.value = res.data.list
      merchantTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchMerchantDetail = async (id) => {
    loading.value = true
    try {
      const res = await payApi.getMerchantDetail(id)
      merchantDetail.value = res.data
    } finally {
      loading.value = false
    }
  }

  const createMerchant = async (data) => {
    return await payApi.createMerchant(data)
  }

  const updateMerchant = async (id, data) => {
    return await payApi.updateMerchant(id, data)
  }

  const setFeeRate = async (id, data) => {
    return await payApi.setFeeRate(id, data)
  }

  const fetchReceipts = async (params) => {
    loading.value = true
    try {
      const res = await payApi.getReceipts(params)
      receipts.value = res.data.list
      receiptTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchReceiptDetail = async (id) => {
    loading.value = true
    try {
      const res = await payApi.getReceiptDetail(id)
      receiptDetail.value = res.data
    } finally {
      loading.value = false
    }
  }

  const dailyReconciliation = async (data) => {
    return await payApi.dailyReconciliation(data)
  }

  const monthlyReconciliation = async (data) => {
    return await payApi.monthlyReconciliation(data)
  }

  const markAbnormalReceipt = async (id, data) => {
    return await payApi.markAbnormalReceipt(id, data)
  }

  const processAbnormal = async (id, data) => {
    return await payApi.processAbnormal(id, data)
  }

  const fetchSettlementConfig = async () => {
    const res = await payApi.getSettlementConfig()
    settlementConfig.value = res.data
  }

  const fetchSettlementReports = async (params) => {
    const res = await payApi.getSettlementReports(params)
    settlementReports.value = res.data.list
  }

  const executeSettlement = async (data) => {
    return await payApi.executeSettlement(data)
  }

  return {
    merchants, merchantTotal, merchantDetail,
    receipts, receiptTotal, receiptDetail,
    settlementConfig, settlementReports,
    loading,
    fetchMerchants, fetchMerchantDetail, createMerchant, updateMerchant, setFeeRate,
    fetchReceipts, fetchReceiptDetail, dailyReconciliation, monthlyReconciliation, markAbnormalReceipt, processAbnormal,
    fetchSettlementConfig, fetchSettlementReports, executeSettlement
  }
})