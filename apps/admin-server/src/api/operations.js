import { get, post, put } from '@/api/request'

export const getProducts = (params) => get('/operations/products', params)
export const getProductDetail = (id) => get(`/operations/products/${id}`)
export const createProduct = (data) => post('/operations/products', data)
export const updateProduct = (id, data) => put(`/operations/products/${id}`, data)
export const updateProductStatus = (id, data) => put(`/operations/products/${id}/status`, data)
export const syncStock = (id) => put(`/operations/products/${id}/sync-stock`)

export const getCategories = () => get('/operations/categories')
export const createCategory = (data) => post('/operations/categories', data)
export const updateCategory = (id, data) => put(`/operations/categories/${id}`, data)

export const getPromotions = (params) => get('/operations/promotions', params)
export const createPromotion = (data) => post('/operations/promotions', data)
export const updatePromotion = (id, data) => put(`/operations/promotions/${id}`, data)
export const getPromotionStatistics = (id) => get(`/operations/promotions/${id}/statistics`)

export const getCoupons = (params) => get('/operations/coupons', params)
export const createCoupon = (data) => post('/operations/coupons', data)
export const getCouponStatistics = () => get('/operations/coupons/statistics')

export const getSeckillConfig = () => get('/operations/seckill/config')
export const updateSeckillConfig = (data) => put('/operations/seckill/config', data)

export const getMerchantApplications = (params) => get('/operations/merchant-applications', params)
export const reviewMerchant = (id, data) => put(`/operations/merchant-applications/${id}/review`, data)