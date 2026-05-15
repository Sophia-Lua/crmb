import request from '../request'

export function getHomeData() {
  return request({
    url: '/mall/home',
    method: 'get'
  })
}

export function getProducts(params: Record<string, any>) {
  return request({
    url: '/mall/products',
    method: 'get',
    params
  })
}

export function getProductDetail(id: string) {
  return request({
    url: `/mall/products/${id}`,
    method: 'get'
  })
}

export function getCategories() {
  return request({
    url: '/mall/categories',
    method: 'get'
  })
}

export function getCart() {
  return request({
    url: '/mall/cart',
    method: 'get'
  })
}

export function addToCart(data: Record<string, any>) {
  return request({
    url: '/mall/cart',
    method: 'post',
    data
  })
}

export function updateCartItem(id: string, data: Record<string, any>) {
  return request({
    url: `/mall/cart/${id}`,
    method: 'put',
    data
  })
}

export function deleteCartItem(id: string) {
  return request({
    url: `/mall/cart/${id}`,
    method: 'delete'
  })
}

export function clearCart() {
  return request({
    url: '/mall/cart/clear',
    method: 'delete'
  })
}

export function createOrder(data: Record<string, any>) {
  return request({
    url: '/mall/orders',
    method: 'post',
    data
  })
}

export function getOrderList(params: Record<string, any>) {
  return request({
    url: '/mall/orders',
    method: 'get',
    params
  })
}

export function getOrderDetail(id: string) {
  return request({
    url: `/mall/orders/${id}`,
    method: 'get'
  })
}

export function cancelOrder(id: string) {
  return request({
    url: `/mall/orders/${id}/cancel`,
    method: 'post'
  })
}

export function confirmReceive(id: string) {
  return request({
    url: `/mall/orders/${id}/confirm`,
    method: 'post'
  })
}

export function getAddresses() {
  return request({
    url: '/mall/addresses',
    method: 'get'
  })
}

export function createAddress(data: Record<string, any>) {
  return request({
    url: '/mall/addresses',
    method: 'post',
    data
  })
}

export function updateAddress(id: string, data: Record<string, any>) {
  return request({
    url: `/mall/addresses/${id}`,
    method: 'put',
    data
  })
}

export function deleteAddress(id: string) {
  return request({
    url: `/mall/addresses/${id}`,
    method: 'delete'
  })
}

export function getVipInfo() {
  return request({
    url: '/mall/vip/info',
    method: 'get'
  })
}

export function purchaseVip(data: Record<string, any>) {
  return request({
    url: '/mall/vip/purchase',
    method: 'post',
    data
  })
}

export function searchProducts(params: Record<string, any>) {
  return request({
    url: '/mall/products/search',
    method: 'get',
    params
  })
}

export function applyAfterSale(data: Record<string, any>) {
  return request({
    url: '/mall/after-sale',
    method: 'post',
    data
  })
}