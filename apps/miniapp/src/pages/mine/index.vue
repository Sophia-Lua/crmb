<template>
  <view class="mine-page">
    <view class="user-header">
      <view class="avatar-wrap">
        <image v-if="userInfo.avatar" class="avatar" :src="userInfo.avatar" mode="aspectFill" />
        <view v-else class="avatar-placeholder">{{ userInfo.nickname ? '' : '👤' }}</view>
      </view>
      <view class="user-detail">
        <view class="nickname">{{ userInfo.nickname || '未登录' }}</view>
        <view v-if="vipLevel > 0" class="vip-badge">VIP{{ vipLevel }}</view>
        <view v-else class="vip-badge inactive">开通VIP</view>
      </view>
      <view class="edit-btn" @click="gotoEditProfile">编辑</view>
    </view>

    <view class="order-section">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <text class="section-more" @click="gotoOrders">全部订单 ></text>
      </view>
      <view class="order-tabs">
        <view class="order-tab" @click="gotoOrdersByStatus('pending')">
          <text class="tab-icon">💰</text>
          <text class="tab-text">待付款</text>
        </view>
        <view class="order-tab" @click="gotoOrdersByStatus('processing')">
          <text class="tab-icon">📦</text>
          <text class="tab-text">待发货</text>
        </view>
        <view class="order-tab" @click="gotoOrdersByStatus('shipping')">
          <text class="tab-icon">🚚</text>
          <text class="tab-text">待收货</text>
        </view>
        <view class="order-tab" @click="gotoOrdersByStatus('completed')">
          <text class="tab-icon">✅</text>
          <text class="tab-text">已完成</text>
        </view>
      </view>
    </view>

    <view class="menu-list">
      <view class="menu-item" @click="gotoVip">
        <text class="menu-icon">👑</text>
        <text class="menu-text">VIP会员</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="gotoFavorites">
        <text class="menu-icon">❤️</text>
        <text class="menu-text">我的收藏</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="gotoAddresses">
        <text class="menu-icon">📍</text>
        <text class="menu-text">收货地址</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="gotoCoupons">
        <text class="menu-icon">🎁</text>
        <text class="menu-text">优惠券</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="gotoCustomerService">
        <text class="menu-icon">💬</text>
        <text class="menu-text">客服中心</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="gotoVisits">
        <text class="menu-icon">📋</text>
        <text class="menu-text">拜访记录</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="gotoStores">
        <text class="menu-icon">🏪</text>
        <text class="menu-text">店铺管理</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="gotoCustomers">
        <text class="menu-icon">👥</text>
        <text class="menu-text">客户管理</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="gotoMap">
        <text class="menu-icon">🗺️</text>
        <text class="menu-text">销售地图</text>
        <text class="arrow">></text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const userInfo = ref<any>({
  nickname: '',
  avatar: '',
  phone: ''
})
const vipLevel = ref<number>(0)

const fetchUserInfo = async () => {
  try {
    const response = await userStore.fetchUserInfo()
    userInfo.value = response.data || { nickname: '用户', avatar: '', phone: '' }
    vipLevel.value = response.data?.vipLevel || 0
  } catch (error) {
    userInfo.value = { nickname: '用户', avatar: '', phone: '' }
  }
}

const gotoEditProfile = () => {
  uni.showToast({ title: '编辑个人信息', icon: 'none' })
}

const gotoOrders = () => {
  uni.navigateTo({ url: '/pages/order/list' })
}

const gotoOrdersByStatus = (status: string) => {
  uni.navigateTo({ url: `/pages/order/list?status=${status}` })
}

const gotoVip = () => {
  uni.navigateTo({ url: '/pages/vip/index' })
}

const gotoFavorites = () => {
  uni.showToast({ title: '收藏功能开发中', icon: 'none' })
}

const gotoAddresses = () => {
  uni.navigateTo({ url: '/pages/address/list' })
}

const gotoCoupons = () => {
  uni.showToast({ title: '优惠券功能开发中', icon: 'none' })
}

const gotoCustomerService = () => {
  uni.showToast({ title: '客服功能开发中', icon: 'none' })
}

const gotoVisits = () => {
  uni.navigateTo({ url: '/pages/sales/visits/list' })
}

const gotoStores = () => {
  uni.navigateTo({ url: '/pages/sales/stores/unclaimed' })
}

const gotoCustomers = () => {
  uni.showActionSheet({
    itemList: ['公海客户', '私海客户'],
    success: (res: any) => {
      if (res.tapIndex === 0) {
        uni.navigateTo({ url: '/pages/sales/customers/public' })
      } else if (res.tapIndex === 1) {
        uni.navigateTo({ url: '/pages/sales/customers/private' })
      }
    }
  })
}

const gotoMap = () => {
  uni.navigateTo({ url: '/pages/sales/map/index' })
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.mine-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.user-header {
  display: flex;
  align-items: center;
  background-color: #007aff;
  padding: 40rpx 30rpx;
}

.avatar-wrap {
  margin-right: 20rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 4rpx solid #ffffff;
}

.avatar-placeholder {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
}

.user-detail {
  flex: 1;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10rpx;
}

.vip-badge {
  display: inline-block;
  padding: 4rpx 16rpx;
  background-color: #ffa500;
  color: #ffffff;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: bold;
}

.vip-badge.inactive {
  background-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
}

.edit-btn {
  padding: 10rpx 24rpx;
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-radius: 20rpx;
  font-size: 26rpx;
}

.order-section {
  background-color: #ffffff;
  margin: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 26rpx;
  color: #999;
}

.order-tabs {
  display: flex;
  padding: 25rpx 10rpx;
}

.order-tab {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.tab-text {
  font-size: 24rpx;
  color: #666;
}

.menu-list {
  padding: 0 20rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 2rpx;
}

.menu-item:first-child {
  border-radius: 12rpx 12rpx 0 0;
}

.menu-item:last-child {
  border-radius: 0 0 12rpx 12rpx;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.menu-text {
  font-size: 32rpx;
  color: #333;
  flex: 1;
}

.arrow {
  font-size: 28rpx;
  color: #999;
}
</style>