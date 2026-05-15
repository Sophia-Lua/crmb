<template>
  <view class="address-list-page">
    <view v-if="addresses.length === 0" class="empty">暂无收货地址</view>
    <scroll-view v-else class="address-scroll" scroll-y>
      <view
        v-for="addr in addresses"
        :key="addr.id"
        class="address-card"
      >
        <view class="address-content" @click="selectAddress(addr)">
          <view class="name-phone-row">
            <text class="addr-name">{{ addr.name }}</text>
            <text class="addr-phone">{{ addr.phone }}</text>
            <view v-if="addr.isDefault" class="default-tag">默认</view>
          </view>
          <view class="addr-detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</view>
        </view>
        <view class="address-actions">
          <view class="action-item" @click="setDefault(addr)">
            <view class="checkbox" :class="{ checked: addr.isDefault }"></view>
            <text>默认</text>
          </view>
          <view class="action-item edit-item" @click="editAddress(addr)">编辑</view>
          <view class="action-item delete-item" @click="deleteAddress(addr)">删除</view>
        </view>
      </view>
    </scroll-view>

    <view class="add-btn-bar">
      <view class="add-btn" @click="addNewAddress">新增收货地址</view>
    </view>

    <view v-if="showEditPopup" class="edit-popup">
      <view class="popup-mask" @click="closePopup"></view>
      <view class="popup-content">
        <view class="popup-title">{{ isEditing ? '编辑地址' : '新增地址' }}</view>
        <view class="form-item">
          <text class="form-label">姓名</text>
          <input v-model="editForm.name" placeholder="收货人姓名" class="form-input" />
        </view>
        <view class="form-item">
          <text class="form-label">手机号</text>
          <input v-model="editForm.phone" placeholder="手机号码" type="number" class="form-input" />
        </view>
        <view class="form-item">
          <text class="form-label">省市区</text>
          <view class="region-picker" @click="pickRegion">
            <text v-if="editForm.province">{{ editForm.province }}{{ editForm.city }}{{ editForm.district }}</text>
            <text v-else class="placeholder">请选择省市区</text>
            <text class="arrow">▼</text>
          </view>
        </view>
        <view class="form-item">
          <text class="form-label">详细地址</text>
          <input v-model="editForm.detail" placeholder="详细地址" class="form-input" />
        </view>
        <view class="form-item default-row">
          <view class="checkbox" :class="{ checked: editForm.isDefault }" @click="editForm.isDefault = !editForm.isDefault"></view>
          <text>设为默认地址</text>
        </view>
        <view class="popup-actions">
          <view class="popup-btn cancel" @click="closePopup">取消</view>
          <view class="popup-btn confirm" @click="saveAddress">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMallStore } from '../../stores/mall'

interface Address {
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
const addresses = ref<Address[]>([])
const showEditPopup = ref<boolean>(false)
const isEditing = ref<boolean>(false)
const editForm = ref<Address>({
  id: '',
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

const selectAddress = (addr: Address) => {
  uni.setStorageSync('selectedAddress', addr)
  uni.navigateBack()
}

const setDefault = async (addr: Address) => {
  try {
    await mallStore.updateAddressAction(addr.id, { ...addr, isDefault: true })
    fetchAddresses()
  } catch (error) {
    uni.showToast({ title: '设置失败', icon: 'none' })
  }
}

const editAddress = (addr: Address) => {
  isEditing.value = true
  editForm.value = { ...addr }
  showEditPopup.value = true
}

const addNewAddress = () => {
  isEditing.value = false
  editForm.value = {
    id: '',
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  }
  showEditPopup.value = true
}

const deleteAddress = async (addr: Address) => {
  uni.showModal({
    title: '确认删除',
    content: `确认删除${addr.name}的地址？`,
    success: async (res: any) => {
      if (res.confirm) {
        try {
          await mallStore.deleteAddressAction(addr.id)
          uni.showToast({ title: '已删除', icon: 'success' })
          fetchAddresses()
        } catch (error) {
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}

const pickRegion = () => {
  uni.showActionSheet({
    itemList: ['北京市-北京市-东城区', '上海市-上海市-黄浦区', '广东省-广州市-天河区', '浙江省-杭州市-西湖区'],
    success: (res: any) => {
      const regions = ['北京市-北京市-东城区', '上海市-上海市-黄浦区', '广东省-广州市-天河区', '浙江省-杭州市-西湖区']
      const parts = regions[res.tapIndex].split('-')
      editForm.value.province = parts[0]
      editForm.value.city = parts[1]
      editForm.value.district = parts[2]
    }
  })
}

const closePopup = () => {
  showEditPopup.value = false
}

const saveAddress = async () => {
  if (!editForm.value.name || !editForm.value.phone || !editForm.value.detail) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  try {
    if (isEditing.value) {
      await mallStore.updateAddressAction(editForm.value.id, editForm.value)
    } else {
      await mallStore.createAddressAction(editForm.value)
    }
    uni.showToast({ title: '保存成功', icon: 'success' })
    showEditPopup.value = false
    fetchAddresses()
  } catch (error) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}

const fetchAddresses = async () => {
  try {
    const response = await mallStore.fetchAddresses()
    addresses.value = response.data || []
  } catch (error) {
    console.error('获取地址失败:', error)
  }
}

onMounted(() => {
  fetchAddresses()
})
</script>

<style scoped>
.address-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.address-scroll {
  padding: 20rpx;
}

.address-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
  overflow: hidden;
}

.address-content {
  padding: 30rpx;
}

.name-phone-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 10rpx;
}

.addr-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.addr-phone {
  font-size: 28rpx;
  color: #666;
}

.default-tag {
  padding: 4rpx 12rpx;
  background-color: #007aff;
  color: #ffffff;
  border-radius: 4rpx;
  font-size: 22rpx;
}

.addr-detail {
  font-size: 26rpx;
  color: #999;
}

.address-actions {
  display: flex;
  border-top: 1rpx solid #f0f0f0;
  padding: 0 30rpx;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  font-size: 26rpx;
  color: #666;
  gap: 10rpx;
}

.edit-item {
  color: #007aff;
}

.delete-item {
  color: #ff4d4f;
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

.add-btn-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 8rpx rgba(0,0,0,0.1);
}

.add-btn {
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #007aff;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 30rpx;
}

.edit-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30rpx;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
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
  color: #333;
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
  padding: 20rpx 0;
  border-bottom: none;
}

.popup-actions {
  display: flex;
  gap: 30rpx;
  margin-top: 30rpx;
}

.popup-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.popup-btn.cancel {
  background-color: #f5f5f5;
  color: #666;
}

.popup-btn.confirm {
  background-color: #007aff;
  color: #ffffff;
}
</style>