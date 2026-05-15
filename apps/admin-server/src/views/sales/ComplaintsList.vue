<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="类型">
          <el-select v-model="queryForm.type" placeholder="全部" clearable>
            <el-option label="配送" value="delivery" />
            <el-option label="质量" value="quality" />
            <el-option label="服务" value="service" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="queryForm.priority" placeholder="全部" clearable>
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="待受理" value="pending" />
            <el-option label="已受理" value="accepted" />
            <el-option label="处理中" value="processing" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户名">
          <el-input v-model="queryForm.customerName" placeholder="客户名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="salesStore.complaints" v-loading="salesStore.loading" stripe border>
        <el-table-column prop="complaintNo" label="客诉编号" width="150" />
        <el-table-column prop="customerName" label="客户名称" min-width="120" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">{{ complaintTypeMap[row.type] || row.type }}</template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="80">
          <template #default="{ row }">
            <el-tag :type="row.priority === 'high' ? 'danger' : row.priority === 'medium' ? 'warning' : 'info'" size="small">{{ priorityMap[row.priority] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="complaintStatusMap[row.status]?.type || 'info'" size="small">{{ complaintStatusMap[row.status]?.label || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="assigneeName" label="处理人" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="170">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="router.push(`/customer-service/complaints`)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'

const router = useRouter()
const salesStore = useSalesStore()
const complaintTypeMap = { delivery: '配送', quality: '质量', service: '服务' }
const priorityMap = { high: '高', medium: '中', low: '低' }
const complaintStatusMap = { pending: { label: '待受理', type: 'info' }, accepted: { label: '已受理', type: '' }, processing: { label: '处理中', type: 'warning' }, closed: { label: '已关闭', type: 'success' } }

const queryForm = reactive({ type: '', priority: '', status: '', customerName: '' })
const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const handleQuery = () => salesStore.fetchComplaints(queryForm)
const resetQuery = () => { Object.assign(queryForm, { type: '', priority: '', status: '', customerName: '' }); salesStore.fetchComplaints() }

onMounted(() => salesStore.fetchComplaints())
</script>