<template>
  <view class="visits-list">
    <view class="header">
      <view class="title">拜访记录</view>
      <view class="actions">
        <button class="add-btn" @click="gotoCreate">新建拜访</button>
      </view>
    </view>
    
    <!-- 统计面板 -->
    <view class="statistics">
      <view class="stat-item">
        <view class="stat-value">{{ statistics.today || 0 }}</view>
        <view class="stat-label">今日</view>
      </view>
      <view class="stat-item">
        <view class="stat-value">{{ statistics.week || 0 }}</view>
        <view class="stat-label">本周</view>
      </view>
      <view class="stat-item">
        <view class="stat-value">{{ statistics.month || 0 }}</view>
        <view class="stat-label">本月</view>
      </view>
    </view>
    
    <!-- 筛选区域 -->
    <view class="filters">
      <view class="filter-row">
        <picker mode="selector" :range="visitTypeOptions" @change="onVisitTypeChange">
          <view class="filter-item">
            <text>类型: {{ visitTypeText }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker mode="selector" :range="visitMethodOptions" @change="onVisitMethodChange">
          <view class="filter-item">
            <text>方式: {{ visitMethodText }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
      <view class="filter-row">
        <input 
          v-model="searchKeyword" 
          placeholder="搜索客户名称" 
          class="search-input"
          @confirm="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </view>
    </view>
    
    <!-- 列表内容 -->
    <view class="visits-content">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="visits.length === 0" class="empty">暂无拜访记录</view>
      <scroll-view 
        v-else 
        class="visits-scroll" 
        scroll-y
        @scrolltolower="loadMore"
      >
        <view 
          v-for="visit in visits" 
          :key="visit.id" 
          class="visit-item"
          @click="gotoDetail(visit.id)"
        >
          <view class="item-header">
            <view class="customer-name">{{ visit.customerName }}</view>
            <view class="visit-status" :class="getStatusClass(visit.status)">
              {{ getStatusText(visit.status) }}
            </view>
          </view>
          <view class="item-body">
            <view class="visit-info">
              <text class="info-label">类型:</text>
              <text>{{ getVisitTypeText(visit.visitType) }}</text>
            </view>
            <view class="visit-info">
              <text class="info-label">方式:</text>
              <text>{{ getVisitMethodText(visit.visitMethod) }}</text>
            </view>
            <view class="visit-info">
              <text class="info-label">计划时间:</text>
              <text>{{ formatDate(visit.planDate) }} {{ visit.planTime || '' }}</text>
            </view>
            <view class="visit-info">
              <text class="info-label">主题:</text>
              <text class="subject">{{ visit.subject }}</text>
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
import { onLoad } from '@dcloudio/uni-app'
import { useSalesStore } from '../../stores/sales'

const salesStore = useSalesStore()
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)

// 筛选条件
const searchKeyword = ref('')
const visitType = ref('') // first, regular, temporary, other
const visitMethod = ref('') // onsite, phone, video, wechat

// 选项配置
const visitTypeOptions = ['全部', '首次拜访', '定期回访', '临时拜访', '其他']
const visitMethodOptions = ['全部', '实地拜访', '电话拜访', '视频拜访', '微信拜访']

// 计算属性
const visitTypeText = ref('全部')
const visitMethodText = ref('全部')

const visits = ref([])
const statistics = ref({})

// 获取拜访列表
const fetchVisits = async (reset = false) => {
  loading.value = true
  try {
    const params = {
      keyword: searchKeyword.value,
      visitType: visitType.value || undefined,
      visitMethod: visitMethod.value || undefined,
      page: reset ? 1 : currentPage.value,
      pageSize: 10
    }
    
    const response = await salesStore.fetchVisits(params)
    if (reset) {
      visits.value = response.data?.list || []
      currentPage.value = 1
    } else {
      visits.value = [...visits.value, ...(response.data?.list || [])]
      currentPage.value++
    }
    
    hasMore.value = response.data?.hasMore || false
  } catch (error) {
    console.error('获取拜访列表失败:', error)
    uni.showToast({
      title: '获取数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const response = await salesStore.fetchVisitStatistics()
    statistics.value = response.data || {}
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 获取状态文本和样式
const getStatusText = (status) => {
  const statusMap = {
    draft: '草稿',
    pending: '待拜访',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  return `status-${status}`
}

// 获取类型和方式文本
const getVisitTypeText = (type) => {
  const typeMap = {
    first: '首次拜访',
    regular: '定期回访',
    temporary: '临时拜访',
    other: '其他'
  }
  return typeMap[type] || type
}

const getVisitMethodText = (method) => {
  const methodMap = {
    onsite: '实地拜访',
    phone: '电话拜访',
    video: '视频拜访',
    wechat: '微信拜访'
  }
  return methodMap[method] || method
}

// 筛选条件变更
const onVisitTypeChange = (e) => {
  const index = e.detail.value
  visitTypeText.value = visitTypeOptions[index]
  visitType.value = index === 0 ? '' : ['first', 'regular', 'temporary', 'other'][index - 1]
  handleSearch()
}

const onVisitMethodChange = (e) => {
  const index = e.detail.value
  visitMethodText.value = visitMethodOptions[index]
  visitMethod.value = index === 0 ? '' : ['onsite', 'phone', 'video', 'wechat'][index - 1]
  handleSearch()
}

// 搜索
const handleSearch = () => {
  fetchVisits(true)
}

// 加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) return
  fetchVisits()
}

// 跳转页面
const gotoCreate = () => {
  uni.navigateTo({
    url: '/pages/sales/visits/create'
  })
}

const gotoDetail = (id) => {
  uni.navigateTo({
    url: `/pages/sales/visits/detail?id=${id}`
  })
}

// 页面加载
onLoad(() => {
  fetchStatistics()
  fetchVisits(true)
})
</script>

<style scoped>
.visits-list {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 20rpx 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.add-btn {
  height: 60rpx;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 0 30rpx;
}

.statistics {
  display: flex;
  background-color: #ffffff;
  padding: 30rpx;
  margin: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #007aff;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
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

.filter-item:not(:last-child) {
  margin-right: 20rpx;
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

.visits-content {
  padding: 0 20rpx;
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.visits-scroll {
  height: calc(100vh - 600rpx);
}

.visit-item {
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

.customer-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.visit-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.status-draft {
  color: #ffa500;
  background-color: #fff5e6;
}

.status-pending {
  color: #1890ff;
  background-color: #e6f7ff;
}

.status-in_progress {
  color: #722ed1;
  background-color: #f9f0ff;
}

.status-completed {
  color: #52c41a;
  background-color: #f6ffed;
}

.status-cancelled {
  color: #ff4d4f;
  background-color: #fff2f0;
}

.item-body {
  display: flex;
  flex-direction: column;
}

.visit-info {
  display: flex;
  margin-bottom: 10rpx;
  font-size: 26rpx;
  color: #666;
}

.info-label {
  min-width: 80rpx;
  color: #333;
}

.subject {
  flex: 1;
  word-break: break-all;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 26rpx;
}
</style>