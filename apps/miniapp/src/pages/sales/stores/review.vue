<template>
  <view class="stores-review">
    <view class="header">
      <view class="title">待审核店铺</view>
    </view>
    
    <!-- 统计面板 -->
    <view class="statistics">
      <view class="stat-item">
        <view class="stat-value">{{ statistics.pending || 0 }}</view>
        <view class="stat-label">待审核</view>
      </view>
      <view class="stat-item">
        <view class="stat-value">{{ statistics.todayReviewed || 0 }}</view>
        <view class="stat-label">今日已审</view>
      </view>
      <view class="stat-item">
        <view class="stat-value">{{ statistics.passRate || '0%' }}</view>
        <view class="stat-label">通过率</view>
      </view>
    </view>
    
    <!-- 筛选区域 -->
    <view class="filters">
      <view class="filter-row">
        <picker mode="selector" :range="storeTypeOptions" @change="onStoreTypeChange">
          <view class="filter-item">
            <text>类型: {{ storeTypeText }}</text>
            <text class="arrow">&#9660;</text>
          </view>
        </picker>
        <picker mode="selector" :range="regionOptions" @change="onRegionChange">
          <view class="filter-item">
            <text>地区: {{ regionText }}</text>
            <text class="arrow">&#9660;</text>
          </view>
        </picker>
      </view>
      <view class="filter-row">
        <input 
          v-model="searchKeyword" 
          placeholder="搜索店铺名称" 
          class="search-input"
          @confirm="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </view>
    </view>
    
    <!-- 店铺列表 -->
    <view class="content">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="stores.length === 0" class="empty">暂无待审核店铺</view>
      <scroll-view 
        v-else 
        class="list-scroll" 
        scroll-y
        @scrolltolower="loadMore"
      >
        <view 
          v-for="store in stores" 
          :key="store.id" 
          class="store-item"
          @click="gotoStoreDetail(store.id)"
        >
          <view class="store-header">
            <view class="store-name">{{ store.storeName }}</view>
            <view class="store-status" :class="getStatusClass(store.status)">
              {{ getStatusText(store.status) }}
            </view>
          </view>
          <view class="store-body">
            <view class="store-info">
              <text class="info-label">类型:</text>
              <text>{{ getStoreTypeText(store.storeType) }}</text>
            </view>
            <view class="store-info">
              <text class="info-label">地址:</text>
              <text class="address-text">{{ store.address }}</text>
            </view>
            <view class="store-info">
              <text class="info-label">联系人:</text>
              <text>{{ store.contactName }}</text>
            </view>
            <view class="store-info">
              <text class="info-label">资质:</text>
              <text>{{ store.licenses?.length || 0 }} 份</text>
            </view>
          </view>
          <view class="store-footer">
            <view class="register-time">
              注册时间: {{ formatDate(store.createdAt) }}
            </view>
            <view class="actions">
              <button class="action-btn reject-btn" @click.stop="reviewStore(store.id, false)">驳回</button>
              <button class="action-btn approve-btn" @click.stop="reviewStore(store.id, true)">通过</button>
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

interface Store {
  id: string
  storeName: string
  storeType: string
  address: string
  contactName: string
  licenses?: any[]
  status: string
  createdAt: string
}

interface StoreStatistics {
  pending?: number
  todayReviewed?: number
  passRate?: string
}

interface FetchParams {
  keyword: string
  storeType?: string
  region?: string
  page: number
  pageSize: number
}

const salesStore = useSalesStore()
const loading = ref<boolean>(false)
const hasMore = ref<boolean>(true)
const currentPage = ref<number>(1)

// 筛选条件
const searchKeyword = ref<string>('')
const storeType = ref<string>('')
const region = ref<string>('')

// 选项配置
const storeTypeOptions: string[] = ['全部', '超市', '便利店', '餐厅', '其他']
const regionOptions: string[] = ['全部', '北京', '上海', '广州', '深圳']

// 计算属性
const storeTypeText = ref<string>('全部')
const regionText = ref<string>('全部')

const stores = ref<Store[]>([])
const statistics = ref<StoreStatistics>({})

// 获取待审核店铺
const fetchStores = async (reset: boolean = false): Promise<void> => {
  loading.value = true
  try {
    const params: FetchParams = {
      keyword: searchKeyword.value,
      storeType: storeType.value || undefined,
      region: region.value || undefined,
      page: reset ? 1 : currentPage.value,
      pageSize: 10
    }
    
    const response = await salesStore.fetchReviewStores(params)
    if (reset) {
      stores.value = response.data?.list || []
      currentPage.value = 1
    } else {
      stores.value = [...stores.value, ...(response.data?.list || [])]
      currentPage.value++
    }
    
    hasMore.value = response.data?.hasMore || false
  } catch (error) {
    console.error('获取待审核店铺失败:', error)
    uni.showToast({
      title: '获取数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 获取统计数据
const fetchStatistics = async (): Promise<void> => {
  try {
    const response = await salesStore.fetchStoreStatistics()
    statistics.value = response.data || {}
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 筛选条件变更
const onStoreTypeChange = (e: any): void => {
  const index: number = e.detail.value
  storeTypeText.value = storeTypeOptions[index]
  storeType.value = index === 0 ? '' : ['supermarket', 'convenience', 'restaurant', 'other'][index - 1]
  handleSearch()
}

const onRegionChange = (e: any): void => {
  const index: number = e.detail.value
  regionText.value = regionOptions[index]
  region.value = index === 0 ? '' : regionOptions[index]
  handleSearch()
}

// 搜索
const handleSearch = (): void => {
  fetchStores(true)
}

// 加载更多
const loadMore = (): void => {
  if (!hasMore.value || loading.value) return
  fetchStores()
}

// 审核店铺
const reviewStore = async (id: string, approved: boolean): Promise<void> => {
  if (approved) {
    uni.showModal({
      title: '确认通过',
      content: '确定要通过此店铺的审核吗？',
      success: async (res: any) => {
        if (res.confirm) {
          await performReview(id, true, '')
        }
      }
    })
  } else {
    uni.showModal({
      title: '输入驳回原因',
      content: '请输入驳回原因（至少10个字符）',
      editable: true,
      placeholderText: '请输入驳回原因...',
      success: async (res: any) => {
        if (res.confirm && res.content.trim().length >= 10) {
          await performReview(id, false, res.content.trim())
        } else if (res.confirm) {
          uni.showToast({
            title: '驳回原因至少10个字符',
            icon: 'none'
          })
        }
      }
    })
  }
}

const performReview = async (id: string, approved: boolean, rejectReason: string): Promise<void> => {
  try {
    await salesStore.reviewStoreAction(id, {
      approved: approved,
      rejectReason: rejectReason || undefined
    })
    uni.showToast({
      title: approved ? '审核通过' : '驳回成功',
      icon: 'success'
    })
    fetchStores(true)
    fetchStatistics()
  } catch (error) {
    console.error('审核店铺失败:', error)
    uni.showToast({
      title: '审核失败',
      icon: 'none'
    })
  }
}

// 跳转详情
const gotoStoreDetail = (id: string): void => {
  uni.navigateTo({
    url: `/pages/sales/stores/detail?id=${id}`
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
    pending: '待审核',
    reviewing: '审核中'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string): string => {
  return `status-${status}`
}

// 获取类型文本
const getStoreTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    supermarket: '超市',
    convenience: '便利店',
    restaurant: '餐厅',
    other: '其他'
  }
  return typeMap[type] || type
}

// 页面加载
onLoad(() => {
  fetchStatistics()
  fetchStores(true)
})
</script>

<style scoped>
.stores-review {
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
  height: calc(100vh - 600rpx);
}

.store-item {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.store-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.store-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.store-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.status-pending {
  color: #ffa500;
  background-color: #fff5e6;
}

.status-reviewing {
  color: #1890ff;
  background-color: #e6f7ff;
}

.store-body {
  margin-bottom: 20rpx;
}

.store-info {
  display: flex;
  margin-bottom: 10rpx;
  font-size: 26rpx;
  color: #666;
}

.info-label {
  min-width: 80rpx;
  color: #333;
}

.address-text {
  flex: 1;
  word-break: break-all;
}

.store-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.register-time {
  font-size: 22rpx;
  color: #999;
}

.actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  height: 50rpx;
  border-radius: 25rpx;
  font-size: 24rpx;
  padding: 0 30rpx;
  border: none;
}

.reject-btn {
  background-color: #ff4d4f;
  color: white;
}

.approve-btn {
  background-color: #52c41a;
  color: white;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 26rpx;
}
</style>
