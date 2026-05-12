<template>
  <view class="customers-private">
    <view class="header">
      <view class="title">私海客户</view>
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
        <picker mode="selector" :range="followStatusOptions" @change="onFollowStatusChange">
          <view class="filter-item">
            <text>跟进状态: {{ followStatusText }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker mode="selector" :range="gradeOptions" @change="onGradeChange">
          <view class="filter-item">
            <text>客户分级: {{ gradeText }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
      <view class="filter-row">
        <picker mode="selector" :range="lastVisitOptions" @change="onLastVisitChange">
          <view class="filter-item">
            <text>最后拜访: {{ lastVisitText }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
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
      <view v-else-if="customers.length === 0" class="empty">暂无私海客户</view>
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
            <view class="customer-grade" v-if="customer.grade">等级: {{ customer.grade }}</view>
            <view class="customer-address">{{ customer.address }}</view>
            <view class="customer-info">
              <text v-if="customer.lastVisitDate">最后拜访: {{ formatDate(customer.lastVisitDate) }}</text>
              <text v-if="customer.totalOrderAmount">订单金额: ¥{{ customer.totalOrderAmount }}</text>
            </view>
          </view>
          <view class="item-right">
            <button class="visit-btn" @click.stop="createVisit(customer.id)">新建拜访</button>
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
const followStatus = ref('') // all, visited, not_visited
const grade = ref('') // A, B, C, D
const lastVisit = ref('') // today, week, month, all
const sortBy = ref('last_visit_desc') // last_visit_desc, last_visit_asc, grade_desc, grade_asc, order_amount_desc, order_amount_asc

// 选项配置
const followStatusOptions = ['全部', '已拜访', '未拜访']
const gradeOptions = ['全部', 'A级', 'B级', 'C级', 'D级']
const lastVisitOptions = ['全部', '今天', '本周', '本月']
const sortByOptions = ['最后拜访时间', '客户等级', '订单金额']

// 计算属性
const followStatusText = ref('全部')
const gradeText = ref('全部')
const lastVisitText = ref('全部')
const sortByText = ref('最后拜访时间')

const customers = ref([])

// 获取私海客户
const fetchCustomers = async (reset = false) => {
  loading.value = true
  try {
    const params = {
      keyword: searchKeyword.value,
      followStatus: followStatus.value || undefined,
      grade: grade.value || undefined,
      lastVisit: lastVisit.value || undefined,
      sortBy: sortBy.value,
      page: reset ? 1 : currentPage.value,
      pageSize: 10
    }
    
    const response = await salesStore.fetchPrivateCustomers(params)
    if (reset) {
      customers.value = response.data?.list || []
      currentPage.value = 1
    } else {
      customers.value = [...customers.value, ...(response.data?.list || [])]
      currentPage.value++
    }
    
    hasMore.value = response.data?.hasMore || false
  } catch (error) {
    console.error('获取私海客户失败:', error)
    uni.showToast({
      title: '获取数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 筛选条件变更
const onFollowStatusChange = (e) => {
  const index = e.detail.value
  followStatusText.value = followStatusOptions[index]
  followStatus.value = index === 0 ? '' : ['all', 'visited', 'not_visited'][index]
  handleSearch()
}

const onGradeChange = (e) => {
  const index = e.detail.value
  gradeText.value = gradeOptions[index]
  grade.value = index === 0 ? '' : ['A', 'B', 'C', 'D'][index - 1]
  handleSearch()
}

const onLastVisitChange = (e) => {
  const index = e.detail.value
  lastVisitText.value = lastVisitOptions[index]
  lastVisit.value = index === 0 ? '' : ['all', 'today', 'week', 'month'][index]
  handleSearch()
}

const onSortByChange = (e) => {
  const index = e.detail.value
  sortByText.value = sortByOptions[index]
  sortBy.value = ['last_visit_desc', 'grade_desc', 'order_amount_desc'][index]
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

// 新建拜访
const createVisit = (customerId) => {
  uni.navigateTo({
    url: `/pages/sales/visits/create?customerId=${customerId}`
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
.customers-private {
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

.customer-grade {
  font-size: 26rpx;
  color: #faad14;
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

.visit-btn {
  height: 60rpx;
  background-color: #1890ff;
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