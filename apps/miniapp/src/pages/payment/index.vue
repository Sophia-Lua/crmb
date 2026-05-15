<template>
  <view class="payment-page">
    <view class="address-section" @click="gotoSelectAddress">
      <view v-if="selectedAddress" class="address-info">
        <view class="address-icon">📍</view>
        <view class="address-detail-wrap">
          <view class="name-phone">
            <text class="addr-name">{{ selectedAddress.name }}</text>
            <text class="addr-phone">{{ selectedAddress.phone }}</text>
          </view>
          <view class="addr-full">{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</view>
        </view>
      </view>
      <view v-else class="no-address">
        <text>请选择收货地址</text>
      </view>
      <text class="section-arrow">></text>
    </view>

    <view class="products-section">
      <view
        v-for="item in orderItems"
        :key="item.id"
        class="product-item"
      >
        <image class="product-image" :src="item.productImage || '/static/placeholder.png'" mode="aspectFill" />
        <view class="product-info">
          <text class="product-name">{{ item.productName }}</text>
          <text class="product-spec">{{ item.spec || '默认规格' }}</text>
        </view>
        <view class="product-price-info">
          <text class="product-price">¥{{ item.vipPrice || item.price }}</text>
          <text class="product-qty">x{{ item.quantity }}</text>
        </view>
      </view>
    </view>

    <view class="fee-section">
      <view class="fee-row">
        <text>商品总价</text>
        <text>¥{{ productTotal }}</text>
      </view>
      <view class="fee-row">
        <text>运费</text>
        <text :class="shippingFee === 0 ? 'free-text' : ''">{{ shippingFee === 0 ? '免运费' : '¥' + shippingFee.toFixed(2) }}</text>
      </view>
      <view class="fee-row" @click="showCouponPicker = true">
        <text>优惠券</text>
        <text v-if="selectedCoupon" class="discount-text">-¥{{ selectedCoupon.amount }}</text>
        <text v-else class="no-coupon">选择优惠券</text>
      </view>
      <view class="fee-row total-row">
        <text>实付金额</text>
        <text class="total-price">¥{{ actualTotal }}</text>
      </view>
    </view>

    <view class="pay-method-section">
      <view class="section-title">支付方式</view>
      <view
        v-for="method in payMethods"
        :key="method.key"
        class="pay-method-item"
        :class="{ active: selectedPayMethod === method.key }"
        @click="selectPayMethod(method.key)"
      >
        <text class="method-icon">{{ method.icon }}</text>
        <text class="method-name">{{ method.name }}</text>
        <view class="method-check" :class="{ checked: selectedPayMethod === method.key }"></view>
      </view>
    </view>

    <view class="submit-bar">
      <view class="submit-info">
        <text>合计:</text>
        <text class="submit-price">¥{{ actualTotal }}</text>
      </view>
      <view class="submit-btn" @click="handleSubmit">提交订单</view>
    </view>

    <view v-if="showCouponPicker" class="coupon-popup">
      <view class="popup-mask" @click="showCouponPicker = false"></view>
      <view class="popup-content">
        <view class="popup-title">选择优惠券</view>
        <view v-if="coupons.length === 0" class="no-coupons">暂无可用优惠券</view>
        <view v-else>
          <view
            v-for="coupon in coupons"
            :key="coupon.id"
            class="coupon-item"
            :class="{ active: selectedCoupon?.id === coupon.id }"
            @click="selectCoupon(coupon)"
          >
            <view class="coupon-amount">¥{{ coupon.amount }}</view>
            <view class="coupon-info">
              <text class="coupon-name">{{ coupon.name }}</text>
              <text class="coupon-condition">{{ coupon.condition }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMallStore } from '../../stores/mall'

interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  spec?: string
  price: number
  vipPrice?: number
  quantity: number
}

interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

interface Coupon {
  id: string
  name: string
  amount: number
  condition: string
}

const mallStore = useMallStore()
const selectedAddress = ref<Address | null>(null)
const orderItems = ref<OrderItem[]>([])
const selectedCoupon = ref<Coupon | null>(null)
const selectedPayMethod = ref<string>('wechat')
const showCouponPicker = ref<boolean>(false)
const freeShippingThreshold = 99

const payMethods = [
  { key: 'wechat', name: '微信支付', icon: '微信' },
  { key: 'alipay', name: '支付宝', icon: '支付宝' },
  { key: 'balance', name: '余额支付', icon: '余额' }
]

const coupons = ref<Coupon[]>([
  { id: '1', name: '新人优惠券', amount: 10, condition: '满50可用' },
  { id: '2', name: 'VIP专享券', amount: 20, condition: '满100可用' }
])

const productTotal = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + (item.vipPrice || item.price) * item.quantity, 0).toFixed(2)
})

const shippingFee = computed(() => {
  const total = parseFloat(productTotal.value)
  return total >= freeShippingThreshold ? 0 : 10
})

const actualTotal = computed(() => {
  const total = parseFloat(productTotal.value)
  const fee = shippingFee.value
  const discount = selectedCoupon.value?.amount || 0
  return Math.max(0, total + fee - discount).toFixed(2)
})

const selectPayMethod = (key: string) => {
  selectedPayMethod.value = key
}

const selectCoupon = (coupon: Coupon) => {
  selectedCoupon.value = coupon
  showCouponPicker.value = false
}

const gotoSelectAddress = () => {
  uni.navigateTo({
    url: '/pages/address/list'
  })
}

const handleSubmit = async () => {
  if (!selectedAddress.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' })
    return
  }
  if (orderItems.value.length === 0) {
    uni.showToast({ title: '没有商品', icon: 'none' })
    return
  }
  try {
    const data = {
      addressId: selectedAddress.value.id,
      items: orderItems.value.map(item => ({
        productId: item.productId,
        specId: item.spec,
        quantity: item.quantity,
        price: item.vipPrice || item.price
      })),
      couponId: selectedCoupon.value?.id,
      payMethod: selectedPayMethod.value,
      shippingFee: shippingFee.value,
      totalAmount: actualTotal.value
    }
    const response = await mallStore.createOrderAction(data)
    uni.showToast({ title: '下单成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateTo({
        url: `/pages/order/detail?id=${response.data?.id || ''}`
      })
    }, 1500)
  } catch (error) {
    uni.showToast({ title: '下单失败', icon: 'none' })
  }
}

const loadData = async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage?.options || {}

  if (options.cartItems) {
    const cartIds = (options.cartItems as string).split(',')
    orderItems.value = mallStore.cartItems
      .filter(item => cartIds.includes(item.id))
      .map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        spec: item.spec,
        price: item.price,
        vipPrice: item.vipPrice,
        quantity: item.quantity
      }))
  } else if (options.buyNow) {
    try {
      const buyInfo = JSON.parse(decodeURIComponent(options.buyNow as string))
      const productDetail = await mallStore.fetchProductDetail(buyInfo.productId)
      const product = productDetail.data
      orderItems.value = [{
        id: 'temp_1',
        productId: buyInfo.productId,
        productName: product?.name || '',
        productImage: product?.images?.[0] || '',
        spec: buyInfo.specId,
        price: product?.price || 0,
        vipPrice: product?.vipPrice,
        quantity: buyInfo.quantity || 1
      }]
    } catch (error) {
      console.error('加载商品信息失败:', error)
    }
  } else if (options.orderId) {
    try {
      const response = await mallStore.fetchOrderDetail(options.orderId as string)
      const order = response.data
      if (order) {
        orderItems.value = order.products.map(p => ({
          id: p.id,
          productId: p.productId,
          productName: p.name,
          productImage: p.image,
          spec: p.spec,
          price: p.price,
          vipPrice: p.vipPrice,
          quantity: p.quantity
        }))
      }
    } catch (error) {
      console.error('加载订单信息失败:', error)
    }
  }

  if (!selectedAddress.value) {
    await mallStore.fetchAddresses()
    const defaultAddr = mallStore.addresses.find(a => a.isDefault)
    if (defaultAddr) {
      selectedAddress.value = defaultAddr
    } else if (mallStore.addresses.length > 0) {
      selectedAddress.value = mallStore.addresses[0]
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.address-section {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.address-info {
  display: flex;
  flex: 1;
}

.address-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.address-detail-wrap {
  flex: 1;
}

.name-phone {
  display: flex;
  gap: 20rpx;
  margin-bottom: 10rpx;
}

.addr-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.addr-phone {
  font-size: 28rpx;
  color: #666;
}

.addr-full {
  font-size: 26rpx;
  color: #999;
}

.no-address {
  flex: 1;
  font-size: 28rpx;
  color: #999;
}

.section-arrow {
  font-size: 28rpx;
  color: #999;
  margin-left: 20rpx;
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

.fee-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx 30rpx;
}

.fee-row {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 0;
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

.free-text {
  color: #52c41a;
}

.discount-text {
  color: #52c41a;
}

.no-coupon {
  color: #999;
}

.pay-method-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.pay-method-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.pay-method-item:last-child {
  border-bottom: none;
}

.method-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.method-name {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.method-check {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #ddd;
  border-radius: 18rpx;
}

.method-check.checked {
  background-color: #007aff;
  border-color: #007aff;
}

.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 8rpx rgba(0,0,0,0.1);
}

.submit-info {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.submit-price {
  font-size: 40rpx;
  font-weight: bold;
  color: #ff4d4f;
  margin-left: 10rpx;
}

.submit-btn {
  padding: 20rpx 60rpx;
  background-color: #007aff;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.coupon-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}

.no-coupons {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 28rpx;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  margin-bottom: 15rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
}

.coupon-item.active {
  border-color: #007aff;
  background-color: #e6f7ff;
}

.coupon-amount {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff4d4f;
  margin-right: 20rpx;
  min-width: 80rpx;
}

.coupon-info {
  flex: 1;
}

.coupon-name {
  font-size: 28rpx;
  color: #333;
}

.coupon-condition {
  font-size: 24rpx;
  color: #999;
}
</style>