# 销售模块 - 需求与设计文档

**模块名称**: sales-module  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 第一部分：需求概述

### 1.1 模块介绍

销售模块是商城配送系统的核心业务模块，主要用于管理销售人员的客户开发、拜访、店铺审核等业务流程。支持电脑端 Web 和手机端 UniApp 两个平台。

### 1.2 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 销售人员 | 客户拜访、店铺领取、客户跟进 | 自己的客户和拜访记录 |
| 销售经理 | 团队管理、店铺分配、数据查看 | 本团队所有数据 |
| 审核人员 | 店铺资质审核 | 店铺审核相关功能 |
| 管理员 | 全局管理、数据导出 | 所有数据和功能 |

### 1.3 子模块列表

| 子模块 | 电脑端 | 手机端 | 核心功能 |
|--------|--------|--------|----------|
| 拜访记录 | ✅ | ✅ | 拜访新建、拜访列表、拜访详情 |
| 待审核（新店） | ✅ | ✅ | 待领取店铺、待审核店铺 |
| 客户管理 | ✅ | ✅ | 客户详情、客户跟进 |
| 公海 | ✅ | ✅ | 公海客户池、筛选搜索 |
| 私海 | ✅ | ✅ | 私海客户管理、客户分配 |
| 销售地图 | ✅ | ✅ | 地图展示客户分布 |
| 客诉 | ✅ | ✅ | 客户投诉管理 |
| 特殊备货需求 | ✅ | ✅ | 特殊需求列表查询 |
| 特殊商品库 | ✅ | ✅ | 特殊商品监控和知识库 |
| 黑名单 | ✅ | ✅ | 黑名单客户管理 |

---

## 第二部分：功能需求详解

### 2.1 拜访记录

#### 功能描述
管理销售人员的客户拜访活动，记录拜访内容和跟进计划。

#### 核心功能
1. **拜访新建**
   - 选择客户（公海/私海）
   - 选择拜访类型（首次拜访/定期回访/临时拜访/其他）
   - 选择拜访方式（实地拜访/电话拜访/视频拜访/微信拜访）
   - 填写拜访主题、内容、客户反馈、跟进计划
   - 上传图片附件（最多 9 张）
   - 保存草稿/提交

2. **拜访列表**
   - 多维度筛选（状态、类型、方式、日期、客户名称）
   - 分页展示
   - 导出 Excel
   - 统计面板（今日/本周/本月拜访数）

3. **拜访详情**
   - 查看完整拜访信息
   - 编辑/删除（限草稿和待拜访状态）
   - 更新拜访状态
   - 添加跟进备注

#### 数据模型
```typescript
interface Visit {
  id: string;
  customerId: string;
  customerName: string;
  customerType: 'public' | 'private';
  visitType: 'first' | 'regular' | 'temporary' | 'other';
  visitMethod: 'onsite' | 'phone' | 'video' | 'wechat';
  planDate: string;
  planTime?: string;
  subject: string;
  content: string;
  images?: VisitImage[];
  feedback?: string;
  followUpPlan?: string;
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}
```

---

### 2.2 待审核（新店）

#### 功能描述
管理新注册店铺的审核流程，包括店铺领取、资质审核、店铺分配。

#### 核心功能
1. **待领取店铺**
   - 列表展示（列表/地图双视图）
   - 筛选（类型、地区、注册时间）
   - 店铺领取
   - 距离计算

2. **待审核店铺**
   - 审核列表
   - 审核详情（店铺信息、资质图片）
   - 审核通过/驳回
   - 驳回原因填写（必填，≥10 字符）

3. **店铺分配**
   - 选择销售人员
   - 查看销售人员负载
   - 分配通知

#### 数据模型
```typescript
interface Store {
  id: string;
  storeName: string;
  storeType: 'supermarket' | 'convenience' | 'restaurant' | 'other';
  address: string;
  province: string;
  city: string;
  district: string;
  latitude?: number;
  longitude?: number;
  area?: number;
  contactName: string;
  contactPhone: string;
  licenses: StoreLicense[];
  status: 'unclaimed' | 'pending' | 'reviewing' | 'approved' | 'rejected';
  claimBy?: string;
  assignedTo?: string;
  reviewBy?: string;
  rejectReason?: string;
}
```

---

### 2.3 客户管理

#### 功能描述
管理销售人员的客户资源，包括客户详情、跟进记录、客户分级。

#### 核心功能
1. **客户详情**
   - 基本信息（名称、类型、地址、联系人）
   - 经营信息（面积、营业时间、主营品类）
   - 历史拜访记录
   - 历史订单统计
   - 客户分级标识

2. **功能按钮**
   - 编辑客户信息
   - 转移客户（经理权限）
   - 归还公海
   - 加入黑名单
   - 一键拨号
   - 导航到店

---

### 2.4 公海

#### 功能描述
公海客户池，所有销售人员可领取和跟进的公共客户资源。

#### 核心功能
1. **筛选搜索**
   - 按客户名称搜索
   - 按地区筛选（省/市/区）
   - 按店铺类型筛选
   - 按注册时间筛选

2. **排序**
   - 注册时间（最新/最早）
   - 距离（最近/最远）
   - 店铺规模（大面积/小面积）

3. **功能按钮**
   - 领取客户
   - 查看地图
   - 批量领取
   - 导出列表

---

### 2.5 私海

#### 功能描述
销售人员独占的客户资源池，只有负责人可跟进。

#### 核心功能
1. **筛选搜索**
   - 按客户名称搜索
   - 按跟进状态筛选
   - 按客户分级筛选
   - 按最后拜访时间筛选

2. **排序**
   - 最后拜访时间
   - 客户等级
   - 订单金额

3. **功能按钮**
   - 新建拜访
   - 转移客户
   - 归还公海
   - 查看拜访记录

---

### 2.6 销售地图

#### 功能描述
地图展示客户分布，支持同时查看多种类型客户。

#### 核心功能
1. **地图展示**
   - 公海客户（蓝色标记）
   - 私海客户（绿色标记）
   - 他海客户（黄色标记）
   - 未注册店铺（灰色标记）

2. **图层控制**
   - 支持同时显示多种类型
   - 不同类型颜色区分
   - 点击标记查看详情

3. **筛选功能**
   - 按区域筛选
   - 按类型筛选
   - 按状态筛选

---

### 2.7 客诉

#### 功能描述
管理客户投诉，记录投诉内容和处理结果。

#### 核心功能
1. **客诉列表**
   - 筛选（状态、类型、时间）
   - 搜索（客户名称、投诉内容）

2. **客诉详情**
   - 投诉内容
   - 处理进度
   - 处理结果
   - 客户满意度

---

### 2.8 特殊备货需求

#### 功能描述
管理客户的特殊备货需求。

#### 核心功能
1. **列表查询**
   - 筛选（状态、客户、时间）
   - 搜索（商品名称、需求描述）

2. **需求详情**
   - 需求描述
   - 商品清单
   - 处理进度

---

### 2.9 特殊商品库

#### 功能描述
特殊商品监控和知识库管理。

#### 核心功能
1. **特殊商品监控**
   - 商品列表
   - 库存监控
   - 价格监控

2. **特殊商品知识库**
   - 商品知识录入
   - 知识分类
   - 知识搜索

---

### 2.10 黑名单

#### 功能描述
管理黑名单客户。

#### 核心功能
1. **黑名单列表**
   - 筛选（拉黑原因、时间）
   - 搜索（客户名称）

2. **黑名单管理**
   - 添加黑名单
   - 移除黑名单
   - 查看拉黑原因

---

## 第三部分：API 接口设计

### 3.1 拜访记录 API

```typescript
// 基础路径：/api/sales/visits

// 获取拜访列表
GET /api/sales/visits
  params: { page, pageSize, status, visitType, visitMethod, customerName, startDate, endDate }

// 获取拜访详情
GET /api/sales/visits/:id

// 创建拜访记录
POST /api/sales/visits
  body: { customerId, visitType, visitMethod, planDate, subject, content, ... }

// 更新拜访记录
PUT /api/sales/visits/:id
  body: { ...visit fields... }

// 删除拜访记录
DELETE /api/sales/visits/:id

// 获取统计数据
GET /api/sales/visits/statistics
```

### 3.2 店铺管理 API

```typescript
// 基础路径：/api/sales/stores

// 获取待领取店铺列表
GET /api/sales/stores/unclaimed

// 获取待审核店铺列表
GET /api/sales/stores/review

// 获取店铺详情
GET /api/sales/stores/:id

// 领取店铺
POST /api/sales/stores/:id/claim

// 审核店铺
POST /api/sales/stores/:id/review
  body: { status: 'approved' | 'rejected', rejectReason?: string }

// 分配店铺
POST /api/sales/stores/:id/assign
  body: { assignedTo: string }

// 获取统计数据
GET /api/sales/stores/statistics
```

### 3.3 客户管理 API

```typescript
// 基础路径：/api/sales/customers

// 获取公海客户列表
GET /api/sales/customers/public

// 获取私海客户列表
GET /api/sales/customers/private

// 获取客户详情
GET /api/sales/customers/:id

// 领取客户
POST /api/sales/customers/:id/claim

// 归还公海
POST /api/sales/customers/:id/return

// 转移客户
POST /api/sales/customers/:id/transfer

// 客户搜索
GET /api/sales/customers/search
```

### 3.4 销售地图 API

```typescript
// 基础路径：/api/sales/map

// 获取客户分布数据
GET /api/sales/map/customers
  params: { type, bounds }

// 获取未注册店铺数据
GET /api/sales/map/unregistered

// 获取标记详情
GET /api/sales/markers/:id
```

---

## 第四部分：前端设计

### 4.1 技术栈

| 项目 | 电脑端 | 手机端 |
|------|--------|--------|
| 框架 | Vue 3.3+ | UniApp (Vue3) |
| UI 组件 | Element Plus 2.x | uView Plus 3.x |
| 状态管理 | Pinia 1.x | Pinia 1.x |
| HTTP 客户端 | Axios 1.x | uni.request |
| 地图 | 高德地图 JS API | 高德地图 UniApp SDK |
| Mock 数据 | Mock.js | Mock.js (H5 only) |

### 4.2 目录结构

```
src/
├── views/
│   └── sales/
│       ├── visits/              # 拜访记录
│       │   ├── List.vue
│       │   ├── Create.vue
│       │   └── Detail.vue
│       ├── stores/              # 店铺管理
│       │   ├── Unclaimed.vue
│       │   ├── Review.vue
│       │   ├── Detail.vue
│       │   └── Assign.vue
│       ├── customers/           # 客户管理
│       │   ├── Public.vue       # 公海
│       │   ├── Private.vue      # 私海
│       │   └── Detail.vue
│       ├── map/                 # 销售地图
│       │   └── Index.vue
│       ├── complaints/          # 客诉
│       │   └── List.vue
│       └── ...
├── components/
│   └── sales/
│       ├── VisitCard.vue
│       ├── StoreCard.vue
│       ├── CustomerCard.vue
│       ├── MapViewer.vue
│       └── ...
├── stores/
│   └── sales.js                 # 销售模块状态管理
├── api/
│   └── sales.js                 # 销售模块 API 封装
└── mock/
    └── sales.js                 # Mock 数据
```

### 4.3 核心页面设计

#### 4.3.1 拜访列表页 (电脑端)

```vue
<template>
  <div class="visit-list-page">
    <!-- 统计面板 -->
    <VisitStatistics />
    
    <!-- 筛选区域 -->
    <VisitFilter @search="handleSearch" @reset="handleReset" />
    
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建拜访
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出 Excel
      </el-button>
    </div>
    
    <!-- 列表 -->
    <VisitListTable
      :data="visitList"
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

#### 4.3.2 店铺详情页 (手机端)

```vue
<template>
  <view class="store-detail-page">
    <scroll-view scroll-y>
      <!-- 状态栏 -->
      <view class="status-bar">
        <uni-tag :text="statusLabel" :type="statusType" />
      </view>
      
      <!-- 店铺信息 -->
      <view class="info-card">
        <text class="store-name">{{ store.storeName }}</text>
        <view class="info-row">
          <text class="label">店铺类型</text>
          <text class="value">{{ getStoreTypeLabel(store.storeType) }}</text>
        </view>
        <view class="info-row">
          <text class="label">店铺地址</text>
          <text class="value">{{ store.fullAddress }}</text>
        </view>
      </view>
      
      <!-- 联系人信息 -->
      <view class="info-card">
        <view class="info-row">
          <text class="label">联系人</text>
          <text class="value">{{ store.contactName }}</text>
        </view>
        <view class="info-row" @click="callPhone">
          <text class="label">电话</text>
          <text class="value link">{{ store.contactPhone }}</text>
        </view>
      </view>
      
      <!-- 资质图片 -->
      <view class="info-card">
        <view class="license-grid">
          <image
            v-for="license in store.licenses"
            :key="license.id"
            :src="license.url"
            @click="previewImage(license.url)"
          />
        </view>
      </view>
      
      <!-- 地图定位 -->
      <map
        :latitude="store.latitude"
        :longitude="store.longitude"
        style="height: 300rpx"
      />
      <button @click="openNavigation">导航到这里</button>
    </scroll-view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <button v-if="canClaim" class="btn-claim" @click="handleClaim">立即领取</button>
      <button v-if="canReview" class="btn-review" @click="handleReview">去审核</button>
    </view>
  </view>
</template>
```

#### 4.3.3 销售地图页 (通用)

```vue
<template>
  <div class="sales-map-page">
    <!-- 图层控制 -->
    <div class="layer-control">
      <el-checkbox-group v-model="activeLayers">
        <el-checkbox label="public">公海客户</el-checkbox>
        <el-checkbox label="private">私海客户</el-checkbox>
        <el-checkbox label="other">他海客户</el-checkbox>
        <el-checkbox label="unregistered">未注册店铺</el-checkbox>
      </el-checkbox-group>
    </div>
    
    <!-- 地图 -->
    <div ref="mapContainer" class="map-container"></div>
    
    <!-- 标记详情弹窗 -->
    <el-dialog v-model="detailVisible" title="客户详情">
      <CustomerDetail :customer="selectedCustomer" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { loadMarkers } from '@/api/sales';

const activeLayers = ref(['public', 'private']);
const mapContainer = ref();
const detailVisible = ref(false);
const selectedCustomer = ref(null);

onMounted(async () => {
  const map = await initMap(mapContainer.value);
  loadMarkersForLayers(activeLayers.value, map);
});

watch(activeLayers, (newLayers) => {
  updateMarkers(newLayers);
});
</script>
```

### 4.4 状态管理 (Pinia)

```javascript
// src/stores/sales.js
import { defineStore } from 'pinia';
import salesApi from '@/api/sales';

export const useSalesStore = defineStore('sales', () => {
  // 拜访记录状态
  const visitList = ref([]);
  const visitDetail = ref(null);
  const visitStats = ref({});
  
  // 店铺状态
  const storeList = ref([]);
  const storeDetail = ref(null);
  const storeStats = ref({});
  
  // 客户状态
  const customerList = ref([]);
  const customerDetail = ref(null);
  
  // 地图标记
  const mapMarkers = ref([]);
  
  const loading = ref(false);
  
  // Actions - 拜访
  async function fetchVisits(params) {
    loading.value = true;
    const res = await salesApi.getVisits(params);
    visitList.value = res.data.list;
    loading.value = false;
  }
  
  async function fetchVisitDetail(id) {
    const res = await salesApi.getVisit(id);
    visitDetail.value = res.data;
  }
  
  async function createVisit(data) {
    return await salesApi.createVisit(data);
  }
  
  // Actions - 店铺
  async function fetchUnclaimedStores(params) {
    loading.value = true;
    const res = await salesApi.getUnclaimedStores(params);
    storeList.value = res.data.list;
    loading.value = false;
  }
  
  async function claimStore(id) {
    return await salesApi.claimStore(id);
  }
  
  async function reviewStore(id, data) {
    return await salesApi.reviewStore(id, data);
  }
  
  // Actions - 客户
  async function fetchPublicCustomers(params) {
    const res = await salesApi.getPublicCustomers(params);
    customerList.value = res.data.list;
  }
  
  async function claimCustomer(id) {
    return await salesApi.claimCustomer(id);
  }
  
  // Actions - 地图
  async function loadMapMarkers(bounds, types) {
    const res = await salesApi.getMapMarkers({ bounds, types });
    mapMarkers.value = res.data;
  }
  
  return {
    // State
    visitList, visitDetail, visitStats,
    storeList, storeDetail, storeStats,
    customerList, customerDetail, mapMarkers,
    loading,
    // Actions
    fetchVisits, fetchVisitDetail, createVisit,
    fetchUnclaimedStores, claimStore, reviewStore,
    fetchPublicCustomers, claimCustomer,
    loadMapMarkers
  };
});
```

### 4.5 API 封装

```javascript
// src/api/sales.js
import request from '@/utils/request';

// 拜访记录
export function getVisits(params) {
  return request({ url: '/api/sales/visits', method: 'GET', params });
}

export function getVisit(id) {
  return request({ url: `/api/sales/visits/${id}`, method: 'GET' });
}

export function createVisit(data) {
  return request({ url: '/api/sales/visits', method: 'POST', data });
}

export function updateVisit(id, data) {
  return request({ url: `/api/sales/visits/${id}`, method: 'PUT', data });
}

export function deleteVisit(id) {
  return request({ url: `/api/sales/visits/${id}`, method: 'DELETE' });
}

// 店铺管理
export function getUnclaimedStores(params) {
  return request({ url: '/api/sales/stores/unclaimed', method: 'GET', params });
}

export function getReviewStores(params) {
  return request({ url: '/api/sales/stores/review', method: 'GET', params });
}

export function getStore(id) {
  return request({ url: `/api/sales/stores/${id}`, method: 'GET' });
}

export function claimStore(id) {
  return request({ url: `/api/sales/stores/${id}/claim`, method: 'POST' });
}

export function reviewStore(id, data) {
  return request({ url: `/api/sales/stores/${id}/review`, method: 'POST', data });
}

export function assignStore(id, data) {
  return request({ url: `/api/sales/stores/${id}/assign`, method: 'POST', data });
}

// 客户管理
export function getPublicCustomers(params) {
  return request({ url: '/api/sales/customers/public', method: 'GET', params });
}

export function getPrivateCustomers(params) {
  return request({ url: '/api/sales/customers/private', method: 'GET', params });
}

export function getCustomer(id) {
  return request({ url: `/api/sales/customers/${id}`, method: 'GET' });
}

export function claimCustomer(id) {
  return request({ url: `/api/sales/customers/${id}/claim`, method: 'POST' });
}

// 销售地图
export function getMapMarkers(params) {
  return request({ url: '/api/sales/map/customers', method: 'GET', params });
}

export function getUnregisteredStores(params) {
  return request({ url: '/api/sales/map/unregistered', method: 'GET', params });
}

// 统计数据
export function getVisitStats(params) {
  return request({ url: '/api/sales/visits/statistics', method: 'GET', params });
}

export function getStoreStats(params) {
  return request({ url: '/api/sales/stores/statistics', method: 'GET', params });
}
```

### 4.6 后端Go实现

#### 目录结构
```
internal/
├── handler/
│   └── sales/
│       ├── visit_handler.go
│       ├── store_handler.go
│       ├── customer_handler.go
│       └── map_handler.go
├── service/
│   └── sales/
│       ├── visit_service.go
│       ├── store_service.go
│       ├── customer_service.go
│       └── map_service.go
├── model/
│   └── sales/
│       ├── visit.go
│       ├── store.go
│       └── customer.go
└── dto/
    └── sales/
        ├── visit_dto.go
        ├── store_dto.go
        └── customer_dto.go
```

#### 核心Handler示例
```go
// internal/handler/sales/visit_handler.go
package sales

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "your-project/internal/service/sales"
    "your-project/internal/dto/sales"
)

type VisitHandler struct {
    visitService *sales.VisitService
}

func NewVisitHandler(visitService *sales.VisitService) *VisitHandler {
    return &VisitHandler{
        visitService: visitService,
    }
}

// GetVisits 获取拜访列表
func (h *VisitHandler) GetVisits(c *gin.Context) {
    var req sales.GetVisitsRequest
    if err := c.ShouldBindQuery(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    visits, total, err := h.visitService.GetVisits(c.Request.Context(), &req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "code": 200,
        "message": "success",
        "data": gin.H{
            "list": visits,
            "total": total,
            "page": req.Page,
            "pageSize": req.PageSize,
        },
    })
}

// CreateVisit 创建拜访记录
func (h *VisitHandler) CreateVisit(c *gin.Context) {
    var req sales.CreateVisitRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    visit, err := h.visitService.CreateVisit(c.Request.Context(), &req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "code": 200,
        "message": "success",
        "data": visit,
    })
}
```

#### Service层示例
```go
// internal/service/sales/visit_service.go
package sales

import (
    "context"
    "your-project/internal/model/sales"
    "your-project/internal/repository"
)

type VisitService struct {
    visitRepo repository.VisitRepository
}

func NewVisitService(visitRepo repository.VisitRepository) *VisitService {
    return &VisitService{
        visitRepo: visitRepo,
    }
}

func (s *VisitService) GetVisits(ctx context.Context, req *GetVisitsRequest) ([]*sales.Visit, int64, error) {
    // 业务逻辑处理
    visits, total, err := s.visitRepo.FindByConditions(ctx, req.ToQueryConditions())
    if err != nil {
        return nil, 0, err
    }
    
    return visits, total, nil
}

func (s *VisitService) CreateVisit(ctx context.Context, req *CreateVisitRequest) (*sales.Visit, error) {
    // 数据验证
    if err := req.Validate(); err != nil {
        return nil, err
    }
    
    visit := &sales.Visit{
        CustomerID:    req.CustomerID,
        CustomerName:  req.CustomerName,
        VisitType:     req.VisitType,
        VisitMethod:   req.VisitMethod,
        PlanDate:      req.PlanDate,
        Subject:       req.Subject,
        Content:       req.Content,
        Status:        "draft",
        CreatedBy:     req.CreatedBy,
    }
    
    err := s.visitRepo.Create(ctx, visit)
    if err != nil {
        return nil, err
    }
    
    return visit, nil
}
```

---

## 第五部分：Mock 数据方案

### 5.1 Mock 配置

```javascript
// src/mock/sales.js
import Mock from 'mockjs';

// 拜访记录 Mock
Mock.mock(/\/api\/sales\/visits(\?.*)?$/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(params.get('page')) || 1;
  const pageSize = parseInt(params.get('pageSize')) || 20;
  
  const visits = Mock.mock({
    'list|100': [{
      'id|+1': 1,
      'customerName': '@ctitle(5,10)',
      'visitType|1': ['first', 'regular', 'temporary', 'other'],
      'visitMethod|1': ['onsite', 'phone', 'video', 'wechat'],
      'status|1': ['draft', 'pending', 'in_progress', 'completed', 'cancelled'],
      'subject': '@ctitle(10,20)',
      'planDate': '@date',
      'createdAt': '@datetime'
    }]
  });
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: visits.list.slice(start, end),
      total: visits.list.length,
      page,
      pageSize
    }
  };
});

// 店铺 Mock
Mock.mock(/\/api\/sales\/stores\/unclaimed(\?.*)?$/, 'get', () => {
  const stores = Mock.mock({
    'list|50': [{
      'id|+1': 1,
      'storeName': '@ctitle(5,15)店',
      'storeType|1': ['supermarket', 'convenience', 'restaurant', 'other'],
      'address': '@region(false) + @county(true)',
      'contactName': '@cname',
      'contactPhone': /^1[3-9]\d{9}$/,
      'area|100-1000': 1,
      'status': 'unclaimed',
      'createdAt': '@datetime'
    }]
  });
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: stores.list,
      total: stores.list.length
    }
  };
});
```

---

## 第六部分：权限控制

### 6.1 路由权限

```javascript
// src/router/permission.js
const routePermissions = {
  'sales:visits:view': ['/sales/visits', '/sales/visits/:id'],
  'sales:visits:create': ['/sales/visits/create'],
  'sales:visits:edit': ['/sales/visits/:id/edit'],
  'sales:stores:claim': ['/sales/stores/unclaimed'],
  'sales:stores:review': ['/sales/stores/review', '/sales/stores/:id/review'],
  'sales:customers:public': ['/sales/customers/public'],
  'sales:customers:private': ['/sales/customers/private']
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

### 6.2 按钮权限

```vue
<template>
  <el-button
    v-permission="'sales:visits:create'"
    type="primary"
    @click="handleCreate"
  >
    新建拜访
  </el-button>
  
  <el-button
    v-permission="'sales:stores:review'"
    @click="handleReview"
  >
    去审核
  </el-button>
</template>
```

---

## 第七部分：注意事项

### 7.1 开发规范

1. **代码风格**: 遵循 ESLint + Prettier 配置
2. **组件命名**: 使用 PascalCase 命名组件
3. **注释规范**: 关键逻辑必须添加中文注释
4. **错误处理**: 所有 API 调用必须捕获错误

### 7.2 性能优化

1. **列表虚拟化**: 大数据量列表使用虚拟滚动
2. **图片懒加载**: 所有图片使用懒加载
3. **接口防抖**: 搜索输入防抖 500ms
4. **数据缓存**: 列表数据缓存 5 分钟

### 7.3 安全控制

1. **XSS 防护**: 富文本内容必须过滤
2. **CSRF 防护**: API 请求携带 CSRF token
3. **数据脱敏**: 敏感信息前端脱敏显示
4. **权限验证**: 前端路由守卫验证权限

---

## 第八部分：开发计划

| 阶段 | 内容 | 预计工期 |
|------|------|----------|
| 阶段 1 | 拜访记录模块开发 | 5 天 |
| 阶段 2 | 店铺管理模块开发 | 7 天 |
| 阶段 3 | 客户管理模块开发 | 5 天 |
| 阶段 4 | 销售地图模块开发 | 4 天 |
| 阶段 5 | 其他子模块开发 | 5 天 |
| 阶段 6 | 联调测试 | 5 天 |
| **总计** | | **31 天** |

---

## 文档总结

本文档是销售模块的综合需求和设计文档，包含：

✅ **需求概述** - 模块介绍、用户角色、子模块列表  
✅ **功能需求** - 10 个子模块的详细功能描述  
✅ **API 设计** - 统一的 API 接口定义  
✅ **前端设计** - 电脑端和手机端的技术方案  
✅ **状态管理** - Pinia Store 设计  
✅ **Mock 数据** - 开发环境 Mock 方案  
✅ **权限控制** - 路由和按钮权限控制  
✅ **开发计划** - 分阶段开发计划

下一步可根据本文档开始编码实现。
