<template>
  <view class="stores-unclaimed">
    <view class="header">
      <view class="title">待领取店铺</view>
      <view class="view-toggle">
        <button 
          class="toggle-btn" 
          :class="{ active: viewMode === 'list' }"
          @click="switchView('list')"
        >
          列表
        </button>
        <button 
          class="toggle-btn" 
          :class="{ active: viewMode === 'map' }"
          @click="switchView('map')"
        >
          地图
        </button>
      </view>
    </view>
    
    <!-- 筛选区域 -->
    <view class="filters">
      <view class="filter-row">
        <picker mode="selector" :range="storeTypeOptions" @change="onStoreTypeChange">
          <view class="filter-item">
            <text>类型: {{ storeTypeText }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker mode="selector" :range="regionOptions" @change="onRegionChange">
          <view class="filter-item">
            <text>地区: {{ regionText }}</text>
            <text class="arrow">▼</text>
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
    
    <!-- 内容区域 -->
    <view class="content">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="viewMode === 'list'">
        <scroll-view class="list-scroll" scroll-y @scrolltolower="loadMore">
          <view 
            v-for="store in stores" 
            :key="store.id" 
            class="store-item"
            @click="gotoStoreDetail(store.id)"
          >
            <view class="item-left">
              <view class="store-name">{{ store.storeName }}</view>
              <view class="store-type">{{ getStoreTypeText(store.storeType) }}</view>
              <view class="store-address">{{ store.address }}</view>
            </view>
            <view class="item-right">
              <view class="distance" v-if="store.distance">
                距离: {{ store.distance }}km
              </view>
              <button class="claim-btn" @click.stop="claimStore(store.id)">领取</button>
            </view>
          </view>
          
          <view v-if="hasMore" class="load-more">加载更多...</view>
        </scroll-view>
      </view>
      <view v-else class="map-view">
        <view class="map-placeholder">
          地图功能开发中...
        </view>
      </view>
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

// 视图模式
const viewMode = ref('list') // list, map

// 筛选条件
const searchKeyword = ref('')
const storeType = ref('') // supermarket, convenience, restaurant, other
const region = ref('') // province_city_district

// 选项配置
const storeTypeOptions = ['全部', '超市', '便利店', '餐厅', '其他']
const regionOptions = ['全部', '北京', '上海', '广州', '深圳']

// 计算属性
const storeTypeText = ref('全部')
const regionText = ref('全部')

const stores = ref([])

// 获取待领取店铺
const fetchStores = async (reset = false) => {
  loading.value = true
  try {
    const params = {
      keyword: searchKeyword.value,
      storeType: storeType.value || undefined,
      region: region.value || undefined,
      page: reset ? 1 : currentPage.value,
      pageSize: 10
    }
    
    const response = await salesStore.fetchUnclaimedStores(params)
    if (reset) {
      stores.value = response.data?.list || []
      currentPage.value = 1
    } else {
      stores.value = [...stores.value, ...(response.data?.list || [])]
      currentPage.value++
    }
    
    hasMore.value = response.data?.hasMore || false
  } catch (error) {
    console.error('获取待领取店铺失败:', error)
    uni.showToast({
      title: '获取数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 切换视图模式
const switchView = (mode) => {
  viewMode.value = mode
}

// 筛选条件变更
const onStoreTypeChange = (e) => {
  const index = e.detail.value
  storeTypeText.value = storeTypeOptions[index]
  storeType.value = index === 0 ? '' : ['supermarket', 'convenience', 'restaurant', 'other'][index - 1]
  handleSearch()
}

const onRegionChange = (e) => {
  const index = e.detail.value
  regionText.value = regionOptions[index]
  region.value = index === 0 ? '' : regionOptions[index]
  handleSearch()
}

// 搜索
const handleSearch = () => {
  fetchStores(true)
}

// 加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) return
  fetchStores()
}

// 领取店铺
const claimStore = async (id) => {
  uni.showModal({
    title: '确认领取',
    content: '确定要领取此店铺吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await salesStore.claimStoreAction(id)
          uni.showToast({
            title: '领取成功',
            icon: 'success'
          })
          // 刷新列表
          fetchStores(true)
        } catch (error) {
          console.error('领取店铺失败:', error)
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
const gotoStoreDetail = (id) => {
  uni.navigateTo({
    url: `/pages/sales/stores/detail?id=${id}`
  })
}

// 页面加载
onLoad(() => {
  fetchStores(true)
})
</script>

<style scoped>
.stores-unclaimed {
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

.view-toggle {
  display: flex;
  gap: 10rpx;
}

.toggle-btn {
  height: 50rpx;
  border: 1rpx solid #ddd;
  border-radius: 6rpx;
  font-size: 24rpx;
  padding: 0 20rpx;
  background-color: #ffffff;
  color: #666;
}

.toggle-btn.active {
  background-color: #007aff;
  color: white;
  border-color: #007aff;
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

.loading {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.list-scroll {
  height: calc(100vh - 500rpx);
}

.store-item {
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

.store-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.store-type {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.store-address {
  font-size: 24rpx;
  color: #999;
  line-height: 1.4;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.distance {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
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

.map-view {
  height: calc(100vh - 400rpx);
}

.map-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #ffffff;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #999;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 26rpx;
}
</style>