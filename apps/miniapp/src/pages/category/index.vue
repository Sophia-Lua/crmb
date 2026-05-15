<template>
  <view class="category-page">
    <view class="search-bar">
      <input v-model="searchKeyword" placeholder="搜索商品" class="search-input" @confirm="handleSearch" />
      <view class="search-btn" @click="handleSearch">搜索</view>
    </view>

    <view v-if="hotKeywords.length > 0" class="hot-search">
      <view class="hot-title">热门搜索</view>
      <view class="hot-tags">
        <view v-for="kw in hotKeywords" :key="kw" class="hot-tag" @click="searchByKeyword(kw)">{{ kw }}</view>
      </view>
    </view>

    <view v-if="showSearchHistory && searchHistoryList.length > 0" class="history-section">
      <view class="history-header">
        <view class="history-title">搜索历史</view>
        <view class="history-clear" @click="clearHistory">清除</view>
      </view>
      <view class="history-tags">
        <view v-for="kw in searchHistoryList" :key="kw" class="history-tag" @click="searchByKeyword(kw)">{{ kw }}</view>
      </view>
    </view>

    <view class="category-content">
      <scroll-view class="left-scroll" scroll-y>
        <view
          v-for="cat in categories"
          :key="cat.id"
          class="left-item"
          :class="{ active: currentCategoryId === cat.id }"
          @click="selectCategory(cat)"
        >
          <text>{{ cat.name }}</text>
        </view>
      </scroll-view>

      <scroll-view class="right-scroll" scroll-y>
        <view v-if="currentSubCategories.length > 0" class="sub-categories">
          <view
            v-for="sub in currentSubCategories"
            :key="sub.id"
            class="sub-item"
            :class="{ active: currentSubCategoryId === sub.id }"
            @click="selectSubCategory(sub)"
          >
            {{ sub.name }}
          </view>
        </view>

        <view class="filter-bar">
          <view class="filter-item" :class="{ active: sortBy === 'default' }" @click="changeSortBy('default')">综合</view>
          <view class="filter-item" :class="{ active: sortBy === 'sales' }" @click="changeSortBy('sales')">销量</view>
          <view class="filter-item" :class="{ active: sortBy === 'price' }" @click="changeSortBy('price')">
            价格
            <text v-if="sortBy === 'price'" class="sort-arrow">{{ priceAsc ? '↑' : '↓' }}</text>
          </view>
          <view class="filter-item" :class="{ active: sortBy === 'new' }" @click="changeSortBy('new')">新品</view>
        </view>

        <view v-if="products.length === 0" class="empty">暂无商品</view>
        <view v-else class="product-grid">
          <view
            v-for="product in products"
            :key="product.id"
            class="product-card"
            @click="gotoProductDetail(product.id)"
          >
            <image class="product-image" :src="product.image || '/static/placeholder.png'" mode="aspectFill" />
            <view class="product-name">{{ product.name }}</view>
            <view class="product-price-row">
              <text class="product-price">¥{{ product.price }}</text>
              <text v-if="product.vipPrice" class="vip-price">VIP ¥{{ product.vipPrice }}</text>
            </view>
            <view class="product-sales">已售 {{ product.sales || 0 }}</view>
          </view>
        </view>

        <view v-if="loading" class="loading">加载中...</view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMallStore } from '../../stores/mall'

interface Category {
  id: string
  name: string
  children?: Category[]
}

interface Product {
  id: string
  name: string
  image: string
  price: number
  vipPrice?: number
  sales: number
}

const mallStore = useMallStore()
const searchKeyword = ref<string>('')
const currentCategoryId = ref<string>('')
const currentSubCategoryId = ref<string>('')
const sortBy = ref<string>('default')
const priceAsc = ref<boolean>(true)
const loading = ref<boolean>(false)
const hotKeywords = ref<string[]>(['零食', '饮料', '酒水', '日用品', '调味品'])
const showSearchHistory = ref<boolean>(true)
const searchHistoryList = ref<string[]>([])

const categories = ref<Category[]>([])
const products = ref<Product[]>([])

const currentSubCategories = computed(() => {
  const current = categories.value.find(c => c.id === currentCategoryId.value)
  return current?.children || []
})

const selectCategory = (cat: Category) => {
  currentCategoryId.value = cat.id
  currentSubCategoryId.value = ''
  fetchProducts()
}

const selectSubCategory = (sub: Category) => {
  currentSubCategoryId.value = sub.id
  fetchProducts()
}

const changeSortBy = (sort: string) => {
  if (sort === 'price' && sortBy.value === 'price') {
    priceAsc.value = !priceAsc.value
  }
  sortBy.value = sort
  fetchProducts()
}

const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  showSearchHistory.value = false
  searchByKeyword(searchKeyword.value.trim())
}

const searchByKeyword = (keyword: string) => {
  searchKeyword.value = keyword
  if (!searchHistoryList.value.includes(keyword)) {
    searchHistoryList.value.unshift(keyword)
    if (searchHistoryList.value.length > 10) searchHistoryList.value.pop()
  }
  showSearchHistory.value = false
  uni.navigateTo({
    url: `/pages/search/index?keyword=${keyword}`
  })
}

const clearHistory = () => {
  searchHistoryList.value = []
}

const fetchCategories = async () => {
  try {
    const response = await mallStore.fetchCategories()
    categories.value = response.data || []
    if (categories.value.length > 0) {
      currentCategoryId.value = categories.value[0].id
    }
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      categoryId: currentSubCategoryId.value || currentCategoryId.value,
      sortBy: sortBy.value,
      priceAsc: priceAsc.value
    }
    const response = await mallStore.fetchProducts(params)
    products.value = response.data?.list || []
  } catch (error) {
    console.error('获取商品失败:', error)
  } finally {
    loading.value = false
  }
}

const gotoProductDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/product/detail?id=${id}`
  })
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.search-bar {
  display: flex;
  padding: 20rpx;
  background-color: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.search-input {
  flex: 1;
  height: 60rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.search-btn {
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 30rpx;
  margin-left: 20rpx;
  background-color: #007aff;
  color: #ffffff;
  border-radius: 30rpx;
  font-size: 28rpx;
  text-align: center;
}

.hot-search {
  background-color: #ffffff;
  padding: 20rpx;
  margin-bottom: 10rpx;
}

.hot-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.hot-tag {
  padding: 10rpx 20rpx;
  background-color: #fff5e6;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #ff6600;
}

.history-section {
  background-color: #ffffff;
  padding: 20rpx;
  margin-bottom: 10rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.history-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.history-clear {
  font-size: 24rpx;
  color: #999;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.history-tag {
  padding: 10rpx 20rpx;
  background-color: #f0f0f0;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #666;
}

.category-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.left-scroll {
  width: 180rpx;
  background-color: #ffffff;
  height: calc(100vh - 280rpx);
}

.left-item {
  padding: 30rpx 20rpx;
  text-align: center;
  font-size: 26rpx;
  color: #666;
  border-bottom: 1rpx solid #f0f0f0;
}

.left-item.active {
  background-color: #f5f5f5;
  color: #007aff;
  font-weight: bold;
  position: relative;
}

.left-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15rpx;
  bottom: 15rpx;
  width: 6rpx;
  background-color: #007aff;
  border-radius: 3rpx;
}

.right-scroll {
  flex: 1;
  height: calc(100vh - 280rpx);
  padding: 0 20rpx;
}

.sub-categories {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 0;
  gap: 15rpx;
}

.sub-item {
  padding: 10rpx 24rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #666;
  border: 1rpx solid #ddd;
}

.sub-item.active {
  background-color: #007aff;
  color: #ffffff;
  border-color: #007aff;
}

.filter-bar {
  display: flex;
  padding: 20rpx 0;
  gap: 30rpx;
}

.filter-item {
  font-size: 26rpx;
  color: #666;
  position: relative;
}

.filter-item.active {
  color: #007aff;
  font-weight: bold;
}

.sort-arrow {
  font-size: 20rpx;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding-bottom: 20rpx;
}

.product-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 280rpx;
}

.product-name {
  padding: 15rpx 20rpx 10rpx;
  font-size: 26rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price-row {
  padding: 5rpx 20rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.product-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.vip-price {
  font-size: 24rpx;
  color: #ffa500;
  background-color: #fff5e6;
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
}

.product-sales {
  padding: 5rpx 20rpx 15rpx;
  font-size: 22rpx;
  color: #999;
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>