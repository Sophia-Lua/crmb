import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as opsApi from '@/api/operations'

export const useOperationsStore = defineStore('operations', () => {
  const products = ref([])
  const productTotal = ref(0)
  const productDetail = ref(null)
  const categories = ref([])
  const promotions = ref([])
  const promotionTotal = ref(0)
  const promotionStatistics = ref({})
  const coupons = ref([])
  const couponStatistics = ref({})
  const seckillConfig = ref(null)
  const merchantApplications = ref([])
  const merchantTotal = ref(0)
  const loading = ref(false)

  const fetchProducts = async (params) => {
    loading.value = true
    try {
      const res = await opsApi.getProducts(params)
      products.value = res.data.list
      productTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchProductDetail = async (id) => {
    loading.value = true
    try {
      const res = await opsApi.getProductDetail(id)
      productDetail.value = res.data
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (data) => {
    return await opsApi.createProduct(data)
  }

  const updateProduct = async (id, data) => {
    return await opsApi.updateProduct(id, data)
  }

  const updateProductStatus = async (id, data) => {
    return await opsApi.updateProductStatus(id, data)
  }

  const syncStock = async (id) => {
    return await opsApi.syncStock(id)
  }

  const fetchCategories = async () => {
    const res = await opsApi.getCategories()
    categories.value = res.data.list
  }

  const createCategory = async (data) => {
    return await opsApi.createCategory(data)
  }

  const fetchPromotions = async (params) => {
    loading.value = true
    try {
      const res = await opsApi.getPromotions(params)
      promotions.value = res.data.list
      promotionTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const createPromotion = async (data) => {
    return await opsApi.createPromotion(data)
  }

  const updatePromotion = async (id, data) => {
    return await opsApi.updatePromotion(id, data)
  }

  const fetchPromotionStatistics = async (id) => {
    const res = await opsApi.getPromotionStatistics(id)
    promotionStatistics.value = res.data
  }

  const fetchCoupons = async (params) => {
    const res = await opsApi.getCoupons(params)
    coupons.value = res.data.list
  }

  const createCoupon = async (data) => {
    return await opsApi.createCoupon(data)
  }

  const fetchCouponStatistics = async () => {
    const res = await opsApi.getCouponStatistics()
    couponStatistics.value = res.data
  }

  const fetchSeckillConfig = async () => {
    const res = await opsApi.getSeckillConfig()
    seckillConfig.value = res.data
  }

  const updateSeckillConfig = async (data) => {
    return await opsApi.updateSeckillConfig(data)
  }

  const fetchMerchantApplications = async (params) => {
    loading.value = true
    try {
      const res = await opsApi.getMerchantApplications(params)
      merchantApplications.value = res.data.list
      merchantTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const reviewMerchant = async (id, data) => {
    return await opsApi.reviewMerchant(id, data)
  }

  return {
    products, productTotal, productDetail, categories,
    promotions, promotionTotal, promotionStatistics,
    coupons, couponStatistics, seckillConfig,
    merchantApplications, merchantTotal,
    loading,
    fetchProducts, fetchProductDetail, createProduct, updateProduct, updateProductStatus, syncStock,
    fetchCategories, createCategory,
    fetchPromotions, createPromotion, updatePromotion, fetchPromotionStatistics,
    fetchCoupons, createCoupon, fetchCouponStatistics,
    fetchSeckillConfig, updateSeckillConfig,
    fetchMerchantApplications, reviewMerchant
  }
})