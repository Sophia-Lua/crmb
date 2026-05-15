<template>
  <view class="cart-page">
    <view v-if="cartItems.length === 0" class="cart-empty">
      <view class="empty-icon">🛒</view>
      <view class="empty-text">购物车是空的</view>
      <view class="empty-btn" @click="gotoCategory">去逛逛</view>
    </view>

    <view v-else class="cart-content">
      <view class="cart-header">
        <view class="select-all" @click="toggleSelectAll">
          <view class="checkbox" :class="{ checked: isAllSelected }"></view>
          <text>全选</text>
        </view>
        <view class="delete-btn" @click="deleteSelected">删除选中</view>
      </view>

      <scroll-view class="cart-scroll" scroll-y>
        <view
          v-for="item in cartItems"
          :key="item.id"
          class="cart-item"
        >
          <view class="checkbox" :class="{ checked: item.selected }" @click="toggleSelect(item)"></view>
          <image class="item-image" :src="item.productImage || '/static/placeholder.png'" mode="aspectFill" @click="gotoProductDetail(item.productId)" />
          <view class="item-info" @click="gotoProductDetail(item.productId)">
            <view class="item-name">{{ item.productName }}</view>
            <view class="item-spec">{{ item.spec || '默认规格' }}</view>
            <view class="item-price-row">
              <text class="item-price">¥{{ item.price }}</text>
              <text v-if="item.vipPrice" class="vip-price">VIP ¥{{ item.vipPrice }}</text>
            </view>
          </view>
          <view class="quantity-control">
            <view class="qty-btn" @click="decreaseQuantity(item)">-</view>
            <text class="qty-num">{{ item.quantity }}</text>
            <view class="qty-btn" @click="increaseQuantity(item)">+</view>
          </view>
        </view>
      </scroll-view>

      <view class="cart-footer">
        <view class="footer-info">
          <view class="select-all-footer" @click="toggleSelectAll">
            <view class="checkbox" :class="{ checked: isAllSelected }"></view>
            <text>全选</text>
          </view>
          <view class="total-info">
            <text>合计:</text>
            <text class="total-price">¥{{ totalPrice }}</text>
          </view>
          <view class="shipping-info">
            <text v-if="totalPrice >= freeShippingThreshold">免运费</text>
            <text v-else>运费 ¥{{ shippingFee }}</text>
          </view>
        </view>
        <view class="checkout-btn" @click="gotoCheckout">
          结算({{ selectedCount }})
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMallStore } from '../../stores/mall'

interface CartItem {
  id: string
  productId: string
  productName: string
  productImage: string
  spec?: string
  price: number
  vipPrice?: number
  quantity: number
  selected: boolean
}

const mallStore = useMallStore()
const cartItems = ref<CartItem[]>([])
const freeShippingThreshold = ref<number>(99)
const shippingFee = ref<number>(10)

const isAllSelected = computed(() => {
  return cartItems.value.length > 0 && cartItems.value.every(item => item.selected)
})

const selectedCount = computed(() => {
  return cartItems.value.filter(item => item.selected).length
})

const totalPrice = computed(() => {
  return cartItems.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + (item.vipPrice || item.price) * item.quantity, 0)
    .toFixed(2)
})

const toggleSelect = (item: CartItem) => {
  item.selected = !item.selected
}

const toggleSelectAll = () => {
  const allSelected = isAllSelected.value
  cartItems.value.forEach(item => {
    item.selected = !allSelected
  })
}

const increaseQuantity = async (item: CartItem) => {
  item.quantity++
  try {
    await mallStore.updateCartItemAction(item.id, { quantity: item.quantity })
  } catch (error) {
    item.quantity--
    console.error('更新数量失败:', error)
  }
}

const decreaseQuantity = async (item: CartItem) => {
  if (item.quantity <= 1) return
  item.quantity--
  try {
    await mallStore.updateCartItemAction(item.id, { quantity: item.quantity })
  } catch (error) {
    item.quantity++
    console.error('更新数量失败:', error)
  }
}

const deleteSelected = async () => {
  const selectedItems = cartItems.value.filter(item => item.selected)
  if (selectedItems.length === 0) {
    uni.showToast({ title: '请先选择商品', icon: 'none' })
    return
  }
  uni.showModal({
    title: '确认删除',
    content: `确认删除${selectedItems.length}件商品？`,
    success: async (res: any) => {
      if (res.confirm) {
        for (const item of selectedItems) {
          await mallStore.removeCartItem(item.id)
        }
        cartItems.value = cartItems.value.filter(item => !item.selected)
      }
    }
  })
}

const gotoCategory = () => {
  uni.switchTab({
    url: '/pages/category/index'
  })
}

const gotoProductDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/product/detail?id=${id}`
  })
}

const gotoCheckout = () => {
  if (selectedCount.value === 0) {
    uni.showToast({ title: '请先选择商品', icon: 'none' })
    return
  }
  const selectedIds = cartItems.value.filter(item => item.selected).map(item => item.id).join(',')
  uni.navigateTo({
    url: `/pages/payment/index?cartItems=${selectedIds}`
  })
}

const fetchCart = async () => {
  try {
    const response = await mallStore.fetchCart()
    cartItems.value = (response.data || []).map(item => ({
      ...item,
      selected: item.selected || false
    }))
  } catch (error) {
    console.error('获取购物车失败:', error)
  }
}

onMounted(() => {
  fetchCart()
})
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.empty-btn {
  padding: 20rpx 60rpx;
  background-color: #007aff;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.cart-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 20rpx 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.select-all {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 28rpx;
  color: #333;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #ddd;
  border-radius: 20rpx;
  position: relative;
}

.checkbox.checked {
  background-color: #007aff;
  border-color: #007aff;
}

.checkbox.checked::after {
  content: '';
  position: absolute;
  left: 12rpx;
  top: 6rpx;
  width: 14rpx;
  height: 24rpx;
  border: 3rpx solid #ffffff;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
}

.delete-btn {
  font-size: 28rpx;
  color: #ff4d4f;
}

.cart-scroll {
  flex: 1;
  padding: 20rpx;
}

.cart-item {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.item-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-left: 20rpx;
}

.item-info {
  flex: 1;
  margin-left: 20rpx;
}

.item-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-spec {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.item-price-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.item-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.vip-price {
  font-size: 22rpx;
  color: #ffa500;
  background-color: #fff5e6;
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-left: 20rpx;
}

.qty-btn {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rpx solid #ddd;
  font-size: 28rpx;
  color: #333;
}

.qty-btn:first-child {
  border-radius: 8rpx 0 0 8rpx;
}

.qty-btn:last-child {
  border-radius: 0 8rpx 8rpx 0;
}

.qty-num {
  width: 60rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1rpx solid #ddd;
  border-bottom: 1rpx solid #ddd;
  font-size: 28rpx;
  color: #333;
}

.cart-footer {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 8rpx rgba(0,0,0,0.1);
}

.footer-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.select-all-footer {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 26rpx;
}

.total-info {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #333;
}

.total-price {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff4d4f;
  margin-left: 10rpx;
}

.shipping-info {
  font-size: 24rpx;
  color: #52c41a;
}

.checkout-btn {
  padding: 20rpx 60rpx;
  background-color: #007aff;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
}
</style>