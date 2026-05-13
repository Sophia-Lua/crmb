<template>
  <view class="visit-create">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-back">&#8592;</text>
      </view>
      <view class="title">新建拜访</view>
      <view class="actions">
        <button class="draft-btn" @click="saveDraft">存草稿</button>
      </view>
    </view>
    
    <scroll-view class="form-content" scroll-y>
      <!-- 客户选择 -->
      <view class="section">
        <view class="section-title">选择客户</view>
        <picker 
          mode="selector" 
          :range="customerList" 
          range-key="customerName"
          :value="selectedCustomerIndex"
          @change="onCustomerChange"
        >
          <view class="picker-item" :class="{ 'is-placeholder': !selectedCustomer }">
            {{ selectedCustomer ? selectedCustomer.customerName : '请选择客户' }}
            <text class="arrow">&#9660;</text>
          </view>
        </picker>
      </view>
      
      <!-- 拜访类型 -->
      <view class="section">
        <view class="section-title">拜访类型</view>
        <picker 
          mode="selector" 
          :range="visitTypeOptions"
          :value="visitTypeIndex"
          @change="onVisitTypeChange"
        >
          <view class="picker-item">
            {{ visitTypeOptions[visitTypeIndex] }}
            <text class="arrow">&#9660;</text>
          </view>
        </picker>
      </view>
      
      <!-- 拜访方式 -->
      <view class="section">
        <view class="section-title">拜访方式</view>
        <picker 
          mode="selector" 
          :range="visitMethodOptions"
          :value="visitMethodIndex"
          @change="onVisitMethodChange"
        >
          <view class="picker-item">
            {{ visitMethodOptions[visitMethodIndex] }}
            <text class="arrow">&#9660;</text>
          </view>
        </picker>
      </view>
      
      <!-- 拜访主题 -->
      <view class="section">
        <view class="section-title">拜访主题</view>
        <input 
          v-model="formData.subject" 
          placeholder="请输入拜访主题" 
          class="input-field"
        />
      </view>
      
      <!-- 拜访内容 -->
      <view class="section">
        <view class="section-title">拜访内容</view>
        <textarea 
          v-model="formData.content" 
          placeholder="请输入拜访内容" 
          class="textarea-field"
          maxlength="2000"
        />
        <view class="char-count">{{ formData.content.length }}/2000</view>
      </view>
      
      <!-- 客户反馈 -->
      <view class="section">
        <view class="section-title">客户反馈</view>
        <textarea 
          v-model="formData.feedback" 
          placeholder="请输入客户反馈（选填）" 
          class="textarea-field"
          maxlength="1000"
        />
      </view>
      
      <!-- 跟进计划 -->
      <view class="section">
        <view class="section-title">跟进计划</view>
        <textarea 
          v-model="formData.followUpPlan" 
          placeholder="请输入跟进计划（选填）" 
          class="textarea-field"
          maxlength="500"
        />
      </view>
      
      <!-- 图片上传 -->
      <view class="section">
        <view class="section-title">图片附件（最多9张）</view>
        <view class="images-upload">
          <view 
            v-for="(img, index) in imageList" 
            :key="index"
            class="image-item"
          >
            <image :src="img" class="upload-image" mode="aspectFill" @click="previewImage(index)" />
            <view class="image-delete" @click="removeImage(index)">
              <text class="delete-icon">&times;</text>
            </view>
          </view>
          <view 
            v-if="imageList.length < 9" 
            class="upload-btn" 
            @click="chooseImage"
          >
            <text class="upload-icon">+</text>
            <text class="upload-text">上传图片</text>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部提交按钮 -->
    <view class="footer-actions">
      <button class="submit-btn" @click="submitVisit" :disabled="!canSubmit">提交拜访</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSalesStore } from '../../stores/sales'

interface Customer {
  id: string
  customerName: string
}

interface FormData {
  customerId: string
  customerName: string
  visitType: string
  visitMethod: string
  subject: string
  content: string
  feedback: string
  followUpPlan: string
}

const salesStore = useSalesStore()

// 表单数据
const formData = ref<FormData>({
  customerId: '',
  customerName: '',
  visitType: 'first',
  visitMethod: 'onsite',
  subject: '',
  content: '',
  feedback: '',
  followUpPlan: ''
})

// 选项配置
const visitTypeOptions: string[] = ['首次拜访', '定期回访', '临时拜访', '其他']
const visitMethodOptions: string[] = ['实地拜访', '电话拜访', '视频拜访', '微信拜访']
const visitTypeIndex = ref<number>(0)
const visitMethodIndex = ref<number>(0)

// 客户选择
const customerList = ref<Customer[]>([])
const selectedCustomer = ref<Customer | null>(null)
const selectedCustomerIndex = ref<number>(-1)

// 图片列表
const imageList = ref<string[]>([])

// 是否可提交
const canSubmit = computed<boolean>(() => {
  return !!formData.value.customerId && 
         !!formData.value.subject.trim() && 
         !!formData.value.content.trim()
})

// 页面加载
onLoad(async (options: any) => {
  // 如果传入了customerId，预选客户
  if (options.customerId) {
    formData.value.customerId = options.customerId
    // 这里应该调用API获取客户信息，暂时使用默认值
    selectedCustomer.value = { customerName: '已选客户', id: options.customerId }
  }
  
  // 加载客户列表
  try {
    const response = await salesStore.fetchPublicCustomers({ page: 1, pageSize: 50 })
    customerList.value = response.data?.list || []
  } catch (error) {
    console.error('加载客户列表失败:', error)
  }
})

// 客户选择变更
const onCustomerChange = (e: any): void => {
  const index: number = e.detail.value
  selectedCustomerIndex.value = index
  selectedCustomer.value = customerList.value[index]
  formData.value.customerId = selectedCustomer.value.id
  formData.value.customerName = selectedCustomer.value.customerName
}

// 拜访类型变更
const onVisitTypeChange = (e: any): void => {
  visitTypeIndex.value = e.detail.value
  formData.value.visitType = ['first', 'regular', 'temporary', 'other'][visitTypeIndex.value]
}

// 拜访方式变更
const onVisitMethodChange = (e: any): void => {
  visitMethodIndex.value = e.detail.value
  formData.value.visitMethod = ['onsite', 'phone', 'video', 'wechat'][visitMethodIndex.value]
}

// 选择图片
const chooseImage = (): void => {
  const remaining: number = 9 - imageList.value.length
  uni.chooseImage({
    count: remaining,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res: any) => {
      imageList.value = [...imageList.value, ...res.tempFilePaths]
    }
  })
}

// 删除图片
const removeImage = (index: number): void => {
  imageList.value.splice(index, 1)
}

// 预览图片
const previewImage = (index: number): void => {
  uni.previewImage({
    current: imageList.value[index],
    urls: imageList.value
  })
}

// 返回
const goBack = (): void => {
  uni.navigateBack()
}

// 保存草稿
const saveDraft = async (): Promise<void> => {
  try {
    await salesStore.createNewVisit({
      ...formData.value,
      status: 'draft',
      images: imageList.value.map(url => ({ url, name: 'image' }))
    })
    uni.showToast({
      title: '草稿已保存',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } catch (error) {
    console.error('保存草稿失败:', error)
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    })
  }
}

// 提交拜访
const submitVisit = async (): Promise<void> => {
  if (!canSubmit.value) {
    uni.showToast({
      title: '请填写必填项',
      icon: 'none'
    })
    return
  }
  
  try {
    await salesStore.createNewVisit({
      ...formData.value,
      status: 'pending',
      images: imageList.value.map(url => ({ url, name: 'image' }))
    })
    uni.showToast({
      title: '提交成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } catch (error) {
    console.error('提交拜访失败:', error)
    uni.showToast({
      title: '提交失败',
      icon: 'none'
    })
  }
}
</script>

<style scoped>
.visit-create {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.header {
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

.draft-btn {
  height: 50rpx;
  background-color: #faad14;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
  padding: 0 20rpx;
}

.form-content {
  padding: 20rpx;
}

.section {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.picker-item {
  height: 80rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
}

.picker-item.is-placeholder {
  color: #999;
}

.arrow {
  font-size: 24rpx;
  color: #999;
}

.input-field {
  height: 80rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.textarea-field {
  width: 100%;
  min-height: 200rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.char-count {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.images-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  position: relative;
}

.upload-image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.image-delete {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0,0,0,0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  color: white;
  font-size: 32rpx;
}

.upload-btn {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
}

.upload-icon {
  font-size: 60rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
}

.footer-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);
}

.submit-btn {
  height: 80rpx;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 40rpx;
  font-size: 32rpx;
}

.submit-btn[disabled] {
  background-color: #ccc;
}
</style>
