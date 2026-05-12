<template>
  <view class="visit-detail">
    <view class="detail-header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="title">拜访详情</view>
      <view class="actions" v-if="canEdit">
        <button class="edit-btn" @click="gotoEdit">编辑</button>
      </view>
    </view>
    
    <scroll-view class="detail-content" scroll-y v-if="visit">
      <!-- 客户信息 -->
      <view class="section">
        <view class="section-title">客户信息</view>
        <view class="info-item">
          <text class="label">客户名称：</text>
          <text class="value">{{ visit.customerName }}</text>
        </view>
        <view class="info-item">
          <text class="label">客户类型：</text>
          <text class="value">{{ getCustomerTypeText(visit.customerType) }}</text>
        </view>
      </view>
      
      <!-- 拜访基本信息 -->
      <view class="section">
        <view class="section-title">拜访信息</view>
        <view class="info-item">
          <text class="label">拜访类型：</text>
          <text class="value">{{ getVisitTypeText(visit.visitType) }}</text>
        </view>
        <view class="info-item">
          <text class="label">拜访方式：</text>
          <text class="value">{{ getVisitMethodText(visit.visitMethod) }}</text>
        </view>
        <view class="info-item">
          <text class="label">计划日期：</text>
          <text class="value">{{ formatDate(visit.planDate) }}</text>
        </view>
        <view class="info-item" v-if="visit.planTime">
          <text class="label">计划时间：</text>
          <text class="value">{{ visit.planTime }}</text>
        </view>
        <view class="info-item">
          <text class="label">拜访主题：</text>
          <text class="value">{{ visit.subject }}</text>
        </view>
        <view class="info-item">
          <text class="label">拜访状态：</text>
          <text class="value status" :class="getStatusClass(visit.status)">
            {{ getStatusText(visit.status) }}
          </text>
        </view>
      </view>
      
      <!-- 拜访内容 -->
      <view class="section" v-if="visit.content">
        <view class="section-title">拜访内容</view>
        <view class="content-text">{{ visit.content }}</view>
      </view>
      
      <!-- 客户反馈 -->
      <view class="section" v-if="visit.feedback">
        <view class="section-title">客户反馈</view>
        <view class="content-text">{{ visit.feedback }}</view>
      </view>
      
      <!-- 跟进计划 -->
      <view class="section" v-if="visit.followUpPlan">
        <view class="section-title">跟进计划</view>
        <view class="content-text">{{ visit.followUpPlan }}</view>
      </view>
      
      <!-- 图片附件 -->
      <view class="section" v-if="visit.images && visit.images.length > 0">
        <view class="section-title">图片附件</view>
        <view class="images-grid">
          <image 
            v-for="img in visit.images" 
            :key="img.id"
            :src="img.url" 
            class="image-item"
            mode="aspectFill"
            @click="previewImage(img.url)"
          />
        </view>
      </view>
      
      <!-- 创建信息 -->
      <view class="section">
        <view class="section-title">创建信息</view>
        <view class="info-item">
          <text class="label">创建人：</text>
          <text class="value">{{ visit.createdBy }}</text>
        </view>
        <view class="info-item">
          <text class="label">创建时间：</text>
          <text class="value">{{ formatDateTime(visit.createdAt) }}</text>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="actions-section" v-if="canOperate">
        <button 
          v-if="visit.status === 'draft'" 
          class="action-btn primary-btn"
          @click="updateStatus('pending')"
        >
          提交拜访
        </button>
        <button 
          v-if="visit.status === 'pending'" 
          class="action-btn primary-btn"
          @click="updateStatus('in_progress')"
        >
          开始拜访
        </button>
        <button 
          v-if="visit.status === 'in_progress'" 
          class="action-btn success-btn"
          @click="updateStatus('completed')"
        >
          完成拜访
        </button>
        <button 
          v-if="['draft', 'pending', 'in_progress'].includes(visit.status)" 
          class="action-btn danger-btn"
          @click="updateStatus('cancelled')"
        >
          取消拜访
        </button>
        <button 
          v-if="visit.status === 'completed'" 
          class="action-btn secondary-btn"
          @click="addFollowUpNote"
        >
          添加跟进备注
        </button>
      </view>
    </scroll-view>
    
    <view v-else class="loading">加载中...</view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSalesStore } from '../../stores/sales'

const salesStore = useSalesStore()
const visit = ref(null)
const loading = ref(false)

// 获取拜访ID
onLoad(async (options) => {
  const id = options.id
  if (id) {
    await fetchVisitDetail(id)
  }
})

// 获取拜访详情
const fetchVisitDetail = async (id) => {
  loading.value = true
  try {
    const response = await salesStore.fetchVisitDetail(id)
    visit.value = response.data || null
  } catch (error) {
    console.error('获取拜访详情失败:', error)
    uni.showToast({
      title: '获取详情失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 计算属性
const canEdit = ref(false)
const canOperate = ref(false)

// 监听数据变化更新权限
watch(() => visit.value, (newVisit) => {
  if (newVisit) {
    // 草稿和待拜访状态可以编辑
    canEdit.value = ['draft', 'pending'].includes(newVisit.status)
    // 根据状态判断可操作性
    canOperate.value = ['draft', 'pending', 'in_progress', 'completed'].includes(newVisit.status)
  }
}, { immediate: true })

// 格式化日期时间
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 获取文本映射
const getCustomerTypeText = (type) => {
  const typeMap = {
    public: '公海客户',
    private: '私海客户'
  }
  return typeMap[type] || type
}

const getVisitTypeText = (type) => {
  const typeMap = {
    first: '首次拜访',
    regular: '定期回访',
    temporary: '临时拜访',
    other: '其他'
  }
  return typeMap[type] || type
}

const getVisitMethodText = (method) => {
  const methodMap = {
    onsite: '实地拜访',
    phone: '电话拜访',
    video: '视频拜访',
    wechat: '微信拜访'
  }
  return methodMap[method] || method
}

const getStatusText = (status) => {
  const statusMap = {
    draft: '草稿',
    pending: '待拜访',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  return `status-${status}`
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转编辑
const gotoEdit = () => {
  uni.navigateTo({
    url: `/pages/sales/visits/edit?id=${visit.value.id}`
  })
}

// 预览图片
const previewImage = (url) => {
  uni.previewImage({
    urls: [url]
  })
}

// 更新状态
const updateStatus = async (newStatus) => {
  const actionMap = {
    draft: '提交',
    pending: '开始',
    in_progress: '完成',
    cancelled: '取消'
  }
  
  const actionText = actionMap[newStatus] || '更新'
  
  uni.showModal({
    title: `确认${actionText}`,
    content: `确定要${actionText}此次拜访吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          await salesStore.updateVisitRecord(visit.value.id, { status: newStatus })
          uni.showToast({
            title: `${actionText}成功`,
            icon: 'success'
          })
          // 刷新详情
          fetchVisitDetail(visit.value.id)
        } catch (error) {
          console.error(`${actionText}拜访失败:`, error)
          uni.showToast({
            title: `${actionText}失败`,
            icon: 'none'
          })
        }
      }
    }
  })
}

// 添加跟进备注
const addFollowUpNote = () => {
  uni.showModal({
    title: '添加跟进备注',
    content: '请输入跟进备注内容',
    editable: true,
    placeholderText: '请输入备注...',
    success: async (res) => {
      if (res.confirm && res.content.trim()) {
        try {
          const newContent = visit.value.content + '\n\n【跟进备注】' + res.content.trim()
          await salesStore.updateVisitRecord(visit.value.id, { content: newContent })
          uni.showToast({
            title: '备注添加成功',
            icon: 'success'
          })
          // 刷新详情
          fetchVisitDetail(visit.value.id)
        } catch (error) {
          console.error('添加备注失败:', error)
          uni.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
      }
    }
  })
}
</script>

<style scoped>
.visit-detail {
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

.actions {
  width: 120rpx;
  text-align: right;
}

.edit-btn {
  height: 60rpx;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 26rpx;
  padding: 0 20rpx;
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

.status-draft {
  color: #ffa500;
  background-color: #fff5e6;
}

.status-pending {
  color: #1890ff;
  background-color: #e6f7ff;
}

.status-in_progress {
  color: #722ed1;
  background-color: #f9f0ff;
}

.status-completed {
  color: #52c41a;
  background-color: #f6ffed;
}

.status-cancelled {
  color: #ff4d4f;
  background-color: #fff2f0;
}

.content-text {
  color: #333;
  font-size: 28rpx;
  line-height: 1.6;
  white-space: pre-wrap;
}

.images-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
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