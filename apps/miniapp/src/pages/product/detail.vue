<template>
  <view class="product-detail-page">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="!product" class="empty">商品不存在</view>
    <view v-else class="detail-content">
      <swiper class="image-swiper" indicator-dots autoplay circular>
        <swiper-item v-for="(img, idx) in product.images" :key="idx">
          <image class="swiper-image" :src="img" mode="aspectFill" />
        </swiper-item>
        <swiper-item v-if="product.images.length === 0">
          <image class="swiper-image" src="/static/placeholder.png" mode="aspectFill" />
        </swiper-item>
      </swiper>

      <view class="product-basic">
        <view class="price-row">
          <text class="product-price">¥{{ product.price }}</text>
          <text v-if="product.vipPrice" class="vip-price">VIP ¥{{ product.vipPrice }}</text>
        </view>
        <view v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
          原价 ¥{{ product.originalPrice }}
        </view>
        <text class="product-name">{{ product.name }}</text>
        <text class="product-sales">已售 {{ product.sales || 0 }} | 库存 {{ product.stock || 0 }}</text>
      </view>

      <view class="spec-section" v-if="product.specs && product.specs.length > 0">
        <view class="section-title">规格选择</view>
        <view class="spec-list">
          <view
            v-for="spec in product.specs"
            :key="spec.id"
            class="spec-item"
            :class="{ active: selectedSpecId === spec.id }"
            @click="selectSpec(spec)"
          >
            {{ spec.name }}
          </view>
        </view>
      </view>

      <view class="desc-section">
        <view class="section-title">商品描述</view>
        <view class="desc-content">
          <rich-text :nodes="product.description || '暂无描述'"></rich-text>
        </view>
      </view>

      <view class="detail-section" v-if="product.detailImages && product.detailImages.length > 0">
        <view class="section-title">商品详情</view>
        <view class="detail-images">
          <image v-for="(img, idx) in product.detailImages" :key="idx" class="detail-img" :src="img" mode="widthFix" />
        </view>
      </view>
    </view>

    <view v-if="product" class="bottom-bar">
      <view class="bar-icon home-icon" @click="gotoHome">首页</view>
      <view class="bar-icon cart-icon" @click="gotoCart">
        购物车
        <text v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</text>
      </view>
      <view class="bar-btn add-cart-btn" @click="handleAddToCart">加入购物车</view>
      <view class="bar-btn buy-now-btn" @click="handleBuyNow">立即购买</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMallStore } from '../../stores/mall'

interface Spec {
  id: string
  name: string
  price?: number
  stock?: number
}

interface Product {
  id: string
  name: string
  price: number
  vipPrice?: number
  originalPrice?: number
  sales: number
  stock: number
  images: string[]
  specs: Spec[]
  description: string
  detailImages: string[]
}

const mallStore = useMallStore()
const product = ref<Product | null>(null)
const loading = ref<boolean>(false)
const selectedSpecId = ref<string>('')
const cartCount = ref<number>(0)
const productId = ref<string>('')

const selectSpec = (spec: Spec) => {
  selectedSpecId.value = spec.id
}

const handleAddToCart = async () => {
  try {
    await mallStore.addItemToCart({
      productId: productId.value,
      specId: selectedSpecId.value || undefined,
      quantity: 1
    })
    cartCount.value++
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: '添加失败', icon: 'none' })
  }
}

const handleBuyNow = () => {
  const buyInfo = JSON.stringify({
    productId: productId.value,
    specId: selectedSpecId.value || '',
    quantity: 1
  })
  uni.navigateTo({
    url: `/pages/payment/index?buyNow=${encodeURIComponent(buyInfo)}`
  })
}

const gotoHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const gotoCart = () => {
  uni.switchTab({ url: '/pages/cart/index' })
}

const fetchProductDetail = async () => {
  loading.value = true
  try {
    const response = await mallStore.fetchProductDetail(productId.value)
    product.value = response.data || null
    if (product.value?.specs?.length > 0) {
      selectedSpecId.value = product.value.specs[0].id
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchCartCount = async () => {
  try {
    const response = await mallStore.fetchCart()
    cartCount.value = (response.data || []).reduce((sum: number, item: any) => sum + item.quantity, 0)
  } catch (error) {
    cartCount.value = 0
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (currentPage && currentPage.options) {
    productId.value = currentPage.options.id || ''
  }
  if (productId.value) {
    fetchProductDetail()
    fetchCartCount()
  }
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.image-swiper {
  width: 100%;
  height: 600rpx;
}

.swiper-image {
  width: 100%;
  height: 600rpx;
}

.product-basic {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 15rpx;
  margin-bottom: 10rpx;
}

.product-price {
  font-size: 44rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.vip-price {
  font-size: 28rpx;
  color: #ffa500;
  background-color: #fff5e6;
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
}

.original-price {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 15rpx;
}

.product-name {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.product-sales {
  font-size: 24rpx;
  color: #999;
}

.spec-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.spec-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.spec-item {
  padding: 12rpx 30rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #666;
  border: 2rpx solid #f5f5f5;
}

.spec-item.active {
  background-color: #e6f7ff;
  color: #007aff;
  border-color: #007aff;
}

.desc-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.desc-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.detail-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.detail-images {
  width: 100%;
}

.detail-img {
  width: 100%;
  margin-bottom: 10rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 15rpx 20rpx;
  box-shadow: 0 -2rpx 8rpx rgba(0,0,0,0.1);
}

.bar-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22rpx;
  color: #666;
  margin-right: 15rpx;
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  background-color: #ff4d4f;
  color: #ffffff;
  font-size: 20rpx;
  min-width: 30rpx;
  height: 30rpx;
  line-height: 30rpx;
  text-align: center;
  border-radius: 15rpx;
  padding: 0 6rpx;
}

.bar-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
  margin-left: 15rpx;
}

.add-cart-btn {
  background-color: #ffa500;
  color: #ffffff;
}

.buy-now-btn {
  background-color: #ff4d4f;
  color: #ffffff;
}
</style>