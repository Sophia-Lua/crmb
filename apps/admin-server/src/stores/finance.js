import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as finApi from '@/api/finance'

export const useFinanceStore = defineStore('finance', () => {
  const transactions = ref([])
  const transactionTotal = ref(0)
  const transactionSummary = ref(null)
  const categories = ref([])
  const reconciliations = ref([])
  const reconciliationTotal = ref(0)
  const reports = ref([])
  const reportTotal = ref(0)
  const incomeTrend = ref(null)
  const expenseTrend = ref(null)
  const profitRate = ref(null)
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

  const createTransaction = async (data) => {
    return await finApi.createTransaction(data)
  }

  const updateTransaction = async (id, data) => {
    return await finApi.updateTransaction(id, data)
  }

  const fetchTransactionSummary = async (params) => {
    const res = await finApi.getTransactionSummary(params)
    transactionSummary.value = res.data
  }

  const fetchCategories = async () => {
    const res = await finApi.getCategories()
    categories.value = res.data.list
  }

  const fetchReconciliations = async (params) => {
    loading.value = true
    try {
      const res = await finApi.getSupplierReconciliation(params)
      reconciliations.value = res.data.list
      reconciliationTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const processReconciliationDifference = async (id, data) => {
    return await finApi.processReconciliationDifference(id, data)
  }

  const confirmReconciliation = async (id) => {
    return await finApi.confirmReconciliation(id)
  }

  const fetchReports = async (params) => {
    loading.value = true
    try {
      const res = await finApi.getTransactions(params)
      reports.value = res.data.list
      reportTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const generateBalanceSheet = async (data) => {
    return await finApi.generateBalanceSheet(data)
  }

  const generateIncomeStatement = async (data) => {
    return await finApi.generateIncomeStatement(data)
  }

  const generateCashFlowStatement = async (data) => {
    return await finApi.generateCashFlowStatement(data)
  }

  const fetchIncomeTrend = async (params) => {
    const res = await finApi.getIncomeTrend(params)
    incomeTrend.value = res.data
  }

  const fetchExpenseTrend = async (params) => {
    const res = await finApi.getExpenseTrend(params)
    expenseTrend.value = res.data
  }

  const fetchProfitRate = async (params) => {
    const res = await finApi.getProfitRate(params)
    profitRate.value = res.data
  }

  const exportExcel = async (id) => {
    return await finApi.exportExcel(id)
  }

  const exportPDF = async (id) => {
    return await finApi.exportPDF(id)
  }

  return {
    transactions, transactionTotal, transactionSummary, categories,
    reconciliations, reconciliationTotal,
    reports, reportTotal,
    incomeTrend, expenseTrend, profitRate,
    loading,
    fetchTransactions, createTransaction, updateTransaction, fetchTransactionSummary,
    fetchCategories,
    fetchReconciliations, processReconciliationDifference, confirmReconciliation,
    fetchReports, generateBalanceSheet, generateIncomeStatement, generateCashFlowStatement,
    fetchIncomeTrend, fetchExpenseTrend, fetchProfitRate,
    exportExcel, exportPDF
  }
})