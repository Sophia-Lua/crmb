import { defineStore } from 'pinia'
import { ref } from 'vue'
import { post, get } from '@/api/request'
import { ElMessage } from 'element-plus'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)
  const role = ref('')

  const login = async (loginForm) => {
    try {
      const res = await post('/auth/login', loginForm)
      token.value = res.data.token
      userInfo.value = res.data.userInfo
      role.value = res.data.userInfo.role
      localStorage.setItem('token', res.data.token)
      ElMessage.success('登录成功')
      router.push('/dashboard')
    } catch (error) {
      ElMessage.error('登录失败')
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    role.value = ''
    localStorage.removeItem('token')
    router.push('/login')
  }

  const getUserInfo = async () => {
    try {
      const res = await get('/auth/userinfo')
      userInfo.value = res.data
      role.value = res.data.role
    } catch (error) {
      logout()
    }
  }

  return { token, userInfo, role, login, logout, getUserInfo }
})