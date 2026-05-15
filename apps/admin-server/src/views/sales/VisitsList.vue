<template>
  <div>
    <el-card style="margin-bottom: 16px">
      <el-row :gutter="20">
        <el-col :span="6"><el-statistic title="今日拜访" :value="visitStatistics.today || 0" /></el-col>
        <el-col :span="6"><el-statistic title="本周拜访" :value="visitStatistics.thisWeek || 0" /></el-col>
        <el-col :span="6"><el-statistic title="本月拜访" :value="visitStatistics.thisMonth || 0" /></el-col>
        <el-col :span="6"><el-statistic title="总拜访数" :value="visitStatistics.total || 0" /></el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="待执行" value="pending" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryForm.visitType" placeholder="全部" clearable>
            <el-option label="首次拜访" value="first" />
            <el-option label="定期回访" value="regular" />
            <el-option label="重点跟进" value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="方式">
          <el-select v-model="queryForm.visitMethod" placeholder="全部" clearable>
            <el-option label="上门" value="onsite" />
            <el-option label="电话" value="phone" />
            <el-option label="线上" value="online" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="queryForm.dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model="queryForm.customerName" placeholder="客户名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 16px">
        <el-button type="primary" @click="router.push('/sales/visits/create')">新建拜访</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
      <el-table :data="salesStore.visits" v-loading="salesStore.loading" stripe border>
        <el-table-column prop="customerName" label="客户名称" min-width="140" />
        <el-table-column prop="visitType" label="拜访类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.visitType === 'first' ? 'success' : row.visitType === 'regular' ? '' : 'warning'" size="small">
              {{ visitTypeMap[row.visitType] || row.visitType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="visitMethod" label="拜访方式" width="80">
          <template #default="{ row }">{{ visitMethodMap[row.visitMethod] || row.visitMethod }}</template>
        </el-table-column>
        <el-table-column prop="planDate" label="计划日期" width="110" />
        <el-table-column prop="subject" label="拜访主题" min-width="160" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.type || 'info'" size="small">{{ statusMap[row.status]?.label || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="170">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="router.push(`/sales/visits/${row.id}`)">详情</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="salesStore.visitTotal" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next" @current-change="fetchData" @size-change="fetchData" />
    </el-card>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const salesStore = useSalesStore()

const visitTypeMap = { first: '首次拜访', regular: '定期回访', key: '重点跟进' }
const visitMethodMap = { onsite: '上门', phone: '电话', online: '线上' }
const statusMap = { pending: { label: '待执行', type: 'info' }, in_progress: { label: '进行中', type: 'warning' }, completed: { label: '已完成', type: 'success' }, cancelled: { label: '已取消', type: 'danger' } }

const queryForm = reactive({ status: '', visitType: '', visitMethod: '', dateRange: null, customerName: '', page: 1, pageSize: 20 })
const visitStatistics = ref({})

import { ref } from 'vue'

const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const fetchData = () => {
  const params = { ...queryForm }
  if (queryForm.dateRange) {
    params.startDate = queryForm.dateRange[0]
    params.endDate = queryForm.dateRange[1]
  }
  delete params.dateRange
  salesStore.fetchVisits(params)
}

const fetchStatistics = () => {
  salesStore.fetchVisitStatistics().then(() => {
    visitStatistics.value = salesStore.visitStatistics
  })
}

const handleQuery = () => {
  queryForm.page = 1
  fetchData()
}

const resetQuery = () => {
  Object.assign(queryForm, { status: '', visitType: '', visitMethod: '', dateRange: null, customerName: '', page: 1, pageSize: 20 })
  fetchData()
}

const handleExport = () => {
  ElMessage.success('导出功能已触发')
}

const handleDelete = async (id) => {
  await ElMessageBox.confirm('确认删除该拜访记录?', '提示', { type: 'warning' })
  await salesStore.deleteVisit(id)
  ElMessage.success('删除成功')
  fetchData()
}

onMounted(() => {
  fetchData()
  fetchStatistics()
})
</script>