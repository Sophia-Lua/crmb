import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getHomeData,
  getProducts,
  getProductDetail,
  getCategories,
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  createOrder,
  getOrderList,
  getOrderDetail,
  cancelOrder,
  confirmReceive,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getVipInfo,
  purchaseVip,
  searchProducts,
  applyAfterSale
} from '@/api/mall'

export const useMallStore = defineStore('mall', () => {
  const homeData = ref<any>(null)
  const products = ref<any[]>([])
  const currentProduct = ref<any>(null)
  const categories = ref<any[]>([])
  const currentCategory = ref<any>(null)
  const cartItems = ref<any[]>([])
  const orders = ref<any[]>([])
  const currentOrder = ref<any>(null)
  const addresses = ref<any[]>([])
  const vipInfo = ref<any>(null)
  const searchHistory = ref<string[]>([])
  const searchResults = ref<any[]>([])

  const fetchHomeData = async () => {
    try {
      const response = await getHomeData()
      homeData.value = response.data || {}
      return response
    } catch (error) {
      console.error('获取首页数据失败:', error)
      throw error
    }
  }

  const fetchProducts = async (params: Record<string, any> = {}) => {
    try {
      const response = await getProducts(params)
      products.value = response.data?.list || []
      return response
    } catch (error) {
      console.error('获取商品列表失败:', error)
      throw error
    }
  }

  const fetchProductDetail = async (id: string) => {
    try {
      const response = await getProductDetail(id)
      currentProduct.value = response.data || null
      return response
    } catch (error) {
      console.error('获取商品详情失败:', error)
      throw error
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await getCategories()
      categories.value = response.data || []
      return response
    } catch (error) {
      console.error('获取分类列表失败:', error)
      throw error
    }
  }

  const fetchCart = async () => {
    try {
      const response = await getCart()
      cartItems.value = response.data || []
      return response
    } catch (error) {
      console.error('获取购物车失败:', error)
      throw error
    }
  }

  const addItemToCart = async (data: Record<string, any>) => {
    try {
      const response = await addToCart(data)
      await fetchCart()
      return response
    } catch (error) {
      console.error('添加购物车失败:', error)
      throw error
    }
  }

  const updateCartItemAction = async (id: string, data: Record<string, any>) => {
    try {
      const response = await updateCartItem(id, data)
      await fetchCart()
      return response
    } catch (error) {
      console.error('更新购物车项失败:', error)
      throw error
    }
  }

  const removeCartItem = async (id: string) => {
    try {
      const response = await deleteCartItem(id)
      await fetchCart()
      return response
    } catch (error) {
      console.error('删除购物车项失败:', error)
      throw error
    }
  }

  const clearCartAction = async () => {
    try {
      const response = await clearCart()
      cartItems.value = []
      return response
    } catch (error) {
      console.error('清空购物车失败:', error)
      throw error
    }
  }

  const createOrderAction = async (data: Record<string, any>) => {
    try {
      const response = await createOrder(data)
      await fetchCart()
      return response
    } catch (error) {
      console.error('创建订单失败:', error)
      throw error
    }
  }

  const fetchOrders = async (params: Record<string, any> = {}) => {
    try {
      const response = await getOrderList(params)
      orders.value = response.data?.list || []
      return response
    } catch (error) {
      console.error('获取订单列表失败:', error)
      throw error
    }
  }

  const fetchOrderDetail = async (id: string) => {
    try {
      const response = await getOrderDetail(id)
      currentOrder.value = response.data || null
      return response
    } catch (error) {
      console.error('获取订单详情失败:', error)
      throw error
    }
  }

  const cancelOrderAction = async (id: string) => {
    try {
      const response = await cancelOrder(id)
      await fetchOrders()
      return response
    } catch (error) {
      console.error('取消订单失败:', error)
      throw error
    }
  }

  const confirmReceiveAction = async (id: string) => {
    try {
      const response = await confirmReceive(id)
      await fetchOrders()
      return response
    } catch (error) {
      console.error('确认收货失败:', error)
      throw error
    }
  }

  const fetchAddresses = async () => {
    try {
      const response = await getAddresses()
      addresses.value = response.data || []
      return response
    } catch (error) {
      console.error('获取地址列表失败:', error)
      throw error
    }
  }

  const createAddressAction = async (data: Record<string, any>) => {
    try {
      const response = await createAddress(data)
      await fetchAddresses()
      return response
    } catch (error) {
      console.error('创建地址失败:', error)
      throw error
    }
  }

  const updateAddressAction = async (id: string, data: Record<string, any>) => {
    try {
      const response = await updateAddress(id, data)
      await fetchAddresses()
      return response
    } catch (error) {
      console.error('更新地址失败:', error)
      throw error
    }
  }

  const deleteAddressAction = async (id: string) => {
    try {
      const response = await deleteAddress(id)
      await fetchAddresses()
      return response
    } catch (error) {
      console.error('删除地址失败:', error)
      throw error
    }
  }

  const fetchVipInfo = async () => {
    try {
      const response = await getVipInfo()
      vipInfo.value = response.data || null
      return response
    } catch (error) {
      console.error('获取VIP信息失败:', error)
      throw error
    }
  }

  const purchaseVipAction = async (data: Record<string, any>) => {
    try {
      const response = await purchaseVip(data)
      await fetchVipInfo()
      return response
    } catch (error) {
      console.error('购买VIP失败:', error)
      throw error
    }
  }

  const searchProductsAction = async (params: Record<string, any> = {}) => {
    try {
      const response = await searchProducts(params)
      searchResults.value = response.data?.list || []
      if (params.keyword && !searchHistory.value.includes(params.keyword)) {
        searchHistory.value.unshift(params.keyword)
        if (searchHistory.value.length > 10) {
          searchHistory.value.pop()
        }
      }
      return response
    } catch (error) {
      console.error('搜索商品失败:', error)
      throw error
    }
  }

  const applyAfterSaleAction = async (data: Record<string, any>) => {
    try {
      const response = await applyAfterSale(data)
      return response
    } catch (error) {
      console.error('申请售后失败:', error)
      throw error
    }
  }

  const removeSearchHistory = (keyword: string) => {
    searchHistory.value = searchHistory.value.filter(k => k !== keyword)
  }

  const clearSearchHistory = () => {
    searchHistory.value = []
  }

  return {
    homeData,
    products,
    currentProduct,
    categories,
    currentCategory,
    cartItems,
    orders,
    currentOrder,
    addresses,
    vipInfo,
    searchHistory,
    searchResults,
    fetchHomeData,
    fetchProducts,
    fetchProductDetail,
    fetchCategories,
    fetchCart,
    addItemToCart,
    updateCartItemAction,
    removeCartItem,
    clearCartAction,
    createOrderAction,
    fetchOrders,
    fetchOrderDetail,
    cancelOrderAction,
    confirmReceiveAction,
    fetchAddresses,
    createAddressAction,
    updateAddressAction,
    deleteAddressAction,
    fetchVipInfo,
    purchaseVipAction,
    searchProductsAction,
    applyAfterSaleAction,
    removeSearchHistory,
    clearSearchHistory
  }
})