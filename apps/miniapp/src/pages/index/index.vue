<template>
  <view class="home-page">
    <view class="header">
      <view class="title">CRMB商城配送系统</view>
      <view class="subtitle">销售人员工作台</view>
    </view>
    
    <view class="quick-actions">
      <view class="action-card" @click="gotoVisits">
        <view class="card-icon">📋</view>
        <view class="card-title">新建拜访</view>
      </view>
      <view class="action-card" @click="gotoPublicCustomers">
        <view class="card-icon">👥</view>
        <view class="card-title">公海客户</view>
      </view>
      <view class="action-card" @click="gotoUnclaimedStores">
        <view class="card-icon">🏪</view>
        <view class="card-title">待领店铺</view>
      </view>
      <view class="action-card" @click="gotoMap">
        <view class="card-icon">🗺️</view>
        <view class="card-title">销售地图</view>
      </view>
    </view>
    
    <view class="statistics-section">
      <view class="section-title">今日统计</view>
      <view class="stats-grid">
        <view class="stat-item">
          <view class="stat-value">{{ stats.todayVisits }}</view>
          <view class="stat-label">今日拜访</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ stats.publicCustomers }}</view>
          <view class="stat-label">公海客户</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ stats.unclaimedStores }}</view>
          <view class="stat-label">待领店铺</view>
        </view>
      </view>
    </view>
    
    <view class="recent-visits" v-if="recentVisits.length > 0">
      <view class="section-title">最近拜访</view>
      <scroll-view class="visits-scroll" scroll-y>
        <view 
          v-for="visit in recentVisits" 
          :key="visit.id" 
          class="visit-item"
          @click="gotoVisitDetail(visit.id)"
        >
          <view class="visit-customer">{{ visit.customerName }}</view>
          <view class="visit-info">
            <text>{{ getVisitTypeText(visit.visitType) }}</text>
            <text>{{ formatDate(visit.planDate) }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSalesStore } from '../../stores/sales'

interface Visit {
  id: string
  customerName: string
  visitType: string
  planDate: string
}

interface Stats {
  todayVisits: number
  publicCustomers: number
  unclaimedStores: number
}

const salesStore = useSalesStore()
const stats = ref<Stats>({
  todayVisits: 0,
  publicCustomers: 0,
  unclaimedStores: 0
})
const recentVisits = ref<Visit[]>([])

// 获取统计数据
const fetchStats = async (): Promise<void> => {
  try {
    // 模拟统计数据（实际项目中应该调用API）
    stats.value = {
      todayVisits: 3,
      publicCustomers: 25,
      unclaimedStores: 8
    }
    
    // 模拟最近拜访记录
    recentVisits.value = [
      {
        id: '1',
        customerName: '北京华联超市',
        visitType: 'regular',
        planDate: new Date().toISOString()
      },
      {
        id: '2',
        customerName: '上海便利蜂',
        visitType: 'first',
        planDate: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        customerName: '广州全家便利店',
        visitType: 'temporary',
        planDate: new Date(Date.now() - 172800000).toISOString()
      }
    ]
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 获取拜访类型文本
const getVisitTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    first: '首次拜访',
    regular: '定期回访',
    temporary: '临时拜访',
    other: '其他'
  }
  return typeMap[type] || type
}

// 跳转函数
const gotoVisits = (): void => {
  uni.navigateTo({
    url: '/pages/sales/visits/list'
  })
}

const gotoPublicCustomers = (): void => {
  uni.navigateTo({
    url: '/pages/sales/customers/public'
  })
}

const gotoUnclaimedStores = (): void => {
  uni.navigateTo({
    url: '/pages/sales/stores/unclaimed'
  })
}

const gotoMap = (): void => {
  uni.navigateTo({
    url: '/pages/sales/map/index'
  })
}

const gotoVisitDetail = (id: string): void => {
  uni.navigateTo({
    url: `/pages/sales/visits/detail?id=${id}`
  })
}

// 页面加载
onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
  padding: 40rpx 0;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.action-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx 20rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.card-icon {
  font-size: 48rpx;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.statistics-section {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #007aff;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.recent-visits {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.visits-scroll {
  max-height: 400rpx;
}

.visit-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.visit-item:last-child {
  border-bottom: none;
}

.visit-customer {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.visit-info {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #999;
}
</style>
