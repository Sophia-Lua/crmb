<template>
  <view class="sales-list">
    <view class="header">
      <view class="title">销售管理</view>
      <view class="search-box">
        <input 
          v-model="searchKeyword" 
          placeholder="搜索商品名称" 
          class="search-input"
          @confirm="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </view>
    </view>
    
    <view class="sales-content">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="salesList.length === 0" class="empty">暂无销售数据</view>
      <scroll-view 
        v-else 
        class="sales-scroll" 
        scroll-y
        @scrolltolower="loadMore"
      >
        <view 
          v-for="item in salesList" 
          :key="item.id" 
          class="sales-item"
          @click="gotoDetail(item.id)"
        >
          <view class="item-left">
            <image :src="item.productImage" class="product-image" mode="aspectFill" />
          </view>
          <view class="item-right">
            <view class="product-name">{{ item.productName }}</view>
            <view class="product-info">
              <text class="price">¥{{ item.price }}</text>
              <text class="quantity">x{{ item.quantity }}</text>
            </view>
            <view class="order-info">
              <text class="order-time">{{ formatDate(item.orderTime) }}</text>
              <text class="order-status" :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </text>
            </view>
          </view>
        </view>
        
        <view v-if="hasMore" class="load-more">加载更多...</view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSalesStore } from '@/stores/sales'

const salesStore = useSalesStore()
const searchKeyword = ref('')
const loading = ref(false)
const hasMore = ref(true)

const salesList = ref([])

// 获取销售列表
const fetchSalesList = async (reset = false) => {
  loading.value = true
  try {
    const params = {
      keyword: searchKeyword.value,
      page: reset ? 1 : (salesStore.currentPage + 1),
      pageSize: 10
    }
    
    const data = await salesStore.fetchSalesList(params)
    if (reset) {
      salesList.value = data.list
    } else {
      salesList.value = [...salesList.value, ...data.list]
    }
    
    hasMore.value = data.hasMore
  } catch (error) {
    console.error('获取销售列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 获取状态样式类
const getStatusClass = (status) => {
  return `status-${status}`
}

// 搜索
const handleSearch = () => {
  fetchSalesList(true)
}

// 加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) return
  fetchSalesList()
}

// 跳转到详情
const gotoDetail = (id) => {
  uni.navigateTo({
    url: `/pages/sales/detail?id=${id}`
  })
}

// 页面加载时获取数据
onMounted(() => {
  fetchSalesList(true)
})
</script>

<style scoped>
.sales-list {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20px;
}

.header {
  background-color: #ffffff;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.search-box {
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  height: 60rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.search-btn {
  margin-left: 20rpx;
  height: 60rpx;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 0 30rpx;
}

.sales-content {
  padding: 20rpx;
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.sales-scroll {
  height: calc(100vh - 300rpx);
}

.sales-item {
  display: flex;
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.item-left {
  width: 160rpx;
  height: 160rpx;
  margin-right: 20rpx;
}

.product-image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.item-right {
  flex: 1;
}

.product-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  line-height: 1.4;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.price {
  color: #e64340;
  font-size: 32rpx;
  font-weight: bold;
}

.quantity {
  color: #666;
  font-size: 26rpx;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-time {
  color: #999;
  font-size: 24rpx;
}

.order-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.status-pending {
  color: #ffa500;
  background-color: #fff5e6;
}

.status-processing {
  color: #1890ff;
  background-color: #e6f7ff;
}

.status-completed {
  color: #52c41a;
  background-color: #f6ffed;
}

.status-cancelled {
  color: #ff4d4f;
  background-color: #fff2f0;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 26rpx;
}
</style>