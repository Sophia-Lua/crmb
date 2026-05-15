import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as salesApi from '@/api/sales'

export const useSalesStore = defineStore('sales', () => {
  const visits = ref([])
  const visitTotal = ref(0)
  const visitDetail = ref(null)
  const visitStatistics = ref({})

  const unclaimedStores = ref([])
  const reviewStores = ref([])
  const storeDetail = ref(null)

  const publicCustomers = ref([])
  const publicCustomerTotal = ref(0)
  const privateCustomers = ref([])
  const privateCustomerTotal = ref(0)
  const customerDetail = ref(null)

  const complaints = ref([])
  const specialStockRequests = ref([])
  const specialStockTotal = ref(0)
  const blacklist = ref([])
  const blacklistTotal = ref(0)

  const loading = ref(false)

  const fetchVisits = async (params) => {
    loading.value = true
    try {
      const res = await salesApi.getVisits(params)
      visits.value = res.data.list
      visitTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchVisitDetail = async (id) => {
    loading.value = true
    try {
      const res = await salesApi.getVisitDetail(id)
      visitDetail.value = res.data
    } finally {
      loading.value = false
    }
  }

  const createVisit = async (data) => {
    return await salesApi.createVisit(data)
  }

  const updateVisit = async (id, data) => {
    return await salesApi.updateVisit(id, data)
  }

  const deleteVisit = async (id) => {
    return await salesApi.deleteVisit(id)
  }

  const fetchVisitStatistics = async () => {
    const res = await salesApi.getVisitStatistics()
    visitStatistics.value = res.data
  }

  const fetchUnclaimedStores = async () => {
    loading.value = true
    try {
      const res = await salesApi.getUnclaimedStores()
      unclaimedStores.value = res.data.list
    } finally {
      loading.value = false
    }
  }

  const fetchReviewStores = async () => {
    loading.value = true
    try {
      const res = await salesApi.getReviewStores()
      reviewStores.value = res.data.list
    } finally {
      loading.value = false
    }
  }

  const fetchStoreDetail = async (id) => {
    loading.value = true
    try {
      const res = await salesApi.getStoreDetail(id)
      storeDetail.value = res.data
    } finally {
      loading.value = false
    }
  }

  const claimStore = async (id) => {
    return await salesApi.claimStore(id)
  }

  const reviewStore = async (id, data) => {
    return await salesApi.reviewStore(id, data)
  }

  const assignStore = async (id, data) => {
    return await salesApi.assignStore(id, data)
  }

  const fetchPublicCustomers = async (params) => {
    loading.value = true
    try {
      const res = await salesApi.getPublicCustomers(params)
      publicCustomers.value = res.data.list
      publicCustomerTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchPrivateCustomers = async (params) => {
    loading.value = true
    try {
      const res = await salesApi.getPrivateCustomers(params)
      privateCustomers.value = res.data.list
      privateCustomerTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchCustomerDetail = async (id) => {
    loading.value = true
    try {
      const res = await salesApi.getCustomerDetail(id)
      customerDetail.value = res.data
    } finally {
      loading.value = false
    }
  }

  const claimCustomer = async (id) => {
    return await salesApi.claimCustomer(id)
  }

  const returnCustomer = async (id) => {
    return await salesApi.returnCustomer(id)
  }

  const transferCustomer = async (id, data) => {
    return await salesApi.transferCustomer(id, data)
  }

  const searchCustomers = async (params) => {
    return await salesApi.searchCustomers(params)
  }

  const fetchComplaints = async (params) => {
    loading.value = true
    try {
      const res = await salesApi.getComplaints(params)
      complaints.value = res.data.list
    } finally {
      loading.value = false
    }
  }

  const fetchSpecialStockRequests = async (params) => {
    loading.value = true
    try {
      const res = await salesApi.getSpecialStockRequests(params)
      specialStockRequests.value = res.data.list
      specialStockTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchBlacklist = async (params) => {
    loading.value = true
    try {
      const res = await salesApi.getBlacklist(params)
      blacklist.value = res.data.list
      blacklistTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  return {
    visits, visitTotal, visitDetail, visitStatistics,
    unclaimedStores, reviewStores, storeDetail,
    publicCustomers, publicCustomerTotal, privateCustomers, privateCustomerTotal, customerDetail,
    complaints, specialStockRequests, specialStockTotal, blacklist, blacklistTotal,
    loading,
    fetchVisits, fetchVisitDetail, createVisit, updateVisit, deleteVisit, fetchVisitStatistics,
    fetchUnclaimedStores, fetchReviewStores, fetchStoreDetail, claimStore, reviewStore, assignStore,
    fetchPublicCustomers, fetchPrivateCustomers, fetchCustomerDetail, claimCustomer, returnCustomer, transferCustomer, searchCustomers,
    fetchComplaints, fetchSpecialStockRequests, fetchBlacklist
  }
})