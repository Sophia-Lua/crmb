<template>
  <view class="address-edit-page">
    <view class="form-section">
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input v-model="form.name" placeholder="收货人姓名" class="form-input" />
      </view>
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input v-model="form.phone" placeholder="手机号码" type="number" class="form-input" />
      </view>
      <view class="form-item">
        <text class="form-label">省市区</text>
        <view class="region-picker" @click="pickRegion">
          <text v-if="form.province">{{ form.province }} {{ form.city }} {{ form.district }}</text>
          <text v-else class="placeholder">请选择省市区</text>
          <text class="arrow">▼</text>
        </view>
      </view>
      <view class="form-item">
        <text class="form-label">详细地址</text>
        <textarea v-model="form.detail" placeholder="详细地址" class="form-textarea" auto-height />
      </view>
      <view class="default-row">
        <view class="checkbox" :class="{ checked: form.isDefault }" @click="form.isDefault = !form.isDefault"></view>
        <text>设为默认地址</text>
      </view>
    </view>

    <view class="save-btn" @click="saveAddress">保存</view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMallStore } from '../../stores/mall'

interface AddressForm {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

const mallStore = useMallStore()
const isEditing = ref<boolean>(false)
const form = ref<AddressForm>({
  id: '',
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

const pickRegion = () => {
  uni.showActionSheet({
    itemList: ['北京市 北京市 东城区', '上海市 上海市 黄浦区', '广东省 广州市 天河区', '浙江省 杭州市 西湖区', '江苏省 南京市 玄武区'],
    success: (res: any) => {
      const regions = [
        { province: '北京市', city: '北京市', district: '东城区' },
        { province: '上海市', city: '上海市', district: '黄浦区' },
        { province: '广东省', city: '广州市', district: '天河区' },
        { province: '浙江省', city: '杭州市', district: '西湖区' },
        { province: '江苏省', city: '南京市', district: '玄武区' }
      ]
      const selected = regions[res.tapIndex]
      form.value.province = selected.province
      form.value.city = selected.city
      form.value.district = selected.district
    }
  })
}

const saveAddress = async () => {
  if (!form.value.name.trim()) {
    uni.showToast({ title: '请输入姓名', icon: 'none' })
    return
  }
  if (!form.value.phone.trim()) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  if (!form.value.province) {
    uni.showToast({ title: '请选择省市区', icon: 'none' })
    return
  }
  if (!form.value.detail.trim()) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' })
    return
  }
  try {
    if (isEditing.value) {
      await mallStore.updateAddressAction(form.value.id, form.value)
    } else {
      await mallStore.createAddressAction(form.value)
    }
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (currentPage && currentPage.options) {
    const addrId = currentPage.options.id || ''
    if (addrId) {
      isEditing.value = true
      form.value.id = addrId
      const existingAddr = mallStore.addresses.find(a => a.id === addrId)
      if (existingAddr) {
        form.value = { ...existingAddr }
      }
    }
  }
})
</script>

<style scoped>
.address-edit-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.form-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 0 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.form-item {
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-label {
  width: 140rpx;
  font-size: 28rpx;
  color: #333;
}

.form-input {
  flex: 1;
  height: 60rpx;
  font-size: 28rpx;
}

.form-textarea {
  flex: 1;
  min-height: 80rpx;
  font-size: 28rpx;
  padding: 10rpx 0;
}

.region-picker {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60rpx;
  font-size: 28rpx;
}

.placeholder {
  color: #999;
}

.arrow {
  font-size: 20rpx;
  color: #999;
}

.default-row {
  display: flex;
  align-items: center;
  gap: 15rpx;
  padding: 25rpx 0;
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #ddd;
  border-radius: 18rpx;
}

.checkbox.checked {
  background-color: #007aff;
  border-color: #007aff;
}

.save-btn {
  margin-top: 40rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #007aff;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 30rpx;
}
</style>