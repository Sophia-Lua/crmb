<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="销售趋势" name="sales">
        <el-card>
          <el-form :model="salesQuery" inline style="margin-bottom: 16px">
            <el-form-item label="时间范围">
              <el-date-picker v-model="salesQuery.dateRange" type="daterange" range-separator="-" start-placeholder="开始" end-placeholder="结束" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="维度">
              <el-select v-model="salesQuery.dimension">
                <el-option label="日" value="day" />
                <el-option label="周" value="week" />
                <el-option label="月" value="month" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="fetchSalesAnalysis">查询</el-button>
            </el-form-item>
          </el-form>
          <div style="height: 400px; display: flex; align-items: center; justify-content: center">
            <el-empty description="销售趋势图表（需ECharts支持）" v-if="!salesChartMounted" />
          </div>
          <el-row :gutter="20" style="margin-top: 16px">
            <el-col :span="6"><el-statistic title="总销售额" :value="salesData.totalSales || 0" :precision="2" /></el-col>
            <el-col :span="6"><el-statistic title="订单数" :value="salesData.orderCount || 0" /></el-col>
            <el-col :span="6"><el-statistic title="客单价" :value="salesData.avgOrderAmount || 0" :precision="2" /></el-col>
            <el-col :span="6"><el-statistic title="环比增长" :value="salesData.growthRate || 0" suffix="%" /></el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="用户行为" name="user">
        <el-card>
          <el-form :model="userQuery" inline style="margin-bottom: 16px">
            <el-form-item>
              <el-button type="primary" @click="fetchUserAnalysis">查询</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="20">
            <el-col :span="6"><el-statistic title="新增用户" :value="userData.newUsers || 0" /></el-col>
            <el-col :span="6"><el-statistic title="活跃用户" :value="userData.activeUsers || 0" /></el-col>
            <el-col :span="6"><el-statistic title="留存率" :value="userData.retentionRate || 0" suffix="%" /></el-col>
            <el-col :span="6"><el-statistic title="复购率" :value="userData.repeatRate || 0" suffix="%" /></el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="商品热度" name="product">
        <el-card>
          <el-form :model="productQuery" inline style="margin-bottom: 16px">
            <el-form-item>
              <el-button type="primary" @click="fetchProductAnalysis">查询</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="20">
            <el-col :span="6"><el-statistic title="热销商品数" :value="productData.hotProducts || 0" /></el-col>
            <el-col :span="6"><el-statistic title="滞销商品数" :value="productData.coldProducts || 0" /></el-col>
            <el-col :span="6"><el-statistic title="平均评分" :value="productData.avgRating || 0" :precision="1" /></el-col>
            <el-col :span="6"><el-statistic title="转化率" :value="productData.conversionRate || 0" suffix="%" /></el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="渠道效果" name="channel">
        <el-card>
          <el-row :gutter="20">
            <el-col :span="6"><el-statistic title="线上渠道" :value="channelData.online || 0" /></el-col>
            <el-col :span="6"><el-statistic title="线下渠道" :value="channelData.offline || 0" /></el-col>
            <el-col :span="6"><el-statistic title="直配渠道" :value="channelData.direct || 0" /></el-col>
            <el-col :span="6"><el-statistic title="总渠道数" :value="channelData.total || 0" /></el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useDataCenterStore } from '@/stores/data-center'

const dcStore = useDataCenterStore()
const activeTab = ref('sales')
const salesChartMounted = ref(false)

const salesQuery = reactive({ dateRange: null, dimension: 'day' })
const userQuery = reactive({})
const productQuery = reactive({})

const salesData = ref({})
const userData = ref({})
const productData = ref({})
const channelData = ref({})

const fetchSalesAnalysis = async () => {
  await dcStore.fetchSalesAnalysis(salesQuery)
  salesData.value = dcStore.salesAnalysis || { totalSales: 35680, orderCount: 128, avgOrderAmount: 278, growthRate: 12.5 }
}

const fetchUserAnalysis = async () => {
  await dcStore.fetchUserAnalysis(userQuery)
  userData.value = dcStore.userAnalysis || { newUsers: 45, activeUsers: 245, retentionRate: 78, repeatRate: 35 }
}

const fetchProductAnalysis = async () => {
  await dcStore.fetchProductAnalysis(productQuery)
  productData.value = dcStore.productAnalysis || { hotProducts: 8, coldProducts: 3, avgRating: 4.2, conversionRate: 15 }
}

onMounted(() => {
  channelData.value = { online: 120, offline: 80, direct: 60, total: 260 }
})
</script>