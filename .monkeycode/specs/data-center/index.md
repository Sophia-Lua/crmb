# 数据中心模块 - 需求与设计文档

**模块名称**: data-center  
**更新日期**: 2026-05-09  
**版本**: v1.0

---

## 第一部分：需求概述

### 1.1 模块介绍

数据中心模块提供各类业务数据查询、统计分析和报表导出功能。仅支持电脑端。

### 1.2 用户角色

| 角色 | 职责 | 权限范围 |
|------|------|----------|
| 普通员工 | 查看相关数据 | 权限内数据查询 |
| 部门主管 | 部门数据统计 | 部门数据 |
| 管理层 | 全局数据统计 | 所有数据 |
| 管理员 | 全局管理 | 所有功能 |

### 1.3 子模块列表

| 子模块 | 电脑端 | 手机端 | 核心功能 |
|--------|--------|--------|----------|
| 营业额查询 | ✅ | ❌ | 营业额统计、导出 |
| 商品销量查询 | ✅ | ❌ | 销量统计、导出 |
| 区域业绩查询 | ✅ | ❌ | 区域业绩统计 |
| 人员业绩查询 | ✅ | ❌ | 人员业绩统计 |
| 人员成本查询 | ✅ | ❌ | 人员成本分析 |
| 商品历史采购价 | ✅ | ❌ | 采购价格历史 |
| 商品当下成本表 | ✅ | ❌ | 当前成本统计 |

---

## 第二部分：功能需求

### 2.1 营业额查询

#### 功能描述
查询和统计营业额数据。

#### 核心功能
1. **筛选条件**
   - 筛选城市
   - 筛选区域
   - 选择查询时间（日/周/月/自定义）

2. **查询展示**
   - 营业额汇总
   - 趋势图表
   - 排名列表

3. **导出 Excel**
   - 导出当前筛选条件数据
   - 选择导出字段

---

### 2.2 商品销量查询

#### 功能描述
查询商品销量数据。

#### 核心功能
1. **筛选条件**
   - 商品搜索框
   - 基本分类筛选
   - 选择排序方式（销量/金额）
   - 选择查询时间

2. **查询展示**
   - 商品销量列表
   - 销量统计
   - 热销排行

3. **导出 Excel**

---

### 2.3 区域业绩查询

#### 功能描述
查询各区域业绩数据。

#### 核心功能
1. **筛选条件**
   - 选择查询时间

2. **查询展示**
   - 区域业绩汇总
   - 区域排名
   - 趋势对比

3. **导出 Excel**

---

### 2.4 人员业绩查询

#### 功能描述
查询销售人员业绩数据。

#### 核心功能
1. **筛选条件**
   - 选择查询时间
   - 选择部门/团队

2. **查询展示**
   - 人员业绩列表
   - 业绩排名
   - 完成率统计

3. **导出 Excel**

---

### 2.5 人员成本查询

#### 功能描述
查询人员成本数据。

#### 核心功能
1. **筛选条件**
   - 筛选部门
   - 选择查询时间

2. **查询展示**
   - 人员成本列表
   - 成本分析
   - 成本趋势

3. **导出 Excel**

---

### 2.6 商品历史采购价

#### 功能描述
查询商品历史采购价格。

#### 核心功能
1. **商品搜索框**
   - 输入商品名称/编码搜索

2. **商品信息列表**
   - 历史采购价记录
   - 价格趋势图
   - 供应商对比

---

### 2.7 商品当下成本表

#### 功能描述
查询商品当前成本数据。

#### 核心功能
1. **商品搜索框**
   - 搜索商品

2. **商品信息列表**
   - 当前采购价
   - 成本构成
   - 毛利分析

---

## 第三部分：数据模型

### 3.1 营业额数据

```typescript
interface RevenueData {
  date: string;                                 // 日期 YYYY-MM-DD
  city?: string;
  region?: string;
  totalRevenue: number;                         // 总营业额
  orderCount: number;                           // 订单数
  avgOrderAmount: number;                       // 客单价
  payTypeBreakdown: PayTypeBreakdown;           // 支付方式占比
  growthRate?: number;                          // 环比增长率
}

interface PayTypeBreakdown {
  wechat: number;
  alipay: number;
  balance: number;
  cash: number;
}
```

### 3.2 商品销量

```typescript
interface ProductSales {
  sku: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  salesQty: number;                             // 销量
  salesAmount: number;                          // 销售额
  refundQty: number;                            // 退款量
  netSalesQty: number;                          // 净销量
  profitAmount: number;                         // 利润
  trend: 'up' | 'down' | 'stable';              // 趋势
}
```

### 3.3 区域业绩

```typescript
interface RegionPerformance {
  regionId: string;
  regionName: string;
  revenue: number;                              // 营业额
  orderCount: number;
  customerCount: number;                        // 客户数
  avgOrderAmount: number;
  growthRate: number;
  ranking: number;                              // 排名
}
```

### 3.4 人员业绩

```typescript
interface StaffPerformance {
  staffId: string;
  staffName: string;
  department: string;
  team?: string;
  revenue: number;                              // 业绩额
  orderCount: number;
  customerCount: number;
  target: number;                               // 目标
  completionRate: number;                       // 完成率
  ranking: number;
}
```

### 3.5 人员成本

```typescript
interface StaffCost {
  staffId: string;
  staffName: string;
  department: string;
  baseSalary: number;                           // 基本工资
  commission: number;                           // 提成
  bonus: number;                                // 奖金
  benefits: number;                             // 福利
  totalCost: number;                            // 总成本
  revenueRatio: number;                         // 成本收入比
}
```

### 3.6 历史采购价

```typescript
interface PriceHistory {
  sku: string;
  productName: string;
  records: PriceRecord[];
  currentPrice: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  trend: 'up' | 'down' | 'stable';
}

interface PriceRecord {
  id: string;
  supplierId: string;
  supplierName: string;
  price: number;
  effectiveDate: string;
  purchaseOrderId?: string;
}
```

### 3.7 商品当前成本

```typescript
interface ProductCurrentCost {
  sku: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  purchasePrice: number;                        // 采购价
  logisticsCost: number;                        // 物流成本
  storageCost: number;                          // 仓储成本
  totalCost: number;                            // 总成本
  retailPrice: number;                          // 零售价
  margin: number;                               // 毛利率
  marginAmount: number;                         // 毛利额
}
```

---

## 第四部分：API 接口设计

```typescript
// 基础路径：/api/data-center

// 营业额
GET  /api/data-center/revenue                      // 营业额数据
GET  /api/data-center/revenue/trend                // 营业额趋势
GET  /api/data-center/revenue/export               // 导出 Excel

// 商品销量
GET  /api/data-center/product-sales                // 销量数据
GET  /api/data-center/product-sales/ranking        // 销量排行

// 区域业绩
GET  /api/data-center/region-performance           // 区域业绩
GET  /api/data-center/region-performance/ranking   // 区域排名

// 人员业绩
GET  /api/data-center/staff-performance            // 人员业绩
GET  /api/data-center/staff-performance/ranking    // 业绩排名

// 人员成本
GET  /api/data-center/staff-cost                   // 人员成本
GET  /api/data-center/staff-cost/analysis          // 成本分析

// 商品历史采购价
GET  /api/data-center/product-history-price        // 历史价格
GET  /api/data-center/product-history-price/trend  // 价格趋势

// 商品当下成本
GET  /api/data-center/product-current-cost         // 当前成本
GET  /api/data-center/product-current-cost/margin  // 毛利分析
```

---

## 第五部分：前端设计

### 5.1 目录结构

```
src/
├── views/
│   └── data-center/
│       ├── revenue/
│       │   └── Index.vue
│       ├── product-sales/
│       │   └── Index.vue
│       ├── region-performance/
│       │   └── Index.vue
│       ├── staff-performance/
│       │   └── Index.vue
│       ├── staff-cost/
│       │   └── Index.vue
│       ├── product-history-price/
│       │   └── Index.vue
│       └── product-current-cost/
│           └── Index.vue
├── stores/
│   └── dataCenter.js
├── api/
│   └── dataCenter.js
└── components/
    └── charts/
        ├── LineChart.vue
        ├── BarChart.vue
        └── PieChart.vue
```

### 5.2 图表组件

```vue
<template>
  <div class="chart-container">
    <v-chart :option="chartOption" autoresize />
  </div>
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import VChart from 'vue-echarts';

use([CanvasRenderer, LineChart, BarChart, PieChart]);

const props = defineProps({
  type: String,
  data: Array
});

const chartOption = computed(() => ({
  // 根据 type 返回不同配置
}));
</script>
```

### 5.2 图表组件

```vue
<template>
  <div class="chart-container">
    <v-chart :option="chartOption" autoresize />
  </div>
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import VChart from 'vue-echarts';

use([CanvasRenderer, LineChart, BarChart, PieChart]);

const props = defineProps({
  type: String,
  data: Array
});

const chartOption = computed(() => ({
  // 根据 type 返回不同配置
}));
</script>
```

### 5.3 API 封装

```javascript
// src/api/dataCenter.js
import request from '@/utils/request';

// 营业额
export function getRevenueData(params) {
  return request({ url: '/api/data-center/revenue', method: 'GET', params });
}

export function getRevenueTrend(params) {
  return request({ url: '/api/data-center/revenue/trend', method: 'GET', params });
}

export function exportRevenueData(params) {
  return request({ url: '/api/data-center/revenue/export', method: 'GET', params, responseType: 'blob' });
}

// 商品销量
export function getProductSales(params) {
  return request({ url: '/api/data-center/product-sales', method: 'GET', params });
}

export function getProductSalesRanking(params) {
  return request({ url: '/api/data-center/product-sales/ranking', method: 'GET', params });
}

// 区域业绩
export function getRegionPerformance(params) {
  return request({ url: '/api/data-center/region-performance', method: 'GET', params });
}

export function getRegionPerformanceRanking(params) {
  return request({ url: '/api/data-center/region-performance/ranking', method: 'GET', params });
}

// 人员业绩
export function getStaffPerformance(params) {
  return request({ url: '/api/data-center/staff-performance', method: 'GET', params });
}

export function getStaffPerformanceRanking(params) {
  return request({ url: '/api/data-center/staff-performance/ranking', method: 'GET', params });
}

// 人员成本
export function getStaffCost(params) {
  return request({ url: '/api/data-center/staff-cost', method: 'GET', params });
}

export function getStaffCostAnalysis(params) {
  return request({ url: '/api/data-center/staff-cost/analysis', method: 'GET', params });
}

// 商品历史价格
export function getProductHistoryPrice(params) {
  return request({ url: '/api/data-center/product-history-price', method: 'GET', params });
}

export function getProductHistoryPriceTrend(params) {
  return request({ url: '/api/data-center/product-history-price/trend', method: 'GET', params });
}

// 商品当前成本
export function getProductCurrentCost(params) {
  return request({ url: '/api/data-center/product-current-cost', method: 'GET', params });
}

export function getProductCurrentCostMargin(params) {
  return request({ url: '/api/data-center/product-current-cost/margin', method: 'GET', params });
}
```

### 5.4 后端Go实现

#### 目录结构
```
internal/
├── handler/
│   └── datacenter/
│       ├── revenue_handler.go
│       ├── product_handler.go
│       ├── region_handler.go
│       ├── staff_handler.go
│       └── price_handler.go
├── service/
│   └── datacenter/
│       ├── revenue_service.go
│       ├── product_service.go
│       ├── region_service.go
│       ├── staff_service.go
│       └── price_service.go
├── model/
│   └── datacenter/
│       ├── revenue.go
│       ├── product.go
│       ├── region.go
│       ├── staff.go
│       └── price.go
└── dto/
    └── datacenter/
        ├── revenue_dto.go
        ├── product_dto.go
        ├── region_dto.go
        ├── staff_dto.go
        └── price_dto.go
```

#### 核心Handler示例
```go
// internal/handler/datacenter/revenue_handler.go
package datacenter

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "your-project/internal/service/datacenter"
    "your-project/internal/dto/datacenter"
)

type RevenueHandler struct {
    revenueService *datacenter.RevenueService
}

func NewRevenueHandler(revenueService *datacenter.RevenueService) *RevenueHandler {
    return &RevenueHandler{
        revenueService: revenueService,
    }
}

// GetRevenueData 获取营业额数据
func (h *RevenueHandler) GetRevenueData(c *gin.Context) {
    var req datacenter.GetRevenueRequest
    if err := c.ShouldBindQuery(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    revenueData, err := h.revenueService.GetRevenueData(c.Request.Context(), &req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "code": 200,
        "message": "success",
        "data": revenueData,
    })
}

// ExportRevenueData 导出营业额数据
func (h *RevenueHandler) ExportRevenueData(c *gin.Context) {
    var req datacenter.ExportRevenueRequest
    if err := c.ShouldBindQuery(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    fileData, filename, err := h.revenueService.ExportRevenueData(c.Request.Context(), &req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    c.Header("Content-Disposition", "attachment; filename="+filename)
    c.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileData)
}
```

#### Service层示例
```go
// internal/service/datacenter/revenue_service.go
package datacenter

import (
    "context"
    "your-project/internal/model/datacenter"
    "your-project/internal/repository"
    "your-project/pkg/excel"
)

type RevenueService struct {
    revenueRepo repository.RevenueRepository
}

func NewRevenueService(revenueRepo repository.RevenueRepository) *RevenueService {
    return &RevenueService{
        revenueRepo: revenueRepo,
    }
}

func (s *RevenueService) GetRevenueData(ctx context.Context, req *GetRevenueRequest) (*RevenueResponse, error) {
    // 构建查询条件
    conditions := req.ToQueryConditions()
    
    // 查询营业额数据
    revenueList, err := s.revenueRepo.FindByConditions(ctx, conditions)
    if err != nil {
        return nil, err
    }
    
    // 计算汇总数据
    summary := s.calculateSummary(revenueList)
    
    return &RevenueResponse{
        List:    revenueList,
        Summary: summary,
    }, nil
}

func (s *RevenueService) ExportRevenueData(ctx context.Context, req *ExportRevenueRequest) ([]byte, string, error) {
    // 获取数据
    revenueData, err := s.GetRevenueData(ctx, &GetRevenueRequest{
        DateRange: req.DateRange,
        City:      req.City,
        Region:    req.Region,
    })
    if err != nil {
        return nil, "", err
    }
    
    // 生成Excel文件
    filename := "revenue_report_" + time.Now().Format("20060102") + ".xlsx"
    fileData, err := excel.GenerateRevenueReport(revenueData.List, revenueData.Summary)
    if err != nil {
        return nil, "", err
    }
    
    return fileData, filename, nil
}

func (s *RevenueService) calculateSummary(revenueList []*datacenter.RevenueData) *RevenueSummary {
    var totalRevenue float64
    var totalOrders int64
    var avgOrderAmount float64
    
    for _, revenue := range revenueList {
        totalRevenue += revenue.TotalRevenue
        totalOrders += int64(revenue.OrderCount)
    }
    
    if totalOrders > 0 {
        avgOrderAmount = totalRevenue / float64(totalOrders)
    }
    
    return &RevenueSummary{
        TotalRevenue:    totalRevenue,
        TotalOrders:     totalOrders,
        AvgOrderAmount:  avgOrderAmount,
    }
}
```

---

## 第六部分：Mock 数据方案

### 6.1 Mock 配置

```javascript
// src/mock/dataCenter.js
import Mock from 'mockjs';

// 营业额数据 Mock
Mock.mock(/\/api\/data-center\/revenue(\?.*)?$/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1]);
  const dateRange = params.get('dateRange') || 'month';
  
  const revenueData = Mock.mock({
    'list|30': [{
      'date': '@date',
      'city|1': ['北京', '上海', '广州', '深圳'],
      'region|1': ['朝阳区', '浦东新区', '天河区', '南山区'],
      'totalRevenue|10000-100000': 1,
      'orderCount|50-500': 1,
      'avgOrderAmount|200-500': 1,
      'payTypeBreakdown': {
        'wechat|40-60': 1,
        'alipay|20-40': 1,
        'balance|10-20': 1,
        'cash|5-10': 1
      }
    }]
  });
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: revenueData.list,
      summary: {
        totalRevenue: Mock.Random.float(1000000, 5000000, 2),
        totalOrders: Mock.Random.integer(10000, 50000),
        avgOrderAmount: Mock.Random.float(200, 500, 2)
      }
    }
  };
});

// 商品销量 Mock
Mock.mock(/\/api\/data-center\/product-sales(\?.*)?$/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1]);
  
  const productSales = Mock.mock({
    'list|100': [{
      'sku': '@string("SKU", 8)',
      'productName': '@ctitle(5,10)',
      'categoryId|1-20': 1,
      'categoryName': '@ctitle(2,4)',
      'salesQty|100-10000': 1,
      'salesAmount|1000-100000': 1,
      'refundQty|0-100': 1,
      'netSalesQty|90-9900': 1,
      'profitAmount|100-50000': 1,
      'trend|1': ['up', 'down', 'stable']
    }]
  });
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: productSales.list,
      ranking: productSales.list.sort((a, b) => b.salesQty - a.salesQty).slice(0, 10)
    }
  };
});

// 区域业绩 Mock
Mock.mock(/\/api\/data-center\/region-performance(\?.*)?$/, 'get', () => {
  const regions = Mock.mock({
    'list|20': [{
      'regionId|+1': 1,
      'regionName': '@city(true)',
      'revenue|100000-1000000': 1,
      'orderCount|1000-10000': 1,
      'customerCount|100-1000': 1,
      'avgOrderAmount|200-500': 1,
      'growthRate|-10-20': 1,
      'ranking|+1': 1
    }]
  });
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: regions.list.sort((a, b) => b.revenue - a.revenue),
      topRegions: regions.list.slice(0, 5)
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
  'data-center:revenue:view': ['/data-center/revenue'],
  'data-center:product-sales:view': ['/data-center/product-sales'],
  'data-center:region-performance:view': ['/data-center/region-performance'],
  'data-center:staff-performance:view': ['/data-center/staff-performance'],
  'data-center:staff-cost:view': ['/data-center/staff-cost'],
  'data-center:price-history:view': ['/data-center/product-history-price'],
  'data-center:current-cost:view': ['/data-center/product-current-cost']
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

### 7.2 数据权限

- **普通员工**: 只能查看自己部门的数据
- **部门主管**: 可以查看本部门所有数据
- **管理层**: 可以查看全局数据
- **管理员**: 拥有全部权限

---

## 第八部分：注意事项

### 8.1 开发规范

1. **代码风格**: 遵循 ESLint + Prettier 配置
2. **组件命名**: 使用 PascalCase 命名组件
3. **注释规范**: 关键逻辑必须添加中文注释
4. **错误处理**: 所有 API 调用必须捕获错误

### 8.2 性能优化

1. **大数据量处理**: 使用虚拟滚动和分页
2. **图表渲染优化**: 使用 ECharts 的懒加载和节流
3. **接口缓存**: 报表数据缓存 10 分钟
4. **导出优化**: 大数据量导出使用后台任务

### 8.3 安全控制

1. **XSS 防护**: 图表数据必须过滤
2. **CSRF 防护**: API 请求携带 CSRF token
3. **数据脱敏**: 敏感信息前端脱敏显示
4. **权限验证**: 严格的数据权限控制

### 8.4 移动端适配

1. **响应式设计**: 图表在移动端自适应
2. **触摸优化**: 支持触摸操作的图表交互
3. **性能考虑**: 移动端简化图表复杂度

---

## 第九部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 营业额 + 销量 | 3 天 |
| 2 | 区域 + 人员业绩 | 3 天 |
| 3 | 人员成本 | 2 天 |
| 4 | 商品价格相关 | 2 天 |
| 5 | 权限控制 | 1 天 |
| 6 | 性能优化 | 1 天 |
| 7 | Go后端开发 | 5 天 |
| 8 | 联调测试 | 2 天 |
| **总计** | | **19 天** |
