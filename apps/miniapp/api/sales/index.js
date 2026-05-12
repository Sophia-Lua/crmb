import request from '@/api/request'

// 销售相关API

/**
 * 获取销售列表
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 */
export function getSalesList(params) {
  return request({
    url: '/sales/list',
    method: 'get',
    params
  })
}

/**
 * 获取销售详情
 * @param {string} id - 销售ID
 */
export function getSalesDetail(id) {
  return request({
    url: `/sales/detail/${id}`,
    method: 'get'
  })
}

/**
 * 处理订单
 * @param {string} id - 订单ID
 */
export function processOrder(id) {
  return request({
    url: `/sales/process/${id}`,
    method: 'post'
  })
}

/**
 * 完成订单
 * @param {string} id - 订单ID
 */
export function completeOrder(id) {
  return request({
    url: `/sales/complete/${id}`,
    method: 'post'
  })
}

/**
 * 取消订单
 * @param {string} id - 订单ID
 */
export function cancelOrder(id) {
  return request({
    url: `/sales/cancel/${id}`,
    method: 'post'
  })
}