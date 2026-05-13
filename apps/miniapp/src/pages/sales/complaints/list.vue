<template>
  <view class="complaints-list">
    <view class="header">
      <view class="title">客诉管理</view>
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
        <picker mode="selector" :range="typeOptions" @change="onTypeChange">
          <view class="filter-item">
            <text>类型: {{ typeText }}</text>
            <text class="arrow">&#9660;</text>
          </view>
        </picker>
      </view>
      <view class="filter-row">
        <input 
          v-model="searchKeyword" 
          placeholder="搜索客户名称或投诉内容" 
          class="search-input"
          @confirm="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </view>
    </view>
    
    <!-- 客诉列表 -->
    <view class="content">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="complaints.length === 0" class="empty">暂无客诉记录</view>
      <scroll-view 
        v-else 
        class="list-scroll" 
        scroll-y
        @scrolltolower="loadMore"
      >
        <view 
          v-for="complaint in complaints" 
          :key="complaint.id" 
          class="complaint-item"
          @click="gotoDetail(complaint.id)"
        >
          <view class="item-header">
            <view class="complaint-no">{{ complaint.complaintNo }}</view>
            <view class="complaint-status" :class="getStatusClass(complaint.status)">
              {{ getStatusText(complaint.status) }}
            </view>
          </view>
          <view class="item-body">
            <view class="customer-info">
              <text class="label">客户:</text>
              <text>{{ complaint.customerName }}</text>
            </view>
            <view class="complaint-type">
              <text class="label">类型:</text>
              <text>{{ getTypeText(complaint.type) }}</text>
            </view>
            <view class="complaint-priority">
              <text class="label">优先级:</text>
              <text :class="getPriorityClass(complaint.priority)">
                {{ getPriorityText(complaint.priority) }}
              </text>
            </view>
            <view class="complaint-content">
              <text class="label">内容:</text>
              <text class="content-text">{{ complaint.content }}</text>
            </view>
          </view>
          <view class="item-footer">
            <view class="create-time">
              {{ formatDate(complaint.createdAt) }}
            </view>
            <view class="satisfaction" v-if="complaint.satisfaction">
              满意度: {{ complaint.satisfaction }}/5
            </view>
          </view>
        </view>
        
        <view v-if="hasMore" class="load-more">加载更多...</view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSalesStore } from '../../stores/sales'

const salesStore = useSalesStore()
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)

// 筛选条件
const searchKeyword = ref('')
const status = ref('')
const type = ref('')

// 选项配置
const statusOptions = ['全部', '待处理', '已受理', '处理中', '已解决', '已关闭']
const typeOptions = ['全部', '质量问题', '服务问题', '配送问题', '其他']

// 计算属性
const statusText = ref('全部')
const typeText = ref('全部')

const complaints = ref([])

// 获取客诉列表
const fetchComplaints = async (reset = false) => {
  loading.value = true
  try {
    const params = {
      keyword: searchKeyword.value,
      status: status.value || undefined,
      type: type.value || undefined,
      page: reset ? 1 : currentPage.value,
      pageSize: 10
    }
    
    const response = await salesStore.fetchComplaints(params)
    if (reset) {
      complaints.value = response.data?.list || []
      currentPage.value = 1
    } else {
      complaints.value = [...complaints.value, ...(response.data?.list || [])]
      currentPage.value++
    }
    
    hasMore.value = response.data?.hasMore || false
  } catch (error) {
    console.error('获取客诉列表失败:', error)
    uni.showToast({
      title: '获取数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 筛选条件变更
const onStatusChange = (e) => {
  const index = e.detail.value
  statusText.value = statusOptions[index]
  status.value = index === 0 ? '' : ['pending', 'accepted', 'processing', 'resolved', 'closed'][index - 1]
  handleSearch()
}

const onTypeChange = (e) => {
  const index = e.detail.value
  typeText.value = typeOptions[index]
  type.value = index === 0 ? '' : ['quality', 'service', 'delivery', 'other'][index - 1]
  handleSearch()
}

// 搜索
const handleSearch = () => {
  fetchComplaints(true)
}

// 加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) return
  fetchComplaints()
}

// 跳转详情
const gotoDetail = (id) => {
  uni.navigateTo({
    url: `/pages/sales/complaints/detail?id=${id}`
  })
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
    pending: '待处理',
    accepted: '已受理',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  return `status-${status}`
}

// 获取类型文本
const getTypeText = (type) => {
  const typeMap = {
    quality: '质量问题',
    service: '服务问题',
    delivery: '配送问题',
    other: '其他'
  }
  return typeMap[type] || type
}

// 获取优先级文本和样式
const getPriorityText = (priority) => {
  const priorityMap = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急'
  }
  return priorityMap[priority] || priority
}

const getPriorityClass = (priority) => {
  return `priority-${priority}`
}

// 页面加载
onLoad(() => {
  fetchComplaints(true)
})
</script>

<style scoped>
.complaints-list {
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
  height: calc(100vh - 500rpx);
}

.complaint-item {
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

.complaint-no {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.complaint-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.status-pending {
  color: #ffa500;
  background-color: #fff5e6;
}

.status-accepted {
  color: #1890ff;
  background-color: #e6f7ff;
}

.status-processing {
  color: #722ed1;
  background-color: #f9f0ff;
}

.status-resolved {
  color: #52c41a;
  background-color: #f6ffed;
}

.status-closed {
  color: #999;
  background-color: #f5f5f5;
}

.item-body {
  margin-bottom: 20rpx;
}

.customer-info, .complaint-type, .complaint-priority, .complaint-content {
  display: flex;
  margin-bottom: 10rpx;
  font-size: 26rpx;
  color: #666;
}

.label {
  min-width: 80rpx;
  color: #333;
}

.content-text {
  flex: 1;
  word-break: break-all;
}

.priority-low {
  color: #52c41a;
}

.priority-medium {
  color: #1890ff;
}

.priority-high {
  color: #faad14;
}

.priority-urgent {
  color: #ff4d4f;
  font-weight: bold;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.create-time {
  font-size: 22rpx;
  color: #999;
}

.satisfaction {
  font-size: 22rpx;
  color: #faad14;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 26rpx;
}
</style>
