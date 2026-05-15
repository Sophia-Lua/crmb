import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as ddApi from '@/api/direct-delivery'

export const useDirectDeliveryStore = defineStore('directDelivery', () => {
  const routes = ref([])
  const routeTotal = ref(0)
  const stations = ref([])
  const tasks = ref([])
  const taskTotal = ref(0)
  const realtimeTrack = ref(null)
  const historyTrack = ref(null)
  const timeAnalysis = ref(null)
  const abnormalWarning = ref([])
  const loading = ref(false)

  const fetchRoutes = async (params) => {
    loading.value = true
    try {
      const res = await ddApi.getRoutes(params)
      routes.value = res.data.list
      routeTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const createRoute = async (data) => {
    return await ddApi.createRoute(data)
  }

  const updateRoute = async (id, data) => {
    return await ddApi.updateRoute(id, data)
  }

  const deleteRoute = async (id) => {
    return await ddApi.deleteRoute(id)
  }

  const optimizeRoute = async (id) => {
    return await ddApi.optimizeRoute(id)
  }

  const fetchStations = async (params) => {
    const res = await ddApi.getStations(params)
    stations.value = res.data.list
  }

  const createStation = async (data) => {
    return await ddApi.createStation(data)
  }

  const updateStation = async (id, data) => {
    return await ddApi.updateStation(id, data)
  }

  const assignTask = async (data) => {
    return await ddApi.assignTask(data)
  }

  const autoAssign = async () => {
    return await ddApi.autoAssign()
  }

  const trackDeliveryStatus = async (id) => {
    return await ddApi.trackDeliveryStatus(id)
  }

  const handleException = async (id, data) => {
    return await ddApi.handleException(id, data)
  }

  const confirmDelivery = async (id) => {
    return await ddApi.confirmDelivery(id)
  }

  const fetchRealtimeTrack = async (params) => {
    loading.value = true
    try {
      const res = await ddApi.getRealtimeTrack(params)
      realtimeTrack.value = res.data
    } finally {
      loading.value = false
    }
  }

  const fetchHistoryTrack = async (params) => {
    loading.value = true
    try {
      const res = await ddApi.getHistoryTrack(params)
      historyTrack.value = res.data
    } finally {
      loading.value = false
    }
  }

  const fetchTimeAnalysis = async (params) => {
    const res = await ddApi.getDeliveryTimeAnalysis(params)
    timeAnalysis.value = res.data
  }

  const fetchAbnormalWarning = async () => {
    const res = await ddApi.getTrackAbnormalWarning()
    abnormalWarning.value = res.data.list
  }

  return {
    routes, routeTotal, stations,
    tasks, taskTotal,
    realtimeTrack, historyTrack, timeAnalysis, abnormalWarning,
    loading,
    fetchRoutes, createRoute, updateRoute, deleteRoute, optimizeRoute,
    fetchStations, createStation, updateStation,
    assignTask, autoAssign, trackDeliveryStatus, handleException, confirmDelivery,
    fetchRealtimeTrack, fetchHistoryTrack, fetchTimeAnalysis, fetchAbnormalWarning
  }
})