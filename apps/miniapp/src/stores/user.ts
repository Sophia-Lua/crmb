import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../api/request'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<any>(null)
  const token = ref<string>('')
  const vipLevel = ref<number>(0)

  const login = async (data: Record<string, any>) => {
    try {
      const response = await request({
        url: '/user/login',
        method: 'post',
        data
      })
      token.value = response.data?.token || ''
      userInfo.value = response.data?.userInfo || null
      vipLevel.value = response.data?.vipLevel || 0
      return response
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    vipLevel.value = 0
  }

  const updateProfile = async (data: Record<string, any>) => {
    try {
      const response = await request({
        url: '/user/profile',
        method: 'put',
        data
      })
      userInfo.value = response.data || userInfo.value
      return response
    } catch (error) {
      console.error('更新个人信息失败:', error)
      throw error
    }
  }

  const fetchUserInfo = async () => {
    try {
      const response = await request({
        url: '/user/profile',
        method: 'get'
      })
      userInfo.value = response.data || null
      vipLevel.value = response.data?.vipLevel || 0
      return response
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  return {
    userInfo,
    token,
    vipLevel,
    login,
    logout,
    updateProfile,
    fetchUserInfo
  }
})