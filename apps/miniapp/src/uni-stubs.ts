export default {}

export function navigateTo(options) {
  if (options && options.url) {
    const path = options.url.replace(/^\//, '')
    window.location.hash = '#' + path
  }
}

export function redirectTo(options) {
  navigateTo(options)
}

export function switchTab(options) {
  navigateTo(options)
}

export function reLaunch(options) {
  navigateTo(options)
}

export function navigateBack() {
  window.history.back()
}

export function showToast(options) {
  console.log('showToast:', options.title)
}

export function showLoading() {}
export function hideLoading() {}
export function showModal(options) {
  console.log('showModal:', options)
}

export function request(options) {
  return fetch(options.url || '/api' + options.url, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.data ? JSON.stringify(options.data) : undefined,
  }).then(r => r.json())
}
export function getLocation() { return Promise.resolve({ latitude: 0, longitude: 0 }) }
export function makePhoneCall(options) {
  if (options.phoneNumber) window.open('tel:' + options.phoneNumber)
}
export function requestPayment(options) {
  console.log('requestPayment:', options)
  return Promise.resolve({ errMsg: 'requestPayment:ok' })
}
export function chooseAddress() {
  return Promise.resolve({
    userName: '测试用户',
    telNumber: '13800138000',
    provinceName: '北京市',
    cityName: '北京市',
    countyName: '东城区',
    detailInfo: '测试地址',
    postalCode: '100000',
    nationalCode: '100000'
  })
}
export function showActionSheet(options) {
  console.log('showActionSheet:', options)
  return Promise.resolve({ tapIndex: 0 })
}
export function setStorageSync(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('setStorageSync error:', e)
  }
}
export function getStorageSync(key) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (e) {
    return null
  }
}
export function removeStorageSync(key) {
  window.localStorage.removeItem(key)
}
export function getCurrentPages() {
  const route = window.location.hash.replace('#', '')
  const options = {}
  const queryStr = route.split('?')[1] || ''
  queryStr.split('&').forEach(pair => {
    if (pair) {
      const [k, v] = pair.split('=')
      options[decodeURIComponent(k)] = decodeURIComponent(v || '')
    }
  })
  return [{ route, options }]
}