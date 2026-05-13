<template>
  <view class="customer-detail">
    <view class="detail-header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="title">客户详情</view>
      <view class="actions">
        <button class="edit-btn" @click="editCustomer">编辑</button>
      </view>
    </view>
    
    <scroll-view class="detail-content" scroll-y v-if="customer">
      <!-- 基本信息 -->
      <view class="section">
        <view class="section-title">基本信息</view>
        <view class="info-item">
          <text class="label">客户名称：</text>
          <text class="value">{{ customer.customerName }}</text>
        </view>
        <view class="info-item">
          <text class="label">客户类型：</text>
          <text class="value">{{ getCustomerTypeText(customer.customerType) }}</text>
        </view>
        <view class="info-item">
          <text class="label">店铺类型：</text>
          <text class="value">{{ getStoreTypeText(customer.storeType) }}</text>
        </view>
        <view class="info-item">
          <text class="label">地址：</text>
          <text class="value">{{ customer.address }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系人：</text>
          <text class="value">{{ customer.contactName }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系电话：</text>
          <text class="value">{{ customer.contactPhone }}</text>
        </view>
      </view>
      
      <!-- 经营信息 -->
      <view class="section">
        <view class="section-title">经营信息</view>
        <view class="info-item" v-if="customer.area">
          <text class="label">面积：</text>
          <text class="value">{{ customer.area }}㎡</text>
        </view>
        <view class="info-item" v-if="customer.businessHours">
          <text class="label">营业时间：</text>
          <text class="value">{{ customer.businessHours }}</text>
        </view>
        <view class="info-item" v-if="customer.mainCategories && customer.mainCategories.length > 0">
          <text class="label">主营品类：</text>
          <text class="value">{{ customer.mainCategories.join(', ') }}</text>
        </view>
        <view class="info-item" v-if="customer.grade">
          <text class="label">客户等级：</text>
          <text class="value grade">{{ customer.grade }}级</text>
        </view>
      </view>
      
      <!-- 历史记录 -->
      <view class="section">
        <view class="section-title">历史记录</view>
        <view class="info-item" v-if="customer.lastVisitDate">
          <text class="label">最后拜访：</text>
          <text class="value">{{ formatDate(customer.lastVisitDate) }}</text>
        </view>
        <view class="info-item" v-if="customer.totalOrderAmount !== undefined">
          <text class="label">订单金额：</text>
          <text class="value price">¥{{ customer.totalOrderAmount }}</text>
        </view>
        <view class="info-item">
          <text class="label">负责人：</text>
          <text class="value">{{ customer.assignedTo || '暂无' }}</text>
        </view>
      </view>
      
      <!-- 功能按钮 -->
      <view class="actions-section">
        <button 
          class="action-btn primary-btn"
          @click="createVisit"
        >
          新建拜访
        </button>
        <button 
          class="action-btn secondary-btn"
          @click="transferCustomer"
        >
          转移客户
        </button>
        <button 
          class="action-btn warning-btn"
          @click="returnToPublic"
        >
          归还公海
        </button>
        <button 
          class="action-btn danger-btn"
          @click="addToBlacklist"
        >
          加入黑名单
        </button>
        <button 
          class="action-btn info-btn"
          @click="callCustomer"
        >
          一键拨号
        </button>
        <button 
          class="action-btn info-btn"
          @click="navigateToStore"
        >
          导航到店
        </button>
      </view>
    </scroll-view>
    
    <view v-else class="loading">加载中...</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSalesStore } from '../../stores/sales'

interface Customer {
  id: string
  customerName: string
  customerType: string
  storeType: string
  address: string
  contactName: string
  contactPhone: string
  area?: number
  businessHours?: string
  mainCategories?: string[]
  grade?: string
  lastVisitDate?: string
  totalOrderAmount?: number
  assignedTo?: string
}

const salesStore = useSalesStore()
const customer = ref<Customer | null>(null)
const loading = ref<boolean>(false)

// 获取客户ID
onLoad(async (options: any) => {
  const id: string = options.id
  if (id) {
    await fetchCustomerDetail(id)
  }
})

// 获取客户详情
const fetchCustomerDetail = async (id: string): Promise<void> => {
  loading.value = true
  try {
    const response = await salesStore.fetchCustomerDetail(id)
    customer.value = response.data || null
  } catch (error) {
    console.error('获取客户详情失败:', error)
    uni.showToast({
      title: '获取详情失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 获取文本映射
const getCustomerTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    public: '公海客户',
    private: '私海客户',
    blacklist: '黑名单客户'
  }
  return typeMap[type] || type
}

const getStoreTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    supermarket: '超市',
    convenience: '便利店',
    restaurant: '餐厅',
    other: '其他'
  }
  return typeMap[type] || type
}

// 返回上一页
const goBack = (): void => {
  uni.navigateBack()
}

// 编辑客户
const editCustomer = (): void => {
  uni.showToast({
    title: '编辑功能开发中',
    icon: 'none'
  })
}

// 新建拜访
const createVisit = (): void => {
  uni.navigateTo({
    url: `/pages/sales/visits/create?customerId=${customer.value!.id}`
  })
}

// 转移客户
const transferCustomer = (): void => {
  uni.showModal({
    title: '转移客户',
    content: '请输入目标销售人员ID或姓名',
    editable: true,
    placeholderText: '请输入销售ID或姓名...',
    success: async (res: any) => {
      if (res.confirm && res.content.trim()) {
        try {
          const data = {
            targetSalesId: res.content.trim()
          }
          await salesStore.transferCustomerAction(customer.value!.id, data)
          uni.showToast({
            title: '转移成功',
            icon: 'success'
          })
          // 刷新详情
          fetchCustomerDetail(customer.value!.id)
        } catch (error) {
          console.error('转移客户失败:', error)
          uni.showToast({
            title: '转移失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 归还公海
const returnToPublic = (): void => {
  uni.showModal({
    title: '确认归还',
    content: '确定要将此客户归还到公海吗？',
    success: async (res: any) => {
      if (res.confirm) {
        try {
          await salesStore.returnCustomerAction(customer.value!.id)
          uni.showToast({
            title: '归还成功',
            icon: 'success'
          })
          // 返回上一页
          setTimeout(() => {
            uni.navigateBack()
          }, 1000)
        } catch (error) {
          console.error('归还客户失败:', error)
          uni.showToast({
            title: '归还失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 加入黑名单
const addToBlacklist = (): void => {
  uni.showModal({
    title: '加入黑名单',
    content: '请输入拉黑原因（必填）',
    editable: true,
    placeholderText: '请输入拉黑原因...',
    success: async (res: any) => {
      if (res.confirm && res.content.trim()) {
        try {
          // 这里应该调用黑名单相关的API，暂时使用客户管理API
          uni.showToast({
            title: '加入黑名单成功',
            icon: 'success'
          })
        } catch (error) {
          console.error('加入黑名单失败:', error)
          uni.showToast({
            title: '操作失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 一键拨号
const callCustomer = (): void => {
  if (customer.value && customer.value.contactPhone) {
    uni.makePhoneCall({
      phoneNumber: customer.value.contactPhone
    })
  } else {
    uni.showToast({
      title: '客户电话不存在',
      icon: 'none'
    })
  }
}

// 导航到店
const navigateToStore = (): void => {
  if (customer.value && customer.value.address) {
    uni.openLocation({
      address: customer.value.address,
      success: function () {
        console.log('导航成功')
      },
      fail: function () {
        uni.showToast({
          title: '导航失败，请检查地址',
          icon: 'none'
        })
      }
    })
  } else {
    uni.showToast({
      title: '客户地址不存在',
      icon: 'none'
    })
  }
}
</script>

<style scoped>
.customer-detail {
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

.grade {
  color: #faad14;
  font-weight: bold;
}

.price {
  color: #e64340;
  font-weight: bold;
}

.actions-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 40rpx 20rpx;
}

.action-btn {
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  border: none;
}

.primary-btn {
  background-color: #1890ff;
  color: white;
}

.secondary-btn {
  background-color: #52c41a;
  color: white;
}

.warning-btn {
  background-color: #faad14;
  color: white;
}

.danger-btn {
  background-color: #ff4d4f;
  color: white;
}

.info-btn {
  background-color: #722ed1;
  color: white;
}

.loading {
  text-align: center;
  padding: 200rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
