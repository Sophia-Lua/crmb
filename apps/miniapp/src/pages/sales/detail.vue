<template>
  <view class="sales-detail">
    <view class="detail-header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="title">销售详情</view>
    </view>
    
    <scroll-view class="detail-content" scroll-y>
      <!-- 订单基本信息 -->
      <view class="section">
        <view class="section-title">订单信息</view>
        <view class="info-item">
          <text class="label">订单编号：</text>
          <text class="value">{{ salesDetail.orderNo }}</text>
        </view>
        <view class="info-item">
          <text class="label">下单时间：</text>
          <text class="value">{{ formatDate(salesDetail.orderTime) }}</text>
        </view>
        <view class="info-item">
          <text class="label">订单状态：</text>
          <text class="value status" :class="getStatusClass(salesDetail.status)">
            {{ getStatusText(salesDetail.status) }}
          </text>
        </view>
      </view>
      
      <!-- 商品信息 -->
      <view class="section">
        <view class="section-title">商品信息</view>
        <view class="product-item">
          <image :src="salesDetail.productImage" class="product-image" mode="aspectFill" />
          <view class="product-info">
            <view class="product-name">{{ salesDetail.productName }}</view>
            <view class="product-spec">{{ salesDetail.specifications }}</view>
            <view class="product-price">¥{{ salesDetail.price }}</view>
            <view class="product-quantity">x{{ salesDetail.quantity }}</view>
          </view>
        </view>
      </view>
      
      <!-- 客户信息 -->
      <view class="section" v-if="salesDetail.customerInfo">
        <view class="section-title">客户信息</view>
        <view class="info-item">
          <text class="label">客户姓名：</text>
          <text class="value">{{ salesDetail.customerInfo.name }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系电话：</text>
          <text class="value">{{ salesDetail.customerInfo.phone }}</text>
        </view>
        <view class="info-item">
          <text class="label">收货地址：</text>
          <text class="value">{{ salesDetail.customerInfo.address }}</text>
        </view>
      </view>
      
      <!-- 支付信息 -->
      <view class="section" v-if="salesDetail.paymentInfo">
        <view class="section-title">支付信息</view>
        <view class="info-item">
          <text class="label">支付方式：</text>
          <text class="value">{{ getPaymentMethod(salesDetail.paymentInfo.method) }}</text>
        </view>
        <view class="info-item">
          <text class="label">支付时间：</text>
          <text class="value">{{ formatDate(salesDetail.paymentInfo.time) }}</text>
        </view>
        <view class="info-item">
          <text class="label">总金额：</text>
          <text class="value price">¥{{ salesDetail.totalAmount }}</text>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="actions" v-if="canOperate">
        <button 
          v-if="salesDetail.status === 'pending'" 
          class="action-btn process-btn"
          @click="handleProcess"
        >
          处理订单
        </button>
        <button 
          v-if="salesDetail.status === 'processing'" 
          class="action-btn complete-btn"
          @click="handleComplete"
        >
          完成订单
        </button>
        <button 
          v-if="['pending', 'processing'].includes(salesDetail.status)" 
          class="action-btn cancel-btn"
          @click="handleCancel"
        >
          取消订单
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSalesStore } from '@/stores/sales'

const salesStore = useSalesStore()
const salesDetail = ref({})
const loading = ref(false)

// 获取订单ID
onLoad((options) => {
  const id = options.id
  if (id) {
    fetchSalesDetail(id)
  }
})

// 获取销售详情
const fetchSalesDetail = async (id) => {
  loading.value = true
  try {
    const data = await salesStore.fetchSalesDetail(id)
    salesDetail.value = data
  } catch (error) {
    console.error('获取销售详情失败:', error)
    uni.showToast({
      title: '获取详情失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 获取状态样式类
const getStatusClass = (status) => {
  return `status-${status}`
}

// 获取支付方式文本
const getPaymentMethod = (method) => {
  const methodMap = {
    wechat: '微信支付',
    alipay: '支付宝',
    cash: '现金支付',
    bank: '银行转账'
  }
  return methodMap[method] || method
}

// 判断是否可以操作
const canOperate = ref(true)

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 处理订单
const handleProcess = async () => {
  uni.showModal({
    title: '确认处理',
    content: '确定要处理此订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await salesStore.processOrder(salesDetail.value.id)
          uni.showToast({
            title: '处理成功',
            icon: 'success'
          })
          // 刷新详情
          fetchSalesDetail(salesDetail.value.id)
        } catch (error) {
          console.error('处理订单失败:', error)
          uni.showToast({
            title: '处理失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 完成订单
const handleComplete = async () => {
  uni.showModal({
    title: '确认完成',
    content: '确定要完成此订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await salesStore.completeOrder(salesDetail.value.id)
          uni.showToast({
            title: '完成成功',
            icon: 'success'
          })
          // 刷新详情
          fetchSalesDetail(salesDetail.value.id)
        } catch (error) {
          console.error('完成订单失败:', error)
          uni.showToast({
            title: '完成失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 取消订单
const handleCancel = async () => {
  uni.showModal({
    title: '确认取消',
    content: '确定要取消此订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await salesStore.cancelOrder(salesDetail.value.id)
          uni.showToast({
            title: '取消成功',
            icon: 'success'
          })
          // 刷新详情
          fetchSalesDetail(salesDetail.value.id)
        } catch (error) {
          console.error('取消订单失败:', error)
          uni.showToast({
            title: '取消失败',
            icon: 'none'
          })
        }
      }
    }
  })
}
</script>

<style scoped>
.sales-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.detail-header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #ffffff;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.icon-back {
  font-size: 36rpx;
  color: #333;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.detail-content {
  padding: 20rpx;
  height: calc(100vh - 120rpx);
}

.section {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.info-item {
  display: flex;
  margin-bottom: 15rpx;
  line-height: 1.5;
}

.label {
  color: #666;
  font-size: 28rpx;
  min-width: 160rpx;
}

.value {
  color: #333;
  font-size: 28rpx;
  flex: 1;
}

.status {
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  font-size: 24rpx;
}

.status-pending {
  color: #ffa500;
  background-color: #fff5e6;
}

.status-processing {
  color: #1890ff;
  background-color: #e6f7ff;
}

.status-completed {
  color: #52c41a;
  background-color: #f6ffed;
}

.status-cancelled {
  color: #ff4d4f;
  background-color: #fff2f0;
}

.price {
  color: #e64340;
  font-weight: bold;
}

.product-item {
  display: flex;
}

.product-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  line-height: 1.4;
}

.product-spec {
  color: #999;
  font-size: 26rpx;
  margin-bottom: 10rpx;
}

.product-price {
  color: #e64340;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.product-quantity {
  color: #666;
  font-size: 26rpx;
}

.actions {
  display: flex;
  justify-content: center;
  padding: 40rpx 20rpx;
}

.action-btn {
  width: 200rpx;
  height: 70rpx;
  border-radius: 35rpx;
  font-size: 28rpx;
  margin: 0 10rpx;
  border: none;
}

.process-btn {
  background-color: #1890ff;
  color: white;
}

.complete-btn {
  background-color: #52c41a;
  color: white;
}

.cancel-btn {
  background-color: #ff4d4f;
  color: white;
}
</style>