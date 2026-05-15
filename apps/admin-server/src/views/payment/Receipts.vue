<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="收款编号"><el-input v-model="queryForm.receiptNo" clearable /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="正常" value="normal" />
            <el-option label="异常" value="abnormal" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleDailyRecon">日对账</el-button>
          <el-button @click="handleMonthlyRecon">月对账</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="payStore.receipts" v-loading="payStore.loading" stripe border>
        <el-table-column prop="receiptNo" label="收款编号" width="140" />
        <el-table-column prop="merchantName" label="商家" width="120" />
        <el-table-column prop="amount" label="金额" width="100" />
        <el-table-column prop="payType" label="支付方式" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : 'danger'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'abnormal'" type="warning" link size="small" @click="handleProcess(row.id)">处理异常</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="payStore.receiptTotal" layout="total, prev, pager, next" @current-change="fetchData" />
    </el-card>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { usePaymentStore } from '@/stores/payment'
import { ElMessage } from 'element-plus'

const payStore = usePaymentStore()
const queryForm = reactive({ receiptNo: '', status: '', page: 1, pageSize: 20 })
const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const fetchData = () => payStore.fetchReceipts(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }

const handleDailyRecon = async () => {
  await payStore.dailyReconciliation({})
  ElMessage.success('日对账已完成')
}

const handleMonthlyRecon = async () => {
  await payStore.monthlyReconciliation({})
  ElMessage.success('月对账已完成')
}

const handleProcess = async (id) => {
  await payStore.processAbnormal(id, { status: 'processed' })
  ElMessage.success('异常已处理')
  fetchData()
}

onMounted(() => fetchData())
</script>