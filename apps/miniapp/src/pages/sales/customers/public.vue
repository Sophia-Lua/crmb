<template>
  <view class="customers-public">
    <view class="header">
      <view class="title">公海客户</view>
    </view>
    
    <!-- 筛选区域 -->
    <view class="filters">
      <view class="filter-row">
        <input 
          v-model="searchKeyword" 
          placeholder="搜索客户名称" 
          class="search-input"
          @confirm="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </view>
      <view class="filter-row">
        <picker mode="selector" :range="regionOptions" @change="onRegionChange">
          <view class="filter-item">
            <text>地区: {{ regionText }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker mode="selector" :range="storeTypeOptions" @change="onStoreTypeChange">
          <view class="filter-item">
            <text>类型: {{ storeTypeText }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
      <view class="filter-row">
        <picker mode="selector" :range="sortByOptions" @change="onSortByChange">
          <view class="filter-item">
            <text>排序: {{ sortByText }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>
    
    <!-- 客户列表 -->
    <view class="customers-content">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="customers.length === 0" class="empty">暂无公海客户</view>
      <scroll-view 
        v-else 
        class="customers-scroll" 
        scroll-y
        @scrolltolower="loadMore"
      >
        <view 
          v-for="customer in customers" 
          :key="customer.id" 
          class="customer-item"
          @click="gotoCustomerDetail(customer.id)"
        >
          <view class="item-left">
            <view class="customer-name">{{ customer.customerName }}</view>
            <view class="customer-type">{{ getCustomerTypeText(customer.customerType) }}</view>
            <view class="customer-address">{{ customer.address }}</view>
            <view class="customer-info">
              <text v-if="customer.area">面积: {{ customer.area }}㎡</text>
              <text v-if="customer.contactPhone">电话: {{ customer.contactPhone }}</text>
            </view>
          </view>
          <view class="item-right">
            <button class="claim-btn" @click.stop="claimCustomer(customer.id)">领取</button>
          </view>
        </view>
        
        <view v-if="hasMore" class="load-more">加载更多...</view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSalesStore } from '../../stores/sales'

const salesStore = useSalesStore()
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)

// 筛选条件
const searchKeyword = ref('')
const region = ref('') // province_city_district
const storeType = ref('') // supermarket, convenience, restaurant, other
const sortBy = ref('register_time_desc') // register_time_desc, register_time_asc, distance_asc, distance_desc, area_desc, area_asc

// 选项配置
const regionOptions = ['全部', '北京', '上海', '广州', '深圳']
const storeTypeOptions = ['全部', '超市', '便利店', '餐厅', '其他']
const sortByOptions = ['注册时间（最新）', '注册时间（最早）', '距离（最近）', '距离（最远）', '面积（大）', '面积（小）']

// 计算属性
const regionText = ref('全部')
const storeTypeText = ref('全部')
const sortByText = ref('注册时间（最新）')

const customers = ref([])

// 获取公海客户
const fetchCustomers = async (reset = false) => {
  loading.value = true
  try {
    const params = {
      keyword: searchKeyword.value,
      region: region.value || undefined,
      storeType: storeType.value || undefined,
      sortBy: sortBy.value,
      page: reset ? 1 : currentPage.value,
      pageSize: 10
    }
    
    const response = await salesStore.fetchPublicCustomers(params)
    if (reset) {
      customers.value = response.data?.list || []
      currentPage.value = 1
    } else {
      customers.value = [...customers.value, ...(response.data?.list || [])]
      currentPage.value++
    }
    
    hasMore.value = response.data?.hasMore || false
  } catch (error) {
    console.error('获取公海客户失败:', error)
    uni.showToast({
      title: '获取数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 筛选条件变更
const onRegionChange = (e) => {
  const index = e.detail.value
  regionText.value = regionOptions[index]
  region.value = index === 0 ? '' : regionOptions[index]
  handleSearch()
}

const onStoreTypeChange = (e) => {
  const index = e.detail.value
  storeTypeText.value = storeTypeOptions[index]
  storeType.value = index === 0 ? '' : ['supermarket', 'convenience', 'restaurant', 'other'][index - 1]
  handleSearch()
}

const onSortByChange = (e) => {
  const index = e.detail.value
  sortByText.value = sortByOptions[index]
  sortBy.value = ['register_time_desc', 'register_time_asc', 'distance_asc', 'distance_desc', 'area_desc', 'area_asc'][index]
  handleSearch()
}

// 搜索
const handleSearch = () => {
  fetchCustomers(true)
}

// 加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) return
  fetchCustomers()
}

// 领取客户
const claimCustomer = async (id) => {
  uni.showModal({
    title: '确认领取',
    content: '确定要领取此客户吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await salesStore.claimCustomerAction(id)
          uni.showToast({
            title: '领取成功',
            icon: 'success'
          })
          // 刷新列表
          fetchCustomers(true)
        } catch (error) {
          console.error('领取客户失败:', error)
          uni.showToast({
            title: '领取失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 跳转详情
const gotoCustomerDetail = (id) => {
  uni.navigateTo({
    url: `/pages/sales/customers/detail?id=${id}`
  })
}

// 页面加载
onLoad(() => {
  fetchCustomers(true)
})
</script>

<style scoped>
.customers-public {
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

.filter-item:not(:last-child) {
  margin-right: 20rpx;
}

.arrow {
  font-size: 20rpx;
  color: #999;
}

.customers-content {
  padding: 0 20rpx;
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.customers-scroll {
  height: calc(100vh - 600rpx);
}

.customer-item {
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.item-left {
  flex: 1;
}

.customer-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.customer-type {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.customer-address {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
  line-height: 1.4;
}

.customer-info {
  display: flex;
  gap: 20rpx;
  font-size: 22rpx;
  color: #999;
}

.item-right {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.claim-btn {
  height: 60rpx;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 26rpx;
  padding: 0 20rpx;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 26rpx;
}
</style>