<template>
  <router-view />
</template>

<script>
  export default {
    onLaunch: function() {
      console.log('App Launch')
    },
    onShow: function() {
      console.log('App Show')
    },
    onHide: function() {
      console.log('App Hide')
    }
  }
</script>

<style>
  /* 全局样式 */
  @import './uni.scss';
  
  /* 全局通用样式 */
  page {
    background-color: #f5f5f5;
    font-size: 28rpx;
    color: #333;
  }
  
  /* 按钮通用样式 */
  .btn {
    display: inline-block;
    padding: 10rpx 20rpx;
    border-radius: 8rpx;
    text-align: center;
    font-size: 28rpx;
  }
  
  /* 加载状态 */
  .loading {
    text-align: center;
    padding: 40rpx 0;
    color: #999;
  }
  
  /* 空状态 */
  .empty {
    text-align: center;
    padding: 80rpx 0;
    color: #999;
    font-size: 28rpx;
  }
</style>