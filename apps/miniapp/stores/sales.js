import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

// 模拟API调用函数（实际项目中应该从api目录导入）
const mockApi = {
  // 获取销售列表
  async getSalesList(params) {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const mockData = {
      list: [
        {
          id: '1',
          productName: '有机蔬菜礼盒',
          productImage: 'https://via.placeholder.com/150x150?text=蔬菜礼盒',
          price: 88.00,
          quantity: 2,
          orderTime: '2026-05-10T14:30:00Z',
          status: 'completed',
          specifications: '5kg装'
        },
        {
          id: '2',
          productName: '新鲜水果组合',
          productImage: 'https://via.placeholder.com/150x150?text=水果组合',
          price: 128.00,
          quantity: 1,
          orderTime: '2026-05-11T09:15:00Z',
          status: 'processing',
          specifications: '10种水果'
        },
        {
          id: '3',
          productName: '生态大米',
          productImage: 'https://via.placeholder.com/150x150?text=生态大米',
          price: 56.00,
          quantity: 3,
          orderTime: '2026-05-11T16:45:00Z',
          status: 'pending',
          specifications: '10kg装'
        }
      ],
      total: 3,
      hasMore: false
    }
    
    return mockData
  },
  
  // 获取销售详情
  async getSalesDetail(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 根据ID返回对应的详情
    const detailMap = {
      '1': {
        id: '1',
        orderNo: 'ORD20260510001',
        productName: '有机蔬菜礼盒',
        productImage: 'https://via.placeholder.com/150x150?text=蔬菜礼盒',
        price: 88.00,
        quantity: 2,
        totalAmount: 176.00,
        orderTime: '2026-05-10T14:30:00Z',
        status: 'completed',
        specifications: '5kg装',
        customerInfo: {
          name: '张三',
          phone: '13800138000',
          address: '北京市朝阳区某某街道123号'
        },
        paymentInfo: {
          method: 'wechat',
          time: '2026-05-10T14:35:00Z'
        }
      },
      '2': {
        id: '2',
        orderNo: 'ORD20260511002',
        productName: '新鲜水果组合',
        productImage: 'https://via.placeholder.com/150x150?text=水果组合',
        price: 128.00,
        quantity: 1,
        totalAmount: 128.00,
        orderTime: '2026-05-11T09:15:00Z',
        status: 'processing',
        specifications: '10种水果',
        customerInfo: {
          name: '李四',
          phone: '13900139000',
          address: '上海市浦东新区某某路456号'
        },
        paymentInfo: {
          method: 'alipay',
          time: '2026-05-11T09:20:00Z'
        }
      },
      '3': {
        id: '3',
        orderNo: 'ORD20260511003',
        productName: '生态大米',
        productImage: 'https://via.placeholder.com/150x150?text=生态大米',
        price: 56.00,
        quantity: 3,
        totalAmount: 168.00,
        orderTime: '2026-05-11T16:45:00Z',
        status: 'pending',
        specifications: '10kg装',
        customerInfo: {
          name: '王五',
          phone: '13700137000',
          address: '广州市天河区某某大道789号'
        },
        paymentInfo: {
          method: 'wechat',
          time: '2026-05-11T16:50:00Z'
        }
      }
    }
    
    return detailMap[id] || {}
  },
  
  // 处理订单
  async processOrder(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    console.log('处理订单:', id)
    return { success: true }
  },
  
  // 完成订单
  async completeOrder(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    console.log('完成订单:', id)
    return { success: true }
  },
  
  // 取消订单
  async cancelOrder(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    console.log('取消订单:', id)
    return { success: true }
  }
}

export const useSalesStore = defineStore('sales', () => {
  // 当前页码
  const currentPage = ref(0)
  
  // 销售列表
  const salesList = ref([])
  
  // 获取销售列表
  const fetchSalesList = async (params = {}) => {
    const { keyword = '', page = 1, pageSize = 10 } = params
    currentPage.value = page
    
    const response = await mockApi.getSalesList({
      keyword,
      page,
      pageSize
    })
    
    return response
  }
  
  // 获取销售详情
  const fetchSalesDetail = async (id) => {
    if (!id) {
      throw new Error('订单ID不能为空')
    }
    
    const response = await mockApi.getSalesDetail(id)
    return response
  }
  
  // 处理订单
  const processOrder = async (id) => {
    const response = await mockApi.processOrder(id)
    return response
  }
  
  // 完成订单
  const completeOrder = async (id) => {
    const response = await mockApi.completeOrder(id)
    return response
  }
  
  // 取消订单
  const cancelOrder = async (id) => {
    const response = await mockApi.cancelOrder(id)
    return response
  }
  
  return {
    currentPage,
    salesList,
    fetchSalesList,
    fetchSalesDetail,
    processOrder,
    completeOrder,
    cancelOrder
  }
})