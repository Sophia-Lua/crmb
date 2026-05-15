<template>
  <div>
    <el-card>
      <el-form :model="queryForm" label-width="80px" style="max-width: 800px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="模块">
              <el-select v-model="queryForm.module" placeholder="请选择">
                <el-option label="销售" value="sales" />
                <el-option label="客服" value="customer_service" />
                <el-option label="仓库" value="warehouse" />
                <el-option label="财务" value="finance" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据类型">
              <el-select v-model="queryForm.dataType" placeholder="请选择">
                <el-option label="订单数据" value="order" />
                <el-option label="客户数据" value="customer" />
                <el-option label="库存数据" value="inventory" />
                <el-option label="财务数据" value="finance" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间范围">
              <el-date-picker v-model="queryForm.dateRange" type="daterange" range-separator="-" start-placeholder="开始" end-placeholder="结束" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="维度">
              <el-select v-model="queryForm.dimension" placeholder="请选择">
                <el-option label="日" value="day" />
                <el-option label="周" value="week" />
                <el-option label="月" value="month" />
                <el-option label="年" value="year" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="筛选条件">
              <el-input v-model="queryForm.filter" placeholder="关键词筛选" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="success" @click="handleRealtime">实时数据</el-button>
          <el-button @click="handleHistory">历史数据</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 16px" v-if="dcStore.queryResult">
      <el-table :data="dcStore.queryResult?.list || []" stripe border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="value" label="数值" width="120" />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useDataCenterStore } from '@/stores/data-center'
import { ElMessage } from 'element-plus'

const dcStore = useDataCenterStore()
const queryForm = reactive({ module: '', dataType: '', dateRange: null, dimension: '', filter: '' })

const handleQuery = () => dcStore.queryData(queryForm)
const handleRealtime = () => dcStore.fetchRealtimeData(queryForm)
const handleHistory = () => dcStore.fetchHistoryData(queryForm)
const handleExport = () => ElMessage.success('导出已触发')

onMounted(() => {})
</script>