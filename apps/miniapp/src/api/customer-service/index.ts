import request from '../request'

export function getOrders(params: Record<string, any>) {
  return request({
    url: '/customer-service/orders',
    method: 'get',
    params
  })
}

export function getOrderDetail(id: string) {
  return request({
    url: `/customer-service/orders/${id}`,
    method: 'get'
  })
}

export function cancelOrder(id: string) {
  return request({
    url: `/customer-service/orders/${id}/cancel`,
    method: 'post'
  })
}

export function applyAfterSale(data: Record<string, any>) {
  return request({
    url: '/customer-service/after-sale',
    method: 'post',
    data
  })
}

export function getAfterSaleList(params: Record<string, any>) {
  return request({
    url: '/customer-service/after-sale',
    method: 'get',
    params
  })
}

export function submitFeedback(data: Record<string, any>) {
  return request({
    url: '/customer-service/feedback',
    method: 'post',
    data
  })
}