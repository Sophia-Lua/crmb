<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="订单号"><el-input v-model="queryForm.orderNo" clearable /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="待确认" value="pending" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="异常" value="exception" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="supStore.orders" v-loading="supStore.loading" stripe border>
        <el-table-column prop="orderNo" label="订单号" width="140" />
        <el-table-column prop="productName" label="商品" min-width="140" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="amount" label="金额" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'confirmed' ? 'success' : row.status === 'exception' ? 'danger' : 'warning'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleConfirm(row.id)">确认</el-button>
            <el-button v-if="row.status === 'exception'" type="warning" link size="small" @click="handleException(row.id)">处理异常</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="supStore.orderTotal" layout="total, prev, pager, next" @current-change="fetchData" />
    </el-card>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useSupplierStore } from '@/stores/supplier'
import { ElMessage } from 'element-plus'

const supStore = useSupplierStore()
const queryForm = reactive({ orderNo: '', status: '', page: 1, pageSize: 20 })

const fetchData = () => supStore.fetchOrders(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { orderNo: '', status: '', page: 1, pageSize: 20 }); fetchData() }

const handleConfirm = async (id) => {
  await supStore.confirmOrder(id)
  ElMessage.success('确认成功')
  fetchData()
}

const handleException = async (id) => {
  await supStore.handleOrderException(id, { remark: '异常处理' })
  ElMessage.success('异常已处理')
  fetchData()
}

onMounted(() => fetchData())
</script>