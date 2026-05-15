<template>
  <view class="order-detail-page">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="!order" class="empty">订单不存在</view>
    <view v-else class="detail-content">
      <view class="status-bar" :class="'status-' + order.status">
        <view class="status-text">{{ getStatusText(order.status) }}</view>
        <view v-if="order.status === 'shipping'" class="shipping-info">
          <text>物流: {{ order.shippingCompany || '暂无' }}</text>
          <text>单号: {{ order.shippingNo || '暂无' }}</text>
        </view>
      </view>

      <view class="address-section">
        <view class="address-icon">📍</view>
        <view class="address-info">
          <view class="address-name-phone">
            <text class="address-name">{{ order.addressName }}</text>
            <text class="address-phone">{{ order.addressPhone }}</text>
          </view>
          <view class="address-detail">{{ order.addressDetail }}</view>
        </view>
      </view>

      <view class="products-section">
        <view
          v-for="product in order.products"
          :key="product.id"
          class="product-item"
        >
          <image class="product-image" :src="product.image || '/static/placeholder.png'" mode="aspectFill" @click="gotoProductDetail(product.productId)" />
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <text class="product-spec">{{ product.spec || '默认规格' }}</text>
          </view>
          <view class="product-price-info">
            <text class="product-price">¥{{ product.price }}</text>
            <text class="product-qty">x{{ product.quantity }}</text>
          </view>
        </view>
      </view>

      <view class="price-summary">
        <view class="summary-row">
          <text>商品总价</text>
          <text>¥{{ order.productTotal }}</text>
        </view>
        <view class="summary-row">
          <text>运费</text>
          <text :class="order.shippingFee === 0 ? 'free' : ''">{{ order.shippingFee === 0 ? '免运费' : '¥' + order.shippingFee }}</text>
        </view>
        <view v-if="order.discount > 0" class="summary-row">
          <text>优惠</text>
          <text class="discount">-¥{{ order.discount }}</text>
        </view>
        <view class="summary-row total-row">
          <text>实付金额</text>
          <text class="total-price">¥{{ order.totalAmount }}</text>
        </view>
      </view>

      <view class="order-info-section">
        <view class="info-row">
          <text class="info-label">订单编号</text>
          <text class="info-value">{{ order.orderNo }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">下单时间</text>
          <text class="info-value">{{ order.createTime }}</text>
        </view>
        <view v-if="order.payTime" class="info-row">
          <text class="info-label">支付时间</text>
          <text class="info-value">{{ order.payTime }}</text>
        </view>
        <view v-if="order.shippingTime" class="info-row">
          <text class="info-label">发货时间</text>
          <text class="info-value">{{ order.shippingTime }}</text>
        </view>
        <view v-if="order.completeTime" class="info-row">
          <text class="info-label">完成时间</text>
          <text class="info-value">{{ order.completeTime }}</text>
        </view>
      </view>

      <view class="action-bar">
        <view v-if="order.status === 'pending'" class="action-btn cancel-btn" @click="handleCancel">取消订单</view>
        <view v-if="order.status === 'pending'" class="action-btn pay-btn" @click="handlePay">立即付款</view>
        <view v-if="order.status === 'shipping'" class="action-btn confirm-btn" @click="handleConfirm">确认收货</view>
        <view v-if="order.status === 'completed'" class="action-btn review-btn" @click="handleReview">评价</view>
        <view v-if="['completed', 'shipping'].includes(order.status)" class="action-btn aftersale-btn" @click="handleAfterSale">申请售后</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMallStore } from '../../stores/mall'

interface OrderProduct {
  id: string
  productId: string
  name: string
  image: string
  spec: string
  price: number
  quantity: number
}

interface Order {
  id: string
  orderNo: string
  status: string
  addressName: string
  addressPhone: string
  addressDetail: string
  products: OrderProduct[]
  productTotal: string
  shippingFee: number
  discount: number
  totalAmount: string
  createTime: string
  payTime?: string
  shippingTime?: string
  completeTime?: string
  shippingCompany?: string
  shippingNo?: string
}

const mallStore = useMallStore()
const order = ref<Order | null>(null)
const loading = ref<boolean>(false)
const orderId = ref<string>('')

const getStatusText = (status: string): string => {
  const map: Record<string, string> = {
    pending: '待付款',
    processing: '待发货',
    shipping: '配送中',
    completed: '已完成',
    cancelled: '已取消',
    refunding: '退款中',
    refunded: '已退款'
  }
  return map[status] || status
}

const handleCancel = () => {
  uni.showModal({
    title: '确认取消',
    content: '确认取消此订单？',
    success: async (res: any) => {
      if (res.confirm) {
        try {
          await mallStore.cancelOrderAction(orderId.value)
          uni.showToast({ title: '已取消', icon: 'success' })
          fetchOrderDetail()
        } catch (error) {
          uni.showToast({ title: '取消失败', icon: 'none' })
        }
      }
    }
  })
}

const handlePay = () => {
  uni.navigateTo({
    url: `/pages/payment/index?orderId=${orderId.value}`
  })
}

const handleConfirm = () => {
  uni.showModal({
    title: '确认收货',
    content: '确认已收到货物？',
    success: async (res: any) => {
      if (res.confirm) {
        try {
          await mallStore.confirmReceiveAction(orderId.value)
          uni.showToast({ title: '已确认收货', icon: 'success' })
          fetchOrderDetail()
        } catch (error) {
          uni.showToast({ title: '确认失败', icon: 'none' })
        }
      }
    }
  })
}

const handleReview = () => {
  uni.showToast({ title: '评价功能开发中', icon: 'none' })
}

const handleAfterSale = () => {
  uni.showModal({
    title: '申请售后',
    content: '确认申请售后？',
    success: async (res: any) => {
      if (res.confirm) {
        try {
          await mallStore.applyAfterSaleAction({
            orderId: orderId.value,
            reason: '质量问题'
          })
          uni.showToast({ title: '售后申请已提交', icon: 'success' })
        } catch (error) {
          uni.showToast({ title: '申请失败', icon: 'none' })
        }
      }
    }
  })
}

const gotoProductDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/product/detail?id=${id}`
  })
}

const fetchOrderDetail = async () => {
  loading.value = true
  try {
    const response = await mallStore.fetchOrderDetail(orderId.value)
    order.value = response.data || null
  } catch (error) {
    console.error('获取订单详情失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (currentPage && currentPage.options) {
    orderId.value = currentPage.options.id || ''
  }
  if (orderId.value) {
    fetchOrderDetail()
  }
})
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.status-bar {
  padding: 30rpx;
  text-align: center;
}

.status-pending {
  background-color: #e6f7ff;
}

.status-processing {
  background-color: #f9f0ff;
}

.status-shipping {
  background-color: #fff7e6;
}

.status-completed {
  background-color: #f6ffed;
}

.status-cancelled {
  background-color: #fff2f0;
}

.status-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.shipping-info {
  display: flex;
  justify-content: center;
  gap: 30rpx;
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #666;
}

.address-section {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
}

.address-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.address-info {
  flex: 1;
}

.address-name-phone {
  display: flex;
  gap: 20rpx;
  margin-bottom: 10rpx;
}

.address-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.address-phone {
  font-size: 28rpx;
  color: #666;
}

.address-detail {
  font-size: 26rpx;
  color: #999;
}

.products-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx 30rpx;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-spec {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.product-price-info {
  text-align: right;
}

.product-price {
  font-size: 28rpx;
  color: #ff4d4f;
}

.product-qty {
  font-size: 24rpx;
  color: #999;
}

.price-summary {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx 30rpx;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
  font-size: 28rpx;
  color: #666;
}

.total-row {
  border-top: 1rpx solid #f0f0f0;
  padding-top: 20rpx;
  font-weight: bold;
  color: #333;
}

.total-price {
  color: #ff4d4f;
  font-size: 36rpx;
}

.free {
  color: #52c41a;
}

.discount {
  color: #52c41a;
}

.order-info-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 120rpx;
  padding: 20rpx 30rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
}

.info-label {
  font-size: 26rpx;
  color: #999;
}

.info-value {
  font-size: 26rpx;
  color: #333;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 8rpx rgba(0,0,0,0.1);
}

.action-btn {
  padding: 16rpx 40rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  border: 1rpx solid;
}

.cancel-btn {
  color: #999;
  border-color: #ddd;
  background-color: #ffffff;
}

.pay-btn {
  color: #ffffff;
  border-color: #007aff;
  background-color: #007aff;
}

.confirm-btn {
  color: #ffffff;
  border-color: #52c41a;
  background-color: #52c41a;
}

.review-btn {
  color: #007aff;
  border-color: #007aff;
  background-color: #ffffff;
}

.aftersale-btn {
  color: #ff4d4f;
  border-color: #ff4d4f;
  background-color: #ffffff;
}
</style>