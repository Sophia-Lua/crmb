<template>
  <view class="search-page">
    <view class="search-header">
      <input v-model="keyword" placeholder="搜索商品" class="search-input" focus @confirm="doSearch" />
      <view class="search-btn" @click="doSearch">搜索</view>
      <view class="cancel-btn" @click="goBack">取消</view>
    </view>

    <view v-if="!hasSearched" class="search-suggestions">
      <view v-if="hotKeywords.length > 0" class="hot-section">
        <view class="section-title">热门搜索</view>
        <view class="tag-list">
          <view v-for="kw in hotKeywords" :key="kw" class="hot-tag" @click="searchByKeyword(kw)">{{ kw }}</view>
        </view>
      </view>

      <view v-if="searchHistory.length > 0" class="history-section">
        <view class="history-header">
          <view class="section-title">搜索历史</view>
          <view class="clear-btn" @click="clearHistory">清除</view>
        </view>
        <view class="tag-list">
          <view v-for="kw in searchHistory" :key="kw" class="history-tag" @click="searchByKeyword(kw)">{{ kw }}</view>
        </view>
      </view>
    </view>

    <view v-else class="search-results">
      <view v-if="loading" class="loading">搜索中...</view>
      <view v-else-if="results.length === 0" class="empty">没有找到相关商品</view>
      <scroll-view v-else class="results-scroll" scroll-y @scrolltolower="loadMore">
        <view class="results-grid">
          <view
            v-for="product in results"
            :key="product.id"
            class="result-card"
            @click="gotoProductDetail(product.id)"
          >
            <image class="product-image" :src="product.image || '/static/placeholder.png'" mode="aspectFill" />
            <view class="product-info">
              <text class="product-name">{{ product.name }}</text>
              <view class="price-row">
                <text class="product-price">¥{{ product.price }}</text>
                <text v-if="product.vipPrice" class="vip-price">VIP ¥{{ product.vipPrice }}</text>
              </view>
              <text class="product-sales">已售 {{ product.sales || 0 }}</text>
            </view>
          </view>
        </view>
        <view v-if="hasMore" class="load-more">加载更多...</view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMallStore } from '../../stores/mall'

interface Product {
  id: string
  name: string
  image: string
  price: number
  vipPrice?: number
  sales: number
}

const mallStore = useMallStore()
const keyword = ref<string>('')
const hasSearched = ref<boolean>(false)
const loading = ref<boolean>(false)
const results = ref<Product[]>([])
const hasMore = ref<boolean>(true)
const currentPage = ref<number>(1)
const hotKeywords = ref<string[]>(['零食', '饮料', '酒水', '日用品', '调味品', '新品'])
const searchHistory = ref<string[]>([])

const doSearch = () => {
  if (!keyword.value.trim()) return
  hasSearched.value = true
  currentPage.value = 1
  fetchResults(true)
}

const searchByKeyword = (kw: string) => {
  keyword.value = kw
  doSearch()
}

const fetchResults = async (reset: boolean = false) => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      keyword: keyword.value,
      page: reset ? 1 : currentPage.value,
      pageSize: 20
    }
    const response = await mallStore.searchProductsAction(params)
    const list = response.data?.list || []
    if (reset) {
      results.value = list
      currentPage.value = 1
    } else {
      results.value = [...results.value, ...list]
      currentPage.value++
    }
    hasMore.value = response.data?.hasMore || false
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (!hasMore.value || loading.value) return
  fetchResults()
}

const clearHistory = () => {
  searchHistory.value = []
  mallStore.clearSearchHistory()
}

const gotoProductDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/product/detail?id=${id}`
  })
}

const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (currentPage && currentPage.options) {
    const initialKeyword = currentPage.options.keyword || ''
    if (initialKeyword) {
      keyword.value = initialKeyword
      hasSearched.value = true
      fetchResults(true)
    }
  }
  searchHistory.value = mallStore.searchHistory
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.search-header {
  display: flex;
  align-items: center;
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
  margin-left: 15rpx;
  background-color: #007aff;
  color: #ffffff;
  border-radius: 30rpx;
  font-size: 28rpx;
  text-align: center;
}

.cancel-btn {
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 20rpx;
  margin-left: 15rpx;
  font-size: 28rpx;
  color: #666;
}

.search-suggestions {
  padding: 30rpx;
}

.hot-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.hot-tag {
  padding: 12rpx 24rpx;
  background-color: #fff5e6;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #ff6600;
}

.history-section {
  margin-bottom: 40rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.clear-btn {
  font-size: 26rpx;
  color: #999;
}

.history-tag {
  padding: 12rpx 24rpx;
  background-color: #f0f0f0;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #666;
}

.search-results {
  flex: 1;
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.results-scroll {
  height: calc(100vh - 120rpx);
  padding: 20rpx;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.result-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 280rpx;
}

.product-info {
  padding: 15rpx 20rpx;
}

.product-name {
  font-size: 26rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 10rpx;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 8rpx;
}

.product-price {
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

.product-sales {
  font-size: 22rpx;
  color: #999;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 26rpx;
}
</style>