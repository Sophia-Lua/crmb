<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="客户名">
          <el-input v-model="queryForm.customerName" placeholder="客户名称" clearable />
        </el-form-item>
        <el-form-item label="客户类型">
          <el-select v-model="queryForm.storeType" placeholder="全部" clearable>
            <el-option label="超市" value="supermarket" />
            <el-option label="餐饮" value="restaurant" />
            <el-option label="便利店" value="convenience" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="queryForm.sortBy" placeholder="默认" clearable>
            <el-option label="最近活跃" value="lastVisitDate" />
            <el-option label="订单金额" value="totalOrderAmount" />
            <el-option label="客户等级" value="grade" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="success" @click="handleBatchClaim">批量领取</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="salesStore.publicCustomers" v-loading="salesStore.loading" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="customerName" label="客户名称" min-width="120" />
        <el-table-column prop="storeType" label="客户类型" width="100">
          <template #default="{ row }">{{ storeTypeMap[row.storeType] || row.storeType }}</template>
        </el-table-column>
        <el-table-column prop="contactPhone" label="联系电话" width="120" />
        <el-table-column prop="address" label="地址" min-width="160" show-overflow-tooltip />
        <el-table-column prop="grade" label="等级" width="80">
          <template #default="{ row }">
            <el-tag :type="row.grade === 'A' ? 'success' : row.grade === 'B' ? '' : row.grade === 'C' ? 'warning' : 'info'" size="small">{{ row.grade }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleClaim(row.id)">领取</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="salesStore.publicCustomerTotal" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @current-change="fetchData" @size-change="fetchData" />
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useSalesStore } from '@/stores/sales'
import { ElMessage } from 'element-plus'

const salesStore = useSalesStore()
const storeTypeMap = { supermarket: '超市', restaurant: '餐饮', convenience: '便利店' }
const queryForm = reactive({ customerName: '', storeType: '', sortBy: '', page: 1, pageSize: 20 })
const selectedRows = ref([])

const fetchData = () => salesStore.fetchPublicCustomers(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { customerName: '', storeType: '', sortBy: '', page: 1, pageSize: 20 }); fetchData() }
const handleExport = () => ElMessage.success('导出已触发')

const handleSelectionChange = (rows) => { selectedRows.value = rows }

const handleClaim = async (id) => {
  await salesStore.claimCustomer(id)
  ElMessage.success('领取成功')
  fetchData()
}

const handleBatchClaim = async () => {
  if (!selectedRows.value.length) return ElMessage.warning('请先选择客户')
  for (const row of selectedRows.value) {
    await salesStore.claimCustomer(row.id)
  }
  ElMessage.success('批量领取成功')
  fetchData()
}

onMounted(() => fetchData())
</script>