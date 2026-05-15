import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as cwApi from '@/api/cloud-warehouse'

export const useCloudWarehouseStore = defineStore('cloudWarehouse', () => {
  const outboundOrders = ref([])
  const outboundTotal = ref(0)
  const inboundOrders = ref([])
  const inboundTotal = ref(0)
  const inventory = ref([])
  const inventoryTotal = ref(0)
  const unloadingPlan = ref([])
  const schedule = ref([])
  const vehicles = ref([])
  const drivers = ref([])
  const lowStockWarning = ref([])
  const expiryWarning = ref([])
  const loading = ref(false)

  const fetchOutboundOrders = async (params) => {
    loading.value = true
    try {
      const res = await cwApi.getOutboundOrders(params)
      outboundOrders.value = res.data.list
      outboundTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const createOutboundOrder = async (data) => {
    return await cwApi.createOutboundOrder(data)
  }

  const confirmOutbound = async (id) => {
    return await cwApi.confirmOutbound(id)
  }

  const fetchInboundOrders = async (params) => {
    loading.value = true
    try {
      const res = await cwApi.getInboundOrders(params)
      inboundOrders.value = res.data.list
      inboundTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const createInboundOrder = async (data) => {
    return await cwApi.createInboundOrder(data)
  }

  const confirmInbound = async (id) => {
    return await cwApi.confirmInbound(id)
  }

  const fetchInventory = async (params) => {
    loading.value = true
    try {
      const res = await cwApi.getInventory(params)
      inventory.value = res.data.list
      inventoryTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const executeCheck = async (data) => {
    return await cwApi.executeCheck(data)
  }

  const fetchLowStockWarning = async () => {
    const res = await cwApi.getLowStockWarning()
    lowStockWarning.value = res.data.list
  }

  const fetchExpiryWarning = async () => {
    const res = await cwApi.getExpiryWarning()
    expiryWarning.value = res.data.list
  }

  const fetchUnloadingPlan = async () => {
    const res = await cwApi.getUnloadingPlan()
    unloadingPlan.value = res.data.list
  }

  const createUnloadingRecord = async (data) => {
    return await cwApi.createUnloadingRecord(data)
  }

  const fetchSchedule = async () => {
    const res = await cwApi.getSchedule()
    schedule.value = res.data.list
  }

  const fetchVehicles = async () => {
    const res = await cwApi.getVehicles()
    vehicles.value = res.data.list
  }

  const fetchDrivers = async () => {
    const res = await cwApi.getDrivers()
    drivers.value = res.data.list
  }

  return {
    outboundOrders, outboundTotal,
    inboundOrders, inboundTotal,
    inventory, inventoryTotal,
    unloadingPlan, schedule, vehicles, drivers,
    lowStockWarning, expiryWarning,
    loading,
    fetchOutboundOrders, createOutboundOrder, confirmOutbound,
    fetchInboundOrders, createInboundOrder, confirmInbound,
    fetchInventory, executeCheck, fetchLowStockWarning, fetchExpiryWarning,
    fetchUnloadingPlan, createUnloadingRecord, fetchSchedule, fetchVehicles, fetchDrivers
  }
})