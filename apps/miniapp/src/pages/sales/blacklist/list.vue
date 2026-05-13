<template>
  <view class="blacklist-list">
    <view class="header">
      <view class="title">黑名单管理</view>
    </view>
    
    <!-- 筛选区域 -->
    <view class="filters">
      <view class="filter-row">
        <picker mode="selector" :range="reasonOptions" @change="onReasonChange">
          <view class="filter-item">
            <text>拉黑原因: {{ reasonText }}</text>
            <text class="arrow">&#9660;</text>
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
    <view class="content">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="blacklist.length === 0" class="empty">暂无黑名单客户</view>
      <scroll-view 
        v-else 
        class="list-scroll" 
        scroll-y
        @scrolltolower="loadMore"
      >
        <view 
          v-for="item in blacklist" 
          :key="item.id" 
          class="blacklist-item"
          @click="gotoDetail(item.id)"
        >
          <view class="item-header">
            <view class="customer-name">{{ item.customerName }}</view>
            <view class="remove-btn" @click.stop="removeFromBlacklist(item.id)">
              移除
            </view>
          </view>
          <view class="item-body">
            <view class="customer-id">
              <text class="label">客户ID:</text>
              <text>{{ item.customerId }}</text>
            </view>
            <view class="reason-info">
              <text class="label">拉黑原因:</text>
              <text class="reason-text">{{ item.reason }}</text>
            </view>
            <view class="operator-info">
              <text class="label">操作人:</text>
              <text>{{ item.blacklistedBy }}</text>
            </view>
          </view>
          <view class="item-footer">
            <view class="blacklist-time">
              拉黑时间: {{ formatDateTime(item.blacklistedAt) }}
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

interface BlacklistItem {
  id: string
  customerName: string
  customerId: string
  reason: string
  blacklistedBy: string
  blacklistedAt: string
}

interface FetchParams {
  keyword: string
  reason?: string
  page: number
  pageSize: number
}

const salesStore = useSalesStore()
const loading = ref<boolean>(false)
const hasMore = ref<boolean>(true)
const currentPage = ref<number>(1)

// 筛选条件
const searchKeyword = ref<string>('')
const reason = ref<string>('')

// 选项配置
const reasonOptions: string[] = ['全部', '恶意投诉', '恶意退货', '虚假订单', '其他']

// 计算属性
const reasonText = ref<string>('全部')

const blacklist = ref<BlacklistItem[]>([])

// 获取黑名单列表
const fetchBlacklist = async (reset: boolean = false): Promise<void> => {
  loading.value = true
  try {
    const params: FetchParams = {
      keyword: searchKeyword.value,
      reason: reason.value || undefined,
      page: reset ? 1 : currentPage.value,
      pageSize: 10
    }
    
    const response = await salesStore.fetchBlacklist(params)
    if (reset) {
      blacklist.value = response.data?.list || []
      currentPage.value = 1
    } else {
      blacklist.value = [...blacklist.value, ...(response.data?.list || [])]
      currentPage.value++
    }
    
    hasMore.value = response.data?.hasMore || false
  } catch (error) {
    console.error('获取黑名单失败:', error)
    uni.showToast({
      title: '获取数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 筛选条件变更
const onReasonChange = (e: any): void => {
  const index: number = e.detail.value
  reasonText.value = reasonOptions[index]
  reason.value = index === 0 ? '' : reasonOptions[index]
  handleSearch()
}

// 搜索
const handleSearch = (): void => {
  fetchBlacklist(true)
}

// 加载更多
const loadMore = (): void => {
  if (!hasMore.value || loading.value) return
  fetchBlacklist()
}

// 跳转详情
const gotoDetail = (id: string): void => {
  uni.navigateTo({
    url: `/pages/sales/blacklist/detail?id=${id}`
  })
}

// 移除黑名单
const removeFromBlacklist = async (id: string): Promise<void> => {
  uni.showModal({
    title: '确认移除',
    content: '确定要将此客户移出黑名单吗？',
    success: async (res: any) => {
      if (res.confirm) {
        try {
          // 这里应该调用移除黑名单的API
          uni.showToast({
            title: '移除成功',
            icon: 'success'
          })
          fetchBlacklist(true)
        } catch (error) {
          console.error('移除黑名单失败:', error)
          uni.showToast({
            title: '移除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 格式化日期时间
const formatDateTime = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 页面加载
onLoad(() => {
  fetchBlacklist(true)
})
</script>

<style scoped>
.blacklist-list {
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

.blacklist-item {
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

.remove-btn {
  height: 50rpx;
  background-color: #52c41a;
  color: white;
  border-radius: 25rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.item-body {
  margin-bottom: 20rpx;
}

.customer-id, .reason-info, .operator-info {
  display: flex;
  margin-bottom: 10rpx;
  font-size: 26rpx;
  color: #666;
}

.label {
  min-width: 100rpx;
  color: #333;
}

.reason-text {
  flex: 1;
  word-break: break-all;
}

.item-footer {
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.blacklist-time {
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
