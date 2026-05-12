import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import {
  getVisits,
  getVisitDetail,
  createVisit,
  updateVisit,
  deleteVisit,
  getVisitStatistics,
  getUnclaimedStores,
  getReviewStores,
  getStoreDetail,
  claimStore,
  reviewStore,
  assignStore,
  getPublicCustomers,
  getPrivateCustomers,
  getCustomerDetail,
  claimCustomer,
  returnCustomerToPublic,
  transferCustomer,
  getMapCustomers,
  getUnregisteredStores,
  getComplaints,
  getSpecialStockRequests,
  getBlacklist
} from '@/api/sales'

export const useSalesStore = defineStore('sales', () => {
  // 拜访记录相关状态
  const visits = ref([])
  const currentVisit = ref(null)
  const visitStatistics = ref({})
  
  // 店铺管理相关状态
  const unclaimedStores = ref([])
  const reviewStores = ref([])
  currentStore = ref(null)
  storeStatistics = ref({})
  
  // 客户管理相关状态
  const publicCustomers = ref([])
  const privateCustomers = ref([])
  currentCustomer = ref(null)
  
  // 销售地图相关状态
  const mapCustomers = ref([])
  const unregisteredStores = ref([])
  
  // 其他子模块状态
  const complaints = ref([])
  const specialStockRequests = ref([])
  const blacklist = ref([])
  
  // 拜访记录相关方法
  const fetchVisits = async (params = {}) => {
    try {
      const response = await getVisits(params)
      visits.value = response.data || []
      return response
    } catch (error) {
      console.error('获取拜访列表失败:', error)
      throw error
    }
  }
  
  const fetchVisitDetail = async (id) => {
    if (!id) {
      throw new Error('拜访ID不能为空')
    }
    try {
      const response = await getVisitDetail(id)
      currentVisit.value = response.data || null
      return response
    } catch (error) {
      console.error('获取拜访详情失败:', error)
      throw error
    }
  }
  
  const createNewVisit = async (data) => {
    try {
      const response = await createVisit(data)
      return response
    } catch (error) {
      console.error('创建拜访记录失败:', error)
      throw error
    }
  }
  
  const updateVisitRecord = async (id, data) => {
    try {
      const response = await updateVisit(id, data)
      return response
    } catch (error) {
      console.error('更新拜访记录失败:', error)
      throw error
    }
  }
  
  const deleteVisitRecord = async (id) => {
    try {
      const response = await deleteVisit(id)
      return response
    } catch (error) {
      console.error('删除拜访记录失败:', error)
      throw error
    }
  }
  
  const fetchVisitStatistics = async () => {
    try {
      const response = await getVisitStatistics()
      visitStatistics.value = response.data || {}
      return response
    } catch (error) {
      console.error('获取拜访统计数据失败:', error)
      throw error
    }
  }
  
  // 店铺管理相关方法
  const fetchUnclaimedStores = async (params = {}) => {
    try {
      const response = await getUnclaimedStores(params)
      unclaimedStores.value = response.data || []
      return response
    } catch (error) {
      console.error('获取待领取店铺失败:', error)
      throw error
    }
  }
  
  const fetchReviewStores = async (params = {}) => {
    try {
      const response = await getReviewStores(params)
      reviewStores.value = response.data || []
      return response
    } catch (error) {
      console.error('获取待审核店铺失败:', error)
      throw error
    }
  }
  
  const fetchStoreDetail = async (id) => {
    if (!id) {
      throw new Error('店铺ID不能为空')
    }
    try {
      const response = await getStoreDetail(id)
      currentStore.value = response.data || null
      return response
    } catch (error) {
      console.error('获取店铺详情失败:', error)
      throw error
    }
  }
  
  const claimStoreAction = async (id) => {
    try {
      const response = await claimStore(id)
      return response
    } catch (error) {
      console.error('领取店铺失败:', error)
      throw error
    }
  }
  
  const reviewStoreAction = async (id, data) => {
    try {
      const response = await reviewStore(id, data)
      return response
    } catch (error) {
      console.error('审核店铺失败:', error)
      throw error
    }
  }
  
  const assignStoreAction = async (id, data) => {
    try {
      const response = await assignStore(id, data)
      return response
    } catch (error) {
      console.error('分配店铺失败:', error)
      throw error
    }
  }
  
  const fetchStoreStatistics = async () => {
    try {
      const response = await getStoreStatistics()
      storeStatistics.value = response.data || {}
      return response
    } catch (error) {
      console.error('获取店铺统计数据失败:', error)
      throw error
    }
  }
  
  // 客户管理相关方法
  const fetchPublicCustomers = async (params = {}) => {
    try {
      const response = await getPublicCustomers(params)
      publicCustomers.value = response.data || []
      return response
    } catch (error) {
      console.error('获取公海客户失败:', error)
      throw error
    }
  }
  
  const fetchPrivateCustomers = async (params = {}) => {
    try {
      const response = await getPrivateCustomers(params)
      privateCustomers.value = response.data || []
      return response
    } catch (error) {
      console.error('获取私海客户失败:', error)
      throw error
    }
  }
  
  const fetchCustomerDetail = async (id) => {
    if (!id) {
      throw new Error('客户ID不能为空')
    }
    try {
      const response = await getCustomerDetail(id)
      currentCustomer.value = response.data || null
      return response
    } catch (error) {
      console.error('获取客户详情失败:', error)
      throw error
    }
  }
  
  const claimCustomerAction = async (id) => {
    try {
      const response = await claimCustomer(id)
      return response
    } catch (error) {
      console.error('领取客户失败:', error)
      throw error
    }
  }
  
  const returnCustomerAction = async (id) => {
    try {
      const response = await returnCustomerToPublic(id)
      return response
    } catch (error) {
      console.error('归还客户失败:', error)
      throw error
    }
  }
  
  const transferCustomerAction = async (id, data) => {
    try {
      const response = await transferCustomer(id, data)
      return response
    } catch (error) {
      console.error('转移客户失败:', error)
      throw error
    }
  }
  
  const searchCustomersAction = async (params = {}) => {
    try {
      const response = await searchCustomers(params)
      return response
    } catch (error) {
      console.error('搜索客户失败:', error)
      throw error
    }
  }
  
  // 销售地图相关方法
  const fetchMapCustomers = async (params = {}) => {
    try {
      const response = await getMapCustomers(params)
      mapCustomers.value = response.data || []
      return response
    } catch (error) {
      console.error('获取地图客户数据失败:', error)
      throw error
    }
  }
  
  const fetchUnregisteredStores = async (params = {}) => {
    try {
      const response = await getUnregisteredStores(params)
      unregisteredStores.value = response.data || []
      return response
    } catch (error) {
      console.error('获取未注册店铺数据失败:', error)
      throw error
    }
  }
  
  const fetchMapMarkerDetail = async (id) => {
    try {
      const response = await getMapMarkerDetail(id)
      return response
    } catch (error) {
      console.error('获取标记详情失败:', error)
      throw error
    }
  }
  
  // 其他子模块方法
  const fetchComplaints = async (params = {}) => {
    try {
      const response = await getComplaints(params)
      complaints.value = response.data || []
      return response
    } catch (error) {
      console.error('获取客诉列表失败:', error)
      throw error
    }
  }
  
  const fetchSpecialStockRequests = async (params = {}) => {
    try {
      const response = await getSpecialStockRequests(params)
      specialStockRequests.value = response.data || []
      return response
    } catch (error) {
      console.error('获取特殊备货需求失败:', error)
      throw error
    }
  }
  
  const fetchBlacklist = async (params = {}) => {
    try {
      const response = await getBlacklist(params)
      blacklist.value = response.data || []
      return response
    } catch (error) {
      console.error('获取黑名单失败:', error)
      throw error
    }
  }
  
  return {
    // 状态
    visits,
    currentVisit,
    visitStatistics,
    unclaimedStores,
    reviewStores,
    currentStore,
    storeStatistics,
    publicCustomers,
    privateCustomers,
    currentCustomer,
    mapCustomers,
    unregisteredStores,
    complaints,
    specialStockRequests,
    blacklist,
    
    // 拜访记录方法
    fetchVisits,
    fetchVisitDetail,
    createNewVisit,
    updateVisitRecord,
    deleteVisitRecord,
    fetchVisitStatistics,
    
    // 店铺管理方法
    fetchUnclaimedStores,
    fetchReviewStores,
    fetchStoreDetail,
    claimStoreAction,
    reviewStoreAction,
    assignStoreAction,
    fetchStoreStatistics,
    
    // 客户管理方法
    fetchPublicCustomers,
    fetchPrivateCustomers,
    fetchCustomerDetail,
    claimCustomerAction,
    returnCustomerAction,
    transferCustomerAction,
    searchCustomersAction,
    
    // 销售地图方法
    fetchMapCustomers,
    fetchUnregisteredStores,
    fetchMapMarkerDetail,
    
    // 其他子模块方法
    fetchComplaints,
    fetchSpecialStockRequests,
    fetchBlacklist
  }
})