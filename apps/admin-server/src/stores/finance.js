import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as finApi from '@/api/finance'

export const useFinanceStore = defineStore('finance', () => {
  const transactions = ref([])
  const transactionTotal = ref(0)
  const reconciliations = ref([])
  const reconciliationTotal = ref(0)
  const reports = ref([])
  const reportTotal = ref(0)
  const loading = ref(false)

  const fetchTransactions = async (params) => {
    loading.value = true
    try {
      const res = await finApi.getTransactions(params)
      transactions.value = res.data.list
      transactionTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchReconciliations = async (params) => {
    loading.value = true
    try {
      const res = await finApi.getReconciliations(params)
      reconciliations.value = res.data.list
      reconciliationTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchReports = async (params) => {
    loading.value = true
    try {
      const res = await finApi.getReports(params)
      reports.value = res.data.list
      reportTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const generateReport = async (data) => {
    return await finApi.generateReport(data)
  }

  return {
    transactions, transactionTotal,
    reconciliations, reconciliationTotal,
    reports, reportTotal,
    loading,
    fetchTransactions,
    fetchReconciliations,
    fetchReports, generateReport
  }
})