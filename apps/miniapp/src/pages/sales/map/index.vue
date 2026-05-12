<template>
  <view class="sales-map">
    <view class="header">
      <view class="title">销售地图</view>
      <view class="layer-controls">
        <view class="layer-item" @click="toggleLayer('public')">
          <view class="layer-color public-color"></view>
          <text class="layer-text">公海客户</text>
          <text class="layer-status">{{ layerStatus.public ? '✓' : '' }}</text>
        </view>
        <view class="layer-item" @click="toggleLayer('private')">
          <view class="layer-color private-color"></view>
          <text class="layer-text">私海客户</text>
          <text class="layer-status">{{ layerStatus.private ? '✓' : '' }}</text>
        </view>
        <view class="layer-item" @click="toggleLayer('others')">
          <view class="layer-color others-color"></view>
          <text class="layer-text">他海客户</text>
          <text class="layer-status">{{ layerStatus.others ? '✓' : '' }}</text>
        </view>
        <view class="layer-item" @click="toggleLayer('unregistered')">
          <view class="layer-color unregistered-color"></view>
          <text class="layer-text">未注册店铺</text>
          <text class="layer-status">{{ layerStatus.unregistered ? '✓' : '' }}</text>
        </view>
      </view>
    </view>
    
    <!-- 筛选区域 -->
    <view class="filters">
      <view class="filter-row">
        <picker mode="selector" :range="regionOptions" @change="onRegionChange">
          <view class="filter-item">
            <text>地区: {{ regionText }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker mode="selector" :range="customerTypeOptions" @change="onCustomerTypeChange">
          <view class="filter-item">
            <text>类型: {{ customerTypeText }}</text>
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
    
    <!-- 地图容器 -->
    <view class="map-container">
      <view class="map-placeholder">
        地图功能开发中...
        <view class="map-info">
          当前显示：
          <text v-if="layerStatus.public">公海客户({{ publicCount }})</text>
          <text v-if="layerStatus.private">私海客户({{ privateCount }})</text>
          <text v-if="layerStatus.others">他海客户({{ othersCount }})</text>
          <text v-if="layerStatus.unregistered">未注册店铺({{ unregisteredCount }})</text>
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

// 图层控制
const layerStatus = ref({
  public: true,
  private: true,
  others: false,
  unregistered: false
})

// 筛选条件
const searchKeyword = ref('')
const region = ref('') // province_city_district
const customerType = ref('') // supermarket, convenience, restaurant, other

// 选项配置
const regionOptions = ['全部', '北京', '上海', '广州', '深圳']
const customerTypeOptions = ['全部', '超市', '便利店', '餐厅', '其他']

// 计算属性
const regionText = ref('全部')
const customerTypeText = ref('全部')

// 客户数量
const publicCount = ref(0)
const privateCount = ref(0)
const othersCount = ref(0)
const unregisteredCount = ref(0)

// 切换图层
const toggleLayer = (layer) => {
  layerStatus.value[layer] = !layerStatus.value[layer]
  fetchMapData()
}

// 筛选条件变更
const onRegionChange = (e) => {
  const index = e.detail.value
  regionText.value = regionOptions[index]
  region.value = index === 0 ? '' : regionOptions[index]
  handleSearch()
}

const onCustomerTypeChange = (e) => {
  const index = e.detail.value
  customerTypeText.value = customerTypeOptions[index]
  customerType.value = index === 0 ? '' : ['supermarket', 'convenience', 'restaurant', 'other'][index - 1]
  handleSearch()
}

// 搜索
const handleSearch = () => {
  fetchMapData()
}

// 获取地图数据
const fetchMapData = async () => {
  loading.value = true
  try {
    // 获取公海客户
    if (layerStatus.value.public) {
      const publicResponse = await salesStore.fetchMapCustomers({
        type: 'public',
        keyword: searchKeyword.value,
        region: region.value,
        customerType: customerType.value
      })
      publicCount.value = publicResponse.data?.total || 0
    }
    
    // 获取私海客户
    if (layerStatus.value.private) {
      const privateResponse = await salesStore.fetchMapCustomers({
        type: 'private',
        keyword: searchKeyword.value,
        region: region.value,
        customerType: customerType.value
      })
      privateCount.value = privateResponse.data?.total || 0
    }
    
    // 获取他海客户
    if (layerStatus.value.others) {
      const othersResponse = await salesStore.fetchMapCustomers({
        type: 'others',
        keyword: searchKeyword.value,
        region: region.value,
        customerType: customerType.value
      })
      othersCount.value = othersResponse.data?.total || 0
    }
    
    // 获取未注册店铺
    if (layerStatus.value.unregistered) {
      const unregisteredResponse = await salesStore.fetchUnregisteredStores({
        keyword: searchKeyword.value,
        region: region.value,
        customerType: customerType.value
      })
      unregisteredCount.value = unregisteredResponse.data?.total || 0
    }
    
  } catch (error) {
    console.error('获取地图数据失败:', error)
    uni.showToast({
      title: '获取数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 页面加载
onLoad(() => {
  fetchMapData()
})
</script>

<style scoped>
.sales-map {
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
  margin-bottom: 20rpx;
}

.layer-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.layer-item {
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  background-color: #f8f8f8;
  border-radius: 20rpx;
  font-size: 24rpx;
  cursor: pointer;
}

.layer-color {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.public-color {
  background-color: #1890ff; /* 蓝色 */
}

.private-color {
  background-color: #52c41a; /* 绿色 */
}

.others-color {
  background-color: #faad14; /* 黄色 */
}

.unregistered-color {
  background-color: #999999; /* 灰色 */
}

.layer-text {
  color: #333;
  margin-right: 10rpx;
}

.layer-status {
  color: #1890ff;
  font-weight: bold;
}

.filters {
  background-color: #ffffff;
  padding: 20rpx;
  margin: 20rpx;
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

.map-container {
  height: calc(100vh - 600rpx);
  margin: 0 20rpx;
}

.map-placeholder {
  height: 100%;
  background-color: #ffffff;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #999;
}

.map-info {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #666;
}
</style>