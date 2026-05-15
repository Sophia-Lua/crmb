import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router-h5'
import './uni.scss'
import * as uniStubs from './uni-stubs'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

app.directive('tap', {
  beforeMount(el, binding) {
    el.addEventListener('click', binding.value)
  },
})

app.config.globalProperties.$t = (key) => key

const uniGlobal = {
  navigateTo: uniStubs.navigateTo,
  redirectTo: uniStubs.redirectTo,
  switchTab: uniStubs.switchTab,
  reLaunch: uniStubs.reLaunch,
  navigateBack: uniStubs.navigateBack,
  showToast: uniStubs.showToast,
  showLoading: uniStubs.showLoading,
  hideLoading: uniStubs.hideLoading,
  showModal: uniStubs.showModal,
  showActionSheet: uniStubs.showActionSheet,
  getStorageSync: uniStubs.getStorageSync,
  setStorageSync: uniStubs.setStorageSync,
  removeStorageSync: uniStubs.removeStorageSync,
  request: uniStubs.request,
  getLocation: uniStubs.getLocation,
  makePhoneCall: uniStubs.makePhoneCall,
  requestPayment: uniStubs.requestPayment,
  chooseAddress: uniStubs.chooseAddress,
  getCurrentPages: uniStubs.getCurrentPages
}

window.uni = uniGlobal

app.mount('#app')