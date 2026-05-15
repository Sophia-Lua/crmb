<template>
  <view class="vip-page">
    <view class="vip-header">
      <view class="vip-badge-large">VIP</view>
      <view class="vip-title">会员特权</view>
      <view v-if="vipLevel > 0" class="current-vip">当前等级: VIP{{ vipLevel }}</view>
      <view v-else class="current-vip">未开通VIP</view>
    </view>

    <view class="benefits-section">
      <view class="section-title">VIP权益对比</view>
      <view class="benefits-table">
        <view class="table-header">
          <view class="table-cell">权益</view>
          <view class="table-cell">普通用户</view>
          <view class="table-cell vip-cell">VIP会员</view>
        </view>
        <view v-for="benefit in benefits" :key="benefit.name" class="table-row">
          <view class="table-cell">{{ benefit.name }}</view>
          <view class="table-cell">{{ benefit.normal }}</view>
          <view class="table-cell vip-cell">{{ benefit.vip }}</view>
        </view>
      </view>
    </view>

    <view class="packages-section">
      <view class="section-title">选择套餐</view>
      <view class="package-list">
        <view
          v-for="pkg in packages"
          :key="pkg.id"
          class="package-card"
          :class="{ active: selectedPackage === pkg.id }"
          @click="selectPackage(pkg)"
        >
          <view class="package-name">{{ pkg.name }}</view>
          <view class="package-price">
            <text class="price-amount">¥{{ pkg.price }}</text>
            <text class="price-unit">/{{ pkg.unit }}</text>
          </view>
          <view v-if="pkg.discount" class="package-discount">节省 ¥{{ pkg.discount }}</view>
          <view v-if="selectedPackage === pkg.id" class="selected-mark">✓</view>
        </view>
      </view>
    </view>

    <view class="purchase-section">
      <view v-if="vipLevel > 0" class="renew-btn" @click="handlePurchase">续费VIP</view>
      <view v-else class="purchase-btn" @click="handlePurchase">立即开通</view>
      <view class="agreement">
        <view class="checkbox" :class="{ checked: agreed }" @click="agreed = !agreed"></view>
        <text>我已阅读并同意《VIP会员服务协议》</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { useMallStore } from '../../stores/mall'

interface Benefit {
  name: string
  normal: string
  vip: string
}

interface Package {
  id: string
  name: string
  price: number
  unit: string
  discount?: number
  months: number
}

const userStore = useUserStore()
const mallStore = useMallStore()
const vipLevel = ref<number>(0)
const selectedPackage = ref<string>('monthly')
const agreed = ref<boolean>(false)

const benefits = ref<Benefit[]>([
  { name: '专属VIP价格', normal: '普通价格', vip: 'VIP专享价' },
  { name: '免运费门槛', normal: '¥99', vip: '¥0' },
  { name: '优先配送', normal: '标准配送', vip: '优先配送' },
  { name: '专属客服', normal: '普通客服', vip: 'VIP专线' },
  { name: '新品优先', normal: '普通通知', vip: '提前3天' },
  { name: '售后保障', normal: '7天', vip: '30天' }
])

const packages = ref<Package[]>([
  { id: 'monthly', name: '月度会员', price: 29.9, unit: '月', months: 1 },
  { id: 'quarterly', name: '季度会员', price: 79.9, unit: '季', discount: 9.8, months: 3 },
  { id: 'yearly', name: '年度会员', price: 299, unit: '年', discount: 58.8, months: 12 }
])

const selectPackage = (pkg: Package) => {
  selectedPackage.value = pkg.id
}

const handlePurchase = async () => {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意服务协议', icon: 'none' })
    return
  }
  const pkg = packages.value.find(p => p.id === selectedPackage.value)
  if (!pkg) return

  try {
    await mallStore.purchaseVipAction({
      packageId: pkg.id,
      months: pkg.months,
      price: pkg.price
    })
    uni.showToast({ title: '开通成功', icon: 'success' })
    vipLevel.value = 1
  } catch (error) {
    uni.showToast({ title: '开通失败', icon: 'none' })
  }
}

const fetchVipInfo = async () => {
  try {
    vipLevel.value = userStore.vipLevel
    if (vipLevel.value === 0) {
      await mallStore.fetchVipInfo()
    }
  } catch (error) {
    console.error('获取VIP信息失败:', error)
  }
}

onMounted(() => {
  fetchVipInfo()
})
</script>

<style scoped>
.vip-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.vip-header {
  background: linear-gradient(135deg, #ffa500, #ff8c00);
  padding: 60rpx 30rpx;
  text-align: center;
}

.vip-badge-large {
  font-size: 80rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20rpx;
}

.vip-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10rpx;
}

.current-vip {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.benefits-section {
  background-color: #ffffff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 25rpx;
}

.benefits-table {
  border: 1rpx solid #eee;
  border-radius: 8rpx;
}

.table-header {
  display: flex;
  background-color: #f5f5f5;
  padding: 15rpx 0;
}

.table-row {
  display: flex;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #eee;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  color: #666;
  padding: 10rpx 0;
}

.table-cell.vip-cell {
  color: #ffa500;
  font-weight: bold;
}

.packages-section {
  background-color: #ffffff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.package-list {
  display: flex;
  gap: 20rpx;
}

.package-card {
  flex: 1;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  border: 2rpx solid #f5f5f5;
  position: relative;
}

.package-card.active {
  border-color: #ffa500;
  background-color: #fff5e6;
}

.package-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 15rpx;
}

.package-price {
  margin-bottom: 10rpx;
}

.price-amount {
  font-size: 40rpx;
  font-weight: bold;
  color: #ffa500;
}

.price-unit {
  font-size: 24rpx;
  color: #999;
}

.package-discount {
  font-size: 24rpx;
  color: #52c41a;
  background-color: #f6ffed;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.selected-mark {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #ffa500;
  color: #ffffff;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.purchase-section {
  padding: 40rpx 30rpx;
}

.purchase-btn, .renew-btn {
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  border-radius: 45rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
  background: linear-gradient(135deg, #ffa500, #ff8c00);
  margin-bottom: 20rpx;
}

.agreement {
  display: flex;
  align-items: center;
  gap: 15rpx;
  justify-content: center;
  font-size: 24rpx;
  color: #999;
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #ddd;
  border-radius: 18rpx;
}

.checkbox.checked {
  background-color: #ffa500;
  border-color: #ffa500;
}
</style>