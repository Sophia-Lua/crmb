<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="月份"><el-date-picker v-model="queryForm.month" type="month" value-format="YYYY-MM" /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="supStore.monthlyReconciliation" v-loading="supStore.loading" stripe border>
        <el-table-column prop="period" label="对账周期" width="120" />
        <el-table-column prop="orderCount" label="订单数" width="80" />
        <el-table-column prop="totalAmount" label="总金额" width="100" />
        <el-table-column prop="settledAmount" label="已结算" width="100" />
        <el-table-column prop="difference" label="差异金额" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.difference" type="warning" link size="small" @click="handleDifference(row.id)">处理差异</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleConfirm(row.id)">确认对账</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useSupplierStore } from '@/stores/supplier'
import { ElMessage } from 'element-plus'

const supStore = useSupplierStore()
const queryForm = reactive({ month: '' })

const handleQuery = () => supStore.fetchMonthlyReconciliation(queryForm)

const handleDifference = async (id) => {
  await supStore.processReconciliationDifference(id, { remark: '差异处理' })
  ElMessage.success('差异已处理')
  supStore.fetchMonthlyReconciliation(queryForm)
}

const handleConfirm = async (id) => {
  await supStore.confirmReconciliation(id)
  ElMessage.success('对账确认成功')
  supStore.fetchMonthlyReconciliation(queryForm)
}

onMounted(() => supStore.fetchMonthlyReconciliation())
</script>