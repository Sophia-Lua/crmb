<template>
  <view class="store-detail">
    <view class="detail-header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="title">店铺详情</view>
    </view>
    
    <scroll-view class="detail-content" scroll-y v-if="store">
      <!-- 店铺基本信息 -->
      <view class="section">
        <view class="section-title">店铺信息</view>
        <view class="info-item">
          <text class="label">店铺名称：</text>
          <text class="value">{{ store.storeName }}</text>
        </view>
        <view class="info-item">
          <text class="label">店铺类型：</text>
          <text class="value">{{ getStoreTypeText(store.storeType) }}</text>
        </view>
        <view class="info-item">
          <text class="label">地址：</text>
          <text class="value">{{ store.address }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系人：</text>
          <text class="value">{{ store.contactName }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系电话：</text>
          <text class="value">{{ store.contactPhone }}</text>
        </view>
        <view class="info-item" v-if="store.area">
          <text class="label">面积：</text>
          <text class="value">{{ store.area }}㎡</text>
        </view>
      </view>
      
      <!-- 资质图片 -->
      <view class="section" v-if="store.licenses && store.licenses.length > 0">
        <view class="section-title">资质证明</view>
        <view class="licenses-grid">
          <view 
            v-for="license in store.licenses" 
            :key="license.id"
            class="license-item"
            @click="previewImage(license.url)"
          >
            <image :src="license.url" class="license-image" mode="aspectFill" />
            <view class="license-type">{{ license.type }}</view>
          </view>
        </view>
      </view>
      
      <!-- 审核信息 -->
      <view class="section" v-if="store.status !== 'unclaimed'">
        <view class="section-title">审核信息</view>
        <view class="info-item">
          <text class="label">当前状态：</text>
          <text class="value status" :class="getStatusClass(store.status)">
            {{ getStatusText(store.status) }}
          </text>
        </view>
        <view class="info-item" v-if="store.rejectReason">
          <text class="label">驳回原因：</text>
          <text class="value">{{ store.rejectReason }}</text>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="actions-section" v-if="canOperate">
        <button 
          v-if="store.status === 'unclaimed'" 
          class="action-btn primary-btn"
          @click="claimStore"
        >
          领取店铺
        </button>
        <button 
          v-if="store.status === 'pending'" 
          class="action-btn success-btn"
          @click="reviewStore(true)"
        >
          审核通过
        </button>
        <button 
          v-if="store.status === 'pending'" 
          class="action-btn danger-btn"
          @click="reviewStore(false)"
        >
          驳回申请
        </button>
        <button 
          v-if="store.status === 'approved'" 
          class="action-btn secondary-btn"
          @click="assignStore"
        >
          分配销售
        </button>
      </view>
    </scroll-view>
    
    <view v-else class="loading">加载中...</view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSalesStore } from '../../stores/sales'

interface StoreLicense {
  id: string
  url: string
  type: string
}

interface Store {
  id: string
  storeName: string
  storeType: string
  address: string
  contactName: string
  contactPhone: string
  area?: number
  licenses?: StoreLicense[]
  status: string
  rejectReason?: string
}

const salesStore = useSalesStore()
const store = ref<Store | null>(null)
const loading = ref<boolean>(false)

// 获取店铺ID
onLoad(async (options: any) => {
  const id: string = options.id
  if (id) {
    await fetchStoreDetail(id)
  }
})

// 获取店铺详情
const fetchStoreDetail = async (id: string): Promise<void> => {
  loading.value = true
  try {
    const response = await salesStore.fetchStoreDetail(id)
    store.value = response.data || null
  } catch (error) {
    console.error('获取店铺详情失败:', error)
    uni.showToast({
      title: '获取详情失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 计算属性
const canOperate = ref<boolean>(false)

// 监听数据变化更新权限
watch(() => store.value, (newStore: Store | null) => {
  if (newStore) {
    // 根据状态判断可操作性
    canOperate.value = ['unclaimed', 'pending', 'approved'].includes(newStore.status)
  }
}, { immediate: true })

// 获取文本映射
const getStoreTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    supermarket: '超市',
    convenience: '便利店',
    restaurant: '餐厅',
    other: '其他'
  }
  return typeMap[type] || type
}

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    unclaimed: '待领取',
    pending: '待审核',
    reviewing: '审核中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string): string => {
  const classMap: Record<string, string> = {
    unclaimed: 'status-pending',
    pending: 'status-warning',
    reviewing: 'status-processing',
    approved: 'status-success',
    rejected: 'status-error'
  }
  return classMap[status] || 'status-default'
}

// 返回上一页
const goBack = (): void => {
  uni.navigateBack()
}

// 预览图片
const previewImage = (url: string): void => {
  uni.previewImage({
    urls: [url]
  })
}

// 领取店铺
const claimStore = async (): Promise<void> => {
  uni.showModal({
    title: '确认领取',
    content: '确定要领取此店铺吗？',
    success: async (res: any) => {
      if (res.confirm) {
        try {
          await salesStore.claimStoreAction(store.value!.id)
          uni.showToast({
            title: '领取成功',
            icon: 'success'
          })
          // 刷新详情
          fetchStoreDetail(store.value!.id)
        } catch (error) {
          console.error('领取店铺失败:', error)
          uni.showToast({
            title: '领取失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 审核店铺
const reviewStore = async (approved: boolean): Promise<void> => {
  if (!approved) {
    uni.showModal({
      title: '输入驳回原因',
      content: '请输入驳回原因（至少10个字符）',
      editable: true,
      placeholderText: '请输入驳回原因...',
      success: async (res: any) => {
        if (res.confirm && res.content.trim().length >= 10) {
          await performReview(false, res.content.trim())
        } else if (res.confirm) {
          uni.showToast({
            title: '驳回原因至少10个字符',
            icon: 'none'
          })
        }
      }
    })
  } else {
    await performReview(true, '')
  }
}

const performReview = async (approved: boolean, rejectReason: string): Promise<void> => {
  try {
    const data = {
      approved: approved,
      rejectReason: rejectReason || undefined
    }
    await salesStore.reviewStoreAction(store.value!.id, data)
    uni.showToast({
      title: approved ? '审核通过' : '驳回成功',
      icon: 'success'
    })
    // 刷新详情
    fetchStoreDetail(store.value!.id)
  } catch (error) {
    console.error('审核店铺失败:', error)
    uni.showToast({
      title: '审核失败',
      icon: 'none'
    })
  }
}

// 分配店铺
const assignStore = (): void => {
  uni.showModal({
    title: '分配销售',
    content: '请输入销售人员ID或姓名',
    editable: true,
    placeholderText: '请输入销售ID或姓名...',
    success: async (res: any) => {
      if (res.confirm && res.content.trim()) {
        try {
          const data = {
            salesId: res.content.trim()
          }
          await salesStore.assignStoreAction(store.value!.id, data)
          uni.showToast({
            title: '分配成功',
            icon: 'success'
          })
          // 刷新详情
          fetchStoreDetail(store.value!.id)
        } catch (error) {
          console.error('分配店铺失败:', error)
          uni.showToast({
            title: '分配失败',
            icon: 'none'
          })
        }
      }
    }
  })
}
</script>

<style scoped>
.store-detail {
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
  flex: 1;
  text-align: center;
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

.status-warning {
  color: #faad14;
  background-color: #fffbe6;
}

.status-processing {
  color: #1890ff;
  background-color: #e6f7ff;
}

.status-success {
  color: #52c41a;
  background-color: #f6ffed;
}

.status-error {
  color: #ff4d4f;
  background-color: #fff2f0;
}

.status-default {
  color: #666;
  background-color: #f5f5f5;
}

.licenses-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.license-item {
  width: 200rpx;
}

.license-image {
  width: 100%;
  height: 200rpx;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}

.license-type {
  font-size: 24rpx;
  color: #666;
  text-align: center;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 40rpx 20rpx;
}

.action-btn {
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 30rpx;
  border: none;
}

.primary-btn {
  background-color: #1890ff;
  color: white;
}

.success-btn {
  background-color: #52c41a;
  color: white;
}

.danger-btn {
  background-color: #ff4d4f;
  color: white;
}

.secondary-btn {
  background-color: #faad14;
  color: white;
}

.loading {
  text-align: center;
  padding: 200rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
