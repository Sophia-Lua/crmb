<template>
  <view class="mine-page">
    <view class="header">
      <view class="user-info">
        <view class="avatar-placeholder">👤</view>
        <view class="user-name">销售人员</view>
      </view>
    </view>
    
    <view class="menu-list">
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

<script setup>
const gotoVisits = () => {
  uni.navigateTo({
    url: '/pages/sales/visits/list'
  })
}

const gotoStores = () => {
  uni.navigateTo({
    url: '/pages/sales/stores/unclaimed'
  })
}

const gotoCustomers = () => {
  // 显示选择公海还是私海
  uni.showActionSheet({
    itemList: ['公海客户', '私海客户'],
    success: function (res) {
      if (res.tapIndex === 0) {
        uni.navigateTo({
          url: '/pages/sales/customers/public'
        })
      } else if (res.tapIndex === 1) {
        uni.navigateTo({
          url: '/pages/sales/customers/private'
        })
      }
    }
  })
}

const gotoMap = () => {
  uni.navigateTo({
    url: '/pages/sales/map/index'
  })
}
</script>

<style scoped>
.mine-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 20rpx;
}

.header {
  background-color: #ffffff;
  padding: 40rpx 30rpx;
  text-align: center;
  margin-bottom: 20rpx;
}

.avatar-placeholder {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
  margin-bottom: 20rpx;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.menu-list {
  padding: 0 20rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
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