<template>
  <view class="order-list-page">
    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: currentTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </view>
    </view>

    <scroll-view class="order-scroll" scroll-y @scrolltolower="loadMore">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="orders.length === 0" class="empty">暂无订单</view>
      <view v-else>
        <view
          v-for="order in orders"
          :key="order.id"
          class="order-card"
          @click="gotoOrderDetail(order.id)"
        >
          <view class="order-header">
            <text class="order-no">订单号: {{ order.orderNo }}</text>
            <text class="order-status" :class="'status-' + order.status">{{ getStatusText(order.status) }}</text>
          </view>
          <view class="order-products">
            <view v-for="product in order.products.slice(0, 3)" :key="product.id" class="order-product">
              <image class="product-thumb" :src="product.image || '/static/placeholder.png'" mode="aspectFill" />
              <view class="product-info">
                <text class="product-name">{{ product.name }}</text>
                <text class="product-spec">{{ product.spec }} x{{ product.quantity }}</text>
              </view>
            </view>
            <view v-if="order.products.length > 3" class="more-products">
              等{{ order.products.length }}件商品
            </view>
          </view>
          <view class="order-footer">
            <text class="order-amount">¥{{ order.totalAmount }}</text>
            <view class="order-actions">
              <view v-if="order.status === 'pending'" class="action-btn cancel-btn" @click.stop="handleCancel(order.id)">取消订单</view>
              <view v-if="order.status === 'pending'" class="action-btn pay-btn" @click.stop="handlePay(order)">立即付款</view>
              <view v-if="order.status === 'shipping'" class="action-btn confirm-btn" @click.stop="handleConfirm(order.id)">确认收货</view>
              <view v-if="order.status === 'completed'" class="action-btn review-btn" @click.stop="gotoReview(order.id)">评价</view>
              <view v-if="order.status === 'completed'" class="action-btn aftersale-btn" @click.stop="gotoAfterSale(order.id)">申请售后</view>
            </view>
          </view>
        </view>
        <view v-if="hasMore" class="load-more">加载更多...</view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMallStore } from '../../stores/mall'

interface OrderProduct {
  id: string
  name: string
  image: string
  spec: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNo: string
  status: string
  products: OrderProduct[]
  totalAmount: string
}

const mallStore = useMallStore()
const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待付款' },
  { key: 'processing', label: '待发货' },
  { key: 'shipping', label: '待收货' },
  { key: 'completed', label: '已完成' }
]
const currentTab = ref<string>('all')
const orders = ref<Order[]>([])
const loading = ref<boolean>(false)
const hasMore = ref<boolean>(true)
const currentPage = ref<number>(1)

const getStatusText = (status: string): string => {
  const map: Record<string, string> = {
    pending: '待付款',
    processing: '待发货',
    shipping: '待收货',
    completed: '已完成',
    cancelled: '已取消',
    refunding: '退款中',
    refunded: '已退款'
  }
  return map[status] || status
}

const switchTab = (key: string) => {
  currentTab.value = key
  currentPage.value = 1
  fetchOrders(true)
}

const fetchOrders = async (reset: boolean = false) => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: reset ? 1 : currentPage.value,
      pageSize: 10
    }
    if (currentTab.value !== 'all') {
      params.status = currentTab.value
    }
    const response = await mallStore.fetchOrders(params)
    const list = response.data?.list || []
    if (reset) {
      orders.value = list
      currentPage.value = 1
    } else {
      orders.value = [...orders.value, ...list]
      currentPage.value++
    }
    hasMore.value = response.data?.hasMore || false
  } catch (error) {
    console.error('获取订单失败:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (!hasMore.value || loading.value) return
  fetchOrders()
}

const gotoOrderDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/order/detail?id=${id}`
  })
}

const handleCancel = async (id: string) => {
  uni.showModal({
    title: '确认取消',
    content: '确认取消此订单？',
    success: async (res: any) => {
      if (res.confirm) {
        try {
          await mallStore.cancelOrderAction(id)
          uni.showToast({ title: '订单已取消', icon: 'success' })
          fetchOrders(true)
        } catch (error) {
          uni.showToast({ title: '取消失败', icon: 'none' })
        }
      }
    }
  })
}

const handlePay = (order: Order) => {
  uni.navigateTo({
    url: `/pages/payment/index?orderId=${order.id}`
  })
}

const handleConfirm = async (id: string) => {
  uni.showModal({
    title: '确认收货',
    content: '确认已收到货物？',
    success: async (res: any) => {
      if (res.confirm) {
        try {
          await mallStore.confirmReceiveAction(id)
          uni.showToast({ title: '已确认收货', icon: 'success' })
          fetchOrders(true)
        } catch (error) {
          uni.showToast({ title: '确认失败', icon: 'none' })
        }
      }
    }
  })
}

const gotoReview = (id: string) => {
  uni.navigateTo({
    url: `/pages/order/detail?id=${id}&action=review`
  })
}

const gotoAfterSale = (id: string) => {
  uni.navigateTo({
    url: `/pages/order/detail?id=${id}&action=aftersale`
  })
}

onMounted(() => {
  fetchOrders(true)
})
</script>

<style scoped>
.order-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  background-color: #ffffff;
  padding: 0;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 25rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #007aff;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30%;
  right: 30%;
  height: 4rpx;
  background-color: #007aff;
  border-radius: 2rpx;
}

.order-scroll {
  flex: 1;
  padding: 20rpx;
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.order-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-no {
  font-size: 26rpx;
  color: #666;
}

.order-status {
  font-size: 26rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.status-pending {
  color: #1890ff;
  background-color: #e6f7ff;
}

.status-processing {
  color: #722ed1;
  background-color: #f9f0ff;
}

.status-shipping {
  color: #fa8c16;
  background-color: #fff7e6;
}

.status-completed {
  color: #52c41a;
  background-color: #f6ffed;
}

.status-cancelled {
  color: #ff4d4f;
  background-color: #fff2f0;
}

.order-products {
  padding: 20rpx 30rpx;
}

.order-product {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.product-thumb {
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
}

.more-products {
  font-size: 24rpx;
  color: #999;
  text-align: center;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.order-amount {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.order-actions {
  display: flex;
  gap: 15rpx;
}

.action-btn {
  padding: 10rpx 24rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  border: 1rpx solid;
}

.cancel-btn {
  color: #999;
  border-color: #ddd;
}

.pay-btn {
  color: #007aff;
  border-color: #007aff;
}

.confirm-btn {
  color: #52c41a;
  border-color: #52c41a;
}

.review-btn {
  color: #007aff;
  border-color: #007aff;
}

.aftersale-btn {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 26rpx;
}
</style>