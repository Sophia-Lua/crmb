<template>
  <view class="special-stock-list">
    <view class="header">
      <view class="title">特殊备货需求</view>
    </view>
    
    <!-- 筛选区域 -->
    <view class="filters">
      <view class="filter-row">
        <picker mode="selector" :range="statusOptions" @change="onStatusChange">
          <view class="filter-item">
            <text>状态: {{ statusText }}</text>
            <text class="arrow">&#9660;</text>
          </view>
        </picker>
      </view>
      <view class="filter-row">
        <input 
          v-model="searchKeyword" 
          placeholder="搜索商品名称或需求描述" 
          class="search-input"
          @confirm="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </view>
    </view>
    
    <!-- 列表内容 -->
    <view class="content">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="requests.length === 0" class="empty">暂无特殊备货需求</view>
      <scroll-view 
        v-else 
        class="list-scroll" 
        scroll-y
        @scrolltolower="loadMore"
      >
        <view 
          v-for="request in requests" 
          :key="request.id" 
          class="request-item"
          @click="gotoDetail(request.id)"
        >
          <view class="item-header">
            <view class="request-no">{{ request.requestId }}</view>
            <view class="request-status" :class="getStatusClass(request.status)">
              {{ getStatusText(request.status) }}
            </view>
          </view>
          <view class="item-body">
            <view class="customer-info">
              <text class="label">客户:</text>
              <text>{{ request.customerName }}</text>
            </view>
            <view class="product-info">
              <text class="label">商品:</text>
              <text>{{ request.productName }}</text>
            </view>
            <view class="sku-info">
              <text class="label">SKU:</text>
              <text>{{ request.sku }}</text>
            </view>
            <view class="quantity-info">
              <text class="label">数量:</text>
              <text class="quantity">{{ request.quantity }}</text>
            </view>
            <view class="reason-info" v-if="request.reason">
              <text class="label">原因:</text>
              <text class="reason-text">{{ request.reason }}</text>
            </view>
          </view>
          <view class="item-footer">
            <view class="create-time">
              创建时间: {{ formatDate(request.createdAt) }}
            </view>
          </view>
        </view>
        
        <view v-if="hasMore" class="load-more">加载更多...</view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSalesStore } from '../../stores/sales'

interface SpecialStockRequest {
  id: string
  requestId: string
  status: string
  customerName: string
  productName: string
  sku: string
  quantity: number
  reason?: string
  createdAt: string
}

interface FetchParams {
  keyword: string
  status?: string
  page: number
  pageSize: number
}

const salesStore = useSalesStore()
const loading = ref<boolean>(false)
const hasMore = ref<boolean>(true)
const currentPage = ref<number>(1)

// 筛选条件
const searchKeyword = ref<string>('')
const status = ref<string>('')

// 选项配置
const statusOptions: string[] = ['全部', '待处理', '已批准', '已拒绝', '已完成']

// 计算属性
const statusText = ref<string>('全部')

const requests = ref<SpecialStockRequest[]>([])

// 获取特殊备货需求列表
const fetchRequests = async (reset: boolean = false): Promise<void> => {
  loading.value = true
  try {
    const params: FetchParams = {
      keyword: searchKeyword.value,
      status: status.value || undefined,
      page: reset ? 1 : currentPage.value,
      pageSize: 10
    }
    
    const response = await salesStore.fetchSpecialStockRequests(params)
    if (reset) {
      requests.value = response.data?.list || []
      currentPage.value = 1
    } else {
      requests.value = [...requests.value, ...(response.data?.list || [])]
      currentPage.value++
    }
    
    hasMore.value = response.data?.hasMore || false
  } catch (error) {
    console.error('获取特殊备货需求失败:', error)
    uni.showToast({
      title: '获取数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 筛选条件变更
const onStatusChange = (e: any): void => {
  const index: number = e.detail.value
  statusText.value = statusOptions[index]
  status.value = index === 0 ? '' : ['pending', 'approved', 'rejected', 'fulfilled'][index - 1]
  handleSearch()
}

// 搜索
const handleSearch = (): void => {
  fetchRequests(true)
}

// 加载更多
const loadMore = (): void => {
  if (!hasMore.value || loading.value) return
  fetchRequests()
}

// 跳转详情
const gotoDetail = (id: string): void => {
  uni.navigateTo({
    url: `/pages/sales/special-stock/detail?id=${id}`
  })
}

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 获取状态文本和样式
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    approved: '已批准',
    rejected: '已拒绝',
    fulfilled: '已完成'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string): string => {
  return `status-${status}`
}

// 页面加载
onLoad(() => {
  fetchRequests(true)
})
</script>

<style scoped>
.special-stock-list {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20px;
}

.header {
  background-color: #ffffff;
  padding: 20rpx 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.filters {
  background-color: #ffffff;
  padding: 20rpx;
  margin: 0 20rpx 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.filter-row {
  display: flex;
  margin-bottom: 20rpx;
}

.filter-item {
  flex: 1;
  height: 60rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  font-size: 26rpx;
  color: #333;
}

.arrow {
  font-size: 20rpx;
  color: #999;
}

.search-input {
  flex: 1;
  height: 60rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  margin-right: 20rpx;
}

.search-btn {
  height: 60rpx;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 0 30rpx;
}

.content {
  padding: 0 20rpx;
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.list-scroll {
  height: calc(100vh - 450rpx);
}

.request-item {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.request-no {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.request-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.status-pending {
  color: #ffa500;
  background-color: #fff5e6;
}

.status-approved {
  color: #52c41a;
  background-color: #f6ffed;
}

.status-rejected {
  color: #ff4d4f;
  background-color: #fff2f0;
}

.status-fulfilled {
  color: #1890ff;
  background-color: #e6f7ff;
}

.item-body {
  margin-bottom: 20rpx;
}

.customer-info, .product-info, .sku-info, .quantity-info, .reason-info {
  display: flex;
  margin-bottom: 10rpx;
  font-size: 26rpx;
  color: #666;
}

.label {
  min-width: 80rpx;
  color: #333;
}

.quantity {
  color: #e64340;
  font-weight: bold;
}

.reason-text {
  flex: 1;
  word-break: break-all;
}

.item-footer {
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.create-time {
  font-size: 22rpx;
  color: #999;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 26rpx;
}
</style>
