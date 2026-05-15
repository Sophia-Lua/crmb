import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as dcApi from '@/api/data-center'

export const useDataCenterStore = defineStore('dataCenter', () => {
  const queryResult = ref(null)
  const realtimeData = ref(null)
  const historyData = ref(null)
  const salesAnalysis = ref(null)
  const userAnalysis = ref(null)
  const productAnalysis = ref(null)
  const channelAnalysis = ref(null)
  const reportTemplates = ref([])
  const autoExportConfig = ref(null)
  const loading = ref(false)

  const queryData = async (params) => {
    loading.value = true
    try {
      const res = await dcApi.queryData(params)
      queryResult.value = res.data
    } finally {
      loading.value = false
    }
  }

  const fetchRealtimeData = async (params) => {
    loading.value = true
    try {
      const res = await dcApi.getRealtimeData(params)
      realtimeData.value = res.data
    } finally {
      loading.value = false
    }
  }

  const fetchHistoryData = async (params) => {
    loading.value = true
    try {
      const res = await dcApi.getHistoryData(params)
      historyData.value = res.data
    } finally {
      loading.value = false
    }
  }

  const fetchSalesAnalysis = async (params) => {
    loading.value = true
    try {
      const res = await dcApi.getSalesAnalysis(params)
      salesAnalysis.value = res.data
    } finally {
      loading.value = false
    }
  }

  const fetchUserAnalysis = async (params) => {
    loading.value = true
    try {
      const res = await dcApi.getUserAnalysis(params)
      userAnalysis.value = res.data
    } finally {
      loading.value = false
    }
  }

  const fetchProductAnalysis = async (params) => {
    loading.value = true
    try {
      const res = await dcApi.getProductAnalysis(params)
      productAnalysis.value = res.data
    } finally {
      loading.value = false
    }
  }

  const fetchChannelAnalysis = async (params) => {
    loading.value = true
    try {
      const res = await dcApi.getChannelAnalysis(params)
      channelAnalysis.value = res.data
    } finally {
      loading.value = false
    }
  }

  const fetchReportTemplates = async () => {
    const res = await dcApi.getReportTemplates()
    reportTemplates.value = res.data.list
  }

  const generateReport = async (data) => {
    return await dcApi.generateReport(data)
  }

  const exportReport = async (id, data) => {
    return await dcApi.exportReport(id, data)
  }

  const fetchAutoExportConfig = async () => {
    const res = await dcApi.getAutoExportConfig()
    autoExportConfig.value = res.data
  }

  const updateAutoExportConfig = async (data) => {
    return await dcApi.updateAutoExportConfig(data)
  }

  return {
    queryResult, realtimeData, historyData,
    salesAnalysis, userAnalysis, productAnalysis, channelAnalysis,
    reportTemplates, autoExportConfig,
    loading,
    queryData, fetchRealtimeData, fetchHistoryData,
    fetchSalesAnalysis, fetchUserAnalysis, fetchProductAnalysis, fetchChannelAnalysis,
    fetchReportTemplates, generateReport, exportReport,
    fetchAutoExportConfig, updateAutoExportConfig
  }
})