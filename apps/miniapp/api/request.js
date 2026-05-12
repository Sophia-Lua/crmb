import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 例如：设置token
    // const token = uni.getStorageSync('token')
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    return config
  },
  error => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// response拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const res = response.data
    
    // 假设后端返回的数据结构为 { code: 200, data: {}, message: '' }
    if (res.code === 200) {
      return res.data
    } else {
      // 根据实际情况处理错误
      uni.showToast({
        title: res.message || '请求失败',
        icon: 'none'
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  error => {
    // 对响应错误做点什么
    console.error('响应错误:', error)
    if (error.response?.status === 401) {
      // token过期，跳转到登录页
      uni.redirectTo({ url: '/pages/login/index' })
    } else {
      uni.showToast({
        title: error.message || '网络错误',
        icon: 'none'
      })
    }
    return Promise.reject(error)
  }
)

export default service