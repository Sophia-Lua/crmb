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
// 基础路径：/api/v1/data-center

// 营业额
GET  /api/v1/data-center/revenue                      // 营业额数据
GET  /api/v1/data-center/revenue/trend                // 营业额趋势
GET  /api/v1/data-center/revenue/export               // 导出 Excel

// 商品销量
GET  /api/v1/data-center/product-sales                // 销量数据
GET  /api/v1/data-center/product-sales/ranking        // 销量排行

// 区域业绩
GET  /api/v1/data-center/region-performance           // 区域业绩
GET  /api/v1/data-center/region-performance/ranking   // 区域排名

// 人员业绩
GET  /api/v1/data-center/staff-performance            // 人员业绩
GET  /api/v1/data-center/staff-performance/ranking    // 业绩排名

// 人员成本
GET  /api/v1/data-center/staff-cost                   // 人员成本
GET  /api/v1/data-center/staff-cost/analysis          // 成本分析

// 商品历史采购价
GET  /api/v1/data-center/product-history-price        // 历史价格
GET  /api/v1/data-center/product-history-price/trend  // 价格趋势

// 商品当下成本
GET  /api/v1/data-center/product-current-cost         // 当前成本
GET  /api/v1/data-center/product-current-cost/margin  // 毛利分析
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

---

## 第六部分：开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| 1 | 营业额 + 销量 | 3 天 |
| 2 | 区域 + 人员业绩 | 3 天 |
| 3 | 人员成本 | 2 天 |
| 4 | 商品价格相关 | 2 天 |
| 5 | 联调测试 | 2 天 |
| **总计** | | **12 天** |
