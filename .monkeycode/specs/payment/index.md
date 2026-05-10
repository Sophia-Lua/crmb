# 支付模块 - 需求与设计文档

**模块名称**: payment  
**更新日期**: 2026-05-10  
**版本**: v1.1

---

## 第一部分：需求概述

### 1.1 模块介绍

支付模块负责商家管理和收款管理。支持电脑端和手机端。

### 1.2 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 商家 | 查看收款记录 | 自己的数据 |
| 支付管理员 | 商家管理、收款管理 | 支付全模块 |
| 管理员 | 全局管理 | 所有功能 |

### 1.3 子模块列表

| 子模块 | 电脑端 | 手机端 | 核心功能 |
|--------|--------|--------|----------|
| 商家管理 | ✅ | ✅ | 商家列表、创建、编辑、删除 |
| 收款管理 | ✅ | ✅ | 收款列表、绑定商品 |

---

## 第二部分：功能需求

### 2.1 商家管理

#### 功能描述
管理支付商家。

#### 核心功能
1. **商家列表**
   - 商家信息
   - 合作状态
   - 收款统计

2. **创建商家**
   - 商家基本信息
   - 联系人信息
   - 结算信息
   - 资质上传

3. **编辑商家**
   - 修改信息
   - 资质更新

4. **删除商家**
   - 删除确认
   - 历史记录保留

---

### 2.2 收款管理

#### 功能描述
管理收款记录。

#### 核心功能
1. **收款列表**
   - 收款记录
   - 筛选（时间、商家、支付方式）
   - 收款统计

2. **时间选择**
   - 按日期筛选
   - 按月统计

3. **绑定商品**
   - 商品关联
   - 收款分类

---

## 第三部分：数据模型

### 3.1 商家

```typescript
interface Merchant {
  id: string;
  merchantNo: string;
  name: string;
  contactName: string;
  contactPhone: string;
  settlementType: 'daily' | 'weekly' | 'monthly';  // 结算周期
  settlementAccount: SettlementAccount;
  status: 'active' | 'inactive' | 'deleted';
  qualifications: string[];                        // 资质图片
  totalCollections: number;                        // 累计收款金额
  collectionCount: number;                         // 收款笔数
  createdAt: string;
  deletedAt?: string;
}

interface SettlementAccount {
  bankName: string;
  accountNo: string;
  accountHolder: string;
  branchName?: string;                             // 开户支行
}
```

### 3.2 收款记录

```typescript
interface Collection {
  id: string;
  collectionNo: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  payType: 'wechat' | 'alipay' | 'balance' | 'cash';
  productId?: string;
  productName?: string;
  category?: string;                               // 收款分类
  status: 'success' | 'refunded' | 'cancelled';
  remark?: string;
  createdAt: string;
}
```

---

## 第四部分：API 接口设计

```typescript
// 基础路径：/api/payment

// 商家
GET  /api/payment/merchants                        // 商家列表
POST /api/payment/merchants                        // 创建商家
PUT  /api/payment/merchants/:id                    // 编辑商家
DELETE /api/payment/merchants/:id                  // 删除商家

// 收款
GET  /api/payment/collections                      // 收款列表
GET  /api/payment/collections/summary              // 收款汇总
POST /api/payment/collections/bind-product         // 绑定商品
```

---

## 第五部分：前端设计

### 5.1 目录结构

```
src/
├── views/
│   └── payment/
│       ├── merchants/
│       │   ├── List.vue
│       │   └── Create.vue
│       └── collections/
│           └── List.vue
├── stores/
│   └── payment.js
├── api/
│   └── payment.js
└── mock/
    └── payment.js
```

### 5.2 核心页面设计

#### 5.2.1 商家列表页 (电脑端)

```vue
<template>
  <div class="merchant-list-page">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建商家
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出 Excel
      </el-button>
    </div>
    
    <!-- 筛选区域 -->
    <MerchantFilter @search="handleSearch" @reset="handleReset" />
    
    <!-- 列表 -->
    <MerchantListTable
      :data="merchantList"
      :loading="loading"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      @current-change="loadList"
    />
  </div>
</template>
```

#### 5.2.2 收款详情页 (手机端)

```vue
<template>
  <view class="collection-detail-page">
    <scroll-view scroll-y>
      <!-- 收款信息 -->
      <view class="info-card">
        <text class="collection-no">收款单号: {{ collection.collectionNo }}</text>
        <view class="info-row">
          <text class="label">商家名称</text>
          <text class="value">{{ collection.merchantName }}</text>
        </view>
        <view class="info-row">
          <text class="label">收款金额</text>
          <text class="value amount">¥{{ collection.amount }}</text>
        </view>
        <view class="info-row">
          <text class="label">支付方式</text>
          <text class="value">{{ getPayTypeLabel(collection.payType) }}</text>
        </view>
        <view class="info-row">
          <text class="label">收款状态</text>
          <uni-tag :text="getStatusLabel(collection.status)" :type="getStatusType(collection.status)" />
        </view>
      </view>
      
      <!-- 商品信息 -->
      <view v-if="collection.productName" class="info-card">
        <view class="info-row">
          <text class="label">关联商品</text>
          <text class="value">{{ collection.productName }}</text>
        </view>
        <view class="info-row">
          <text class="label">收款分类</text>
          <text class="value">{{ collection.category }}</text>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="btn-primary" @click="handleBindProduct">绑定商品</button>
      </view>
    </scroll-view>
  </view>
</template>
```

### 5.3 状态管理 (Pinia)

```javascript
// src/stores/payment.js
import { defineStore } from 'pinia';
import paymentApi from '@/api/payment';

export const usePaymentStore = defineStore('payment', () => {
  // 商家状态
  const merchantList = ref([]);
  const merchantDetail = ref(null);
  const merchantStats = ref({});
  
  // 收款状态
  const collectionList = ref([]);
  const collectionDetail = ref(null);
  const collectionStats = ref({});
  
  const loading = ref(false);
  
  // Actions - 商家
  async function fetchMerchants(params) {
    loading.value = true;
    const res = await paymentApi.getMerchants(params);
    merchantList.value = res.data.list;
    loading.value = false;
  }
  
  async function fetchMerchantDetail(id) {
    const res = await paymentApi.getMerchant(id);
    merchantDetail.value = res.data;
  }
  
  async function createMerchant(data) {
    return await paymentApi.createMerchant(data);
  }
  
  async function updateMerchant(id, data) {
    return await paymentApi.updateMerchant(id, data);
  }
  
  async function deleteMerchant(id) {
    return await paymentApi.deleteMerchant(id);
  }
  
  // Actions - 收款
  async function fetchCollections(params) {
    loading.value = true;
    const res = await paymentApi.getCollections(params);
    collectionList.value = res.data.list;
    loading.value = false;
  }
  
  async function fetchCollectionDetail(id) {
    const res = await paymentApi.getCollection(id);
    collectionDetail.value = res.data;
  }
  
  async function bindProductToCollection(collectionId, productId) {
    return await paymentApi.bindProduct(collectionId, productId);
  }
  
  return {
    // State
    merchantList, merchantDetail, merchantStats,
    collectionList, collectionDetail, collectionStats,
    loading,
    // Actions
    fetchMerchants, fetchMerchantDetail, createMerchant, updateMerchant, deleteMerchant,
    fetchCollections, fetchCollectionDetail, bindProductToCollection
  };
});
```

### 5.4 API 封装

```javascript
// src/api/payment.js
import request from '@/utils/request';

// 商家管理
export function getMerchants(params) {
  return request({ url: '/api/payment/merchants', method: 'GET', params });
}

export function getMerchant(id) {
  return request({ url: `/api/payment/merchants/${id}`, method: 'GET' });
}

export function createMerchant(data) {
  return request({ url: '/api/payment/merchants', method: 'POST', data });
}

export function updateMerchant(id, data) {
  return request({ url: `/api/payment/merchants/${id}`, method: 'PUT', data });
}

export function deleteMerchant(id) {
  return request({ url: `/api/payment/merchants/${id}`, method: 'DELETE' });
}

// 收款管理
export function getCollections(params) {
  return request({ url: '/api/payment/collections', method: 'GET', params });
}

export function getCollectionSummary(params) {
  return request({ url: '/api/payment/collections/summary', method: 'GET', params });
}

export function bindProduct(collectionId, data) {
  return request({ url: '/api/payment/collections/bind-product', method: 'POST', data });
}
```

### 5.5 后端Go实现

#### 目录结构
```
internal/
├── handler/
│   └── payment/
│       ├── merchant_handler.go
│       └── collection_handler.go
├── service/
│   └── payment/
│       ├── merchant_service.go
│       └── collection_service.go
├── model/
│   └── payment/
│       ├── merchant.go
│       └── collection.go
└── dto/
    └── payment/
        ├── merchant_dto.go
        └── collection_dto.go
```

#### 核心Handler示例
```go
// internal/handler/payment/merchant_handler.go
package payment

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "your-project/internal/service/payment"
    "your-project/internal/dto/payment"
)

type MerchantHandler struct {
    merchantService *payment.MerchantService
}

func NewMerchantHandler(merchantService *payment.MerchantService) *MerchantHandler {
    return &MerchantHandler{
        merchantService: merchantService,
    }
}

// GetMerchants 获取商家列表
func (h *MerchantHandler) GetMerchants(c *gin.Context) {
    var req payment.GetMerchantsRequest
    if err := c.ShouldBindQuery(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    merchants, total, err := h.merchantService.GetMerchants(c.Request.Context(), &req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "code": 200,
        "message": "success",
        "data": gin.H{
            "list": merchants,
            "total": total,
            "page": req.Page,
            "pageSize": req.PageSize,
        },
    })
}

// CreateMerchant 创建商家
func (h *MerchantHandler) CreateMerchant(c *gin.Context) {
    var req payment.CreateMerchantRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    merchant, err := h.merchantService.CreateMerchant(c.Request.Context(), &req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "code": 200,
        "message": "success",
        "data": merchant,
    })
}
```

#### Service层示例
```go
// internal/service/payment/merchant_service.go
package payment

import (
    "context"
    "your-project/internal/model/payment"
    "your-project/internal/repository"
)

type MerchantService struct {
    merchantRepo repository.MerchantRepository
}

func NewMerchantService(merchantRepo repository.MerchantRepository) *MerchantService {
    return &MerchantService{
        merchantRepo: merchantRepo,
    }
}

func (s *MerchantService) GetMerchants(ctx context.Context, req *GetMerchantsRequest) ([]*payment.Merchant, int64, error) {
    merchants, total, err := s.merchantRepo.FindByConditions(ctx, req.ToQueryConditions())
    if err != nil {
        return nil, 0, err
    }
    
    return merchants, total, nil
}

func (s *MerchantService) CreateMerchant(ctx context.Context, req *CreateMerchantRequest) (*payment.Merchant, error) {
    if err := req.Validate(); err != nil {
        return nil, err
    }
    
    merchant := &payment.Merchant{
        MerchantNo:     req.MerchantNo,
        Name:          req.Name,
        ContactName:   req.ContactName,
        ContactPhone:  req.ContactPhone,
        SettlementType: req.SettlementType,
        Status:        "active",
    }
    
    err := s.merchantRepo.Create(ctx, merchant)
    if err != nil {
        return nil, err
    }
    
    return merchant, nil
}
```

---

## 第六部分：Mock 数据方案

### 6.1 Mock 配置

```javascript
// src/mock/payment.js
import Mock from 'mockjs';

// 商家 Mock
Mock.mock(/\/api\/payment\/merchants(\?.*)?$/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(params.get('page')) || 1;
  const pageSize = parseInt(params.get('pageSize')) || 20;
  
  const merchants = Mock.mock({
    'list|50': [{
      'id|+1': 1,
      'merchantNo': '@string("M", 8)',
      'name': '@ctitle(4,8)商家',
      'contactName': '@cname',
      'contactPhone': /^1[3-9]\d{9}$/,
      'settlementType|1': ['daily', 'weekly', 'monthly'],
      'status|1': ['active', 'inactive'],
      'totalCollections|1000-100000': 1,
      'collectionCount|10-1000': 1,
      'createdAt': '@datetime'
    }]
  });
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: merchants.list.slice(start, end),
      total: merchants.list.length,
      page,
      pageSize
    }
  };
});

// 收款记录 Mock
Mock.mock(/\/api\/payment\/collections(\?.*)?$/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(params.get('page')) || 1;
  const pageSize = parseInt(params.get('pageSize')) || 20;
  
  const collections = Mock.mock({
    'list|100': [{
      'id|+1': 1,
      'collectionNo': '@string("C", 10)',
      'merchantId|1-50': 1,
      'merchantName': '@ctitle(4,8)商家',
      'amount|100-10000': 1,
      'payType|1': ['wechat', 'alipay', 'balance', 'cash'],
      'productId|1-1000': 1,
      'productName': '@ctitle(5,10)',
      'category': '@ctitle(2,4)',
      'status|1': ['success', 'refunded', 'cancelled'],
      'createdAt': '@datetime'
    }]
  });
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: collections.list.slice(start, end),
      total: collections.list.length,
      page,
      pageSize
    }
  };
});

// 收款汇总 Mock
Mock.mock(/\/api\/payment\/collections\/summary(\?.*)?$/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: {
      totalAmount: Mock.Random.float(10000, 1000000, 2),
      totalCount: Mock.Random.integer(100, 10000),
      todayAmount: Mock.Random.float(1000, 50000, 2),
      todayCount: Mock.Random.integer(10, 500),
      payTypeBreakdown: {
        wechat: Mock.Random.float(30, 70, 2),
        alipay: Mock.Random.float(20, 50, 2),
        balance: Mock.Random.float(5, 20, 2),
        cash: Mock.Random.float(1, 10, 2)
      }
    }
  };
});
```

---

## 第七部分：权限控制

### 7.1 路由权限

```javascript
// src/router/permission.js
const routePermissions = {
  'payment:merchants:view': ['/payment/merchants', '/payment/merchants/:id'],
  'payment:merchants:create': ['/payment/merchants/create'],
  'payment:merchants:edit': ['/payment/merchants/:id/edit'],
  'payment:merchants:delete': ['/payment/merchants/:id/delete'],
  'payment:collections:view': ['/payment/collections', '/payment/collections/:id'],
  'payment:collections:bind': ['/payment/collections/:id/bind-product']
};

router.beforeEach((to, from, next) => {
  const userPermissions = getUserPermissions();
  const requiredPermission = getRoutePermission(to.path);
  
  if (requiredPermission && !userPermissions.includes(requiredPermission)) {
    next('/403');
  } else {
    next();
  }
});
```

### 7.2 按钮权限

```vue
<template>
  <!-- 商家管理页面 -->
  <el-button
    v-permission="'payment:merchants:create'"
    type="primary"
    @click="handleCreate"
  >
    新建商家
  </el-button>
  
  <el-button
    v-permission="'payment:merchants:delete'"
    @click="handleDelete"
  >
    删除商家
  </el-button>
  
  <!-- 收款管理页面 -->
  <el-button
    v-permission="'payment:collections:bind'"
    @click="handleBindProduct"
  >
    绑定商品
  </el-button>
</template>
```

### 7.3 数据权限

- **商家角色**: 只能查看自己的收款记录
- **支付管理员**: 可以查看和管理所有商家数据
- **管理员**: 拥有全部权限

---

## 第八部分：注意事项

### 8.1 开发规范

1. **代码风格**: 遵循 ESLint + Prettier 配置
2. **组件命名**: 使用 PascalCase 命名组件
3. **注释规范**: 关键逻辑必须添加中文注释
4. **错误处理**: 所有 API 调用必须捕获错误

### 8.2 性能优化

1. **列表虚拟化**: 大数据量列表使用虚拟滚动
2. **图片懒加载**: 所有图片使用懒加载
3. **接口防抖**: 搜索输入防抖 500ms
4. **数据缓存**: 列表数据缓存 5 分钟

### 8.3 安全控制

1. **XSS 防护**: 富文本内容必须过滤
2. **CSRF 防护**: API 请求携带 CSRF token
3. **数据脱敏**: 敏感信息前端脱敏显示
4. **权限验证**: 前端路由守卫验证权限

### 8.4 移动端适配

1. **UniApp兼容**: 确保代码在H5和微信小程序环境下都能正常运行
2. **条件编译**: 使用 `#ifdef MP-WEIXIN` 处理微信小程序特有功能
3. **性能优化**: 小程序包大小控制在2MB以内
4. **用户体验**: 遵循微信小程序设计规范

### 8.5 Go后端注意事项

1. **Goroutines安全**: 避免数据竞争，使用sync.Mutex或channel
2. **内存管理**: 注意slice和map的内存分配，避免内存泄漏
3. **错误处理**: 统一错误处理机制，使用errors包
4. **数据库连接**: 使用GORM连接池，避免连接泄露
5. **日志记录**: 使用zap或logrus进行结构化日志记录

---

## 第九部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 商家管理 | 3 天 |
| 2 | 收款管理 | 2 天 |
| 3 | 权限控制 | 1 天 |
| 4 | 移动端适配 | 2 天 |
| 5 | Go后端开发 | 4 天 |
| 6 | 联调测试 | 2 天 |
| **总计** | | **14 天** |