<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="客户名">
          <el-input v-model="queryForm.customerName" placeholder="客户名称" clearable />
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
        </el-form-item>
      </el-form>
      <el-table :data="salesStore.privateCustomers" v-loading="salesStore.loading" stripe border>
        <el-table-column prop="customerName" label="客户名称" min-width="120" />
        <el-table-column prop="storeType" label="客户类型" width="100">
          <template #default="{ row }">{{ storeTypeMap[row.storeType] || row.storeType }}</template>
        </el-table-column>
        <el-table-column prop="contactPhone" label="联系电话" width="120" />
        <el-table-column prop="grade" label="等级" width="80">
          <template #default="{ row }">
            <el-tag :type="row.grade === 'A' ? 'success' : row.grade === 'B' ? '' : 'warning'" size="small">{{ row.grade }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="assignedTo" label="负责人" width="100" />
        <el-table-column prop="totalOrderAmount" label="订单金额" width="100">
          <template #default="{ row }">{{ row.totalOrderAmount?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="router.push(`/sales/customers/${row.id}`)">详情</el-button>
            <el-button type="success" link size="small" @click="router.push(`/sales/visits/create?customerId=${row.id}`)">新建拜访</el-button>
            <el-button type="warning" link size="small" @click="handleTransfer(row.id)">转移</el-button>
            <el-button type="danger" link size="small" @click="handleReturn(row.id)">归还公海</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="salesStore.privateCustomerTotal" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @current-change="fetchData" @size-change="fetchData" />
    </el-card>
    <el-dialog v-model="transferVisible" title="转移客户" width="400px">
      <el-form label-width="80px">
        <el-form-item label="转移给">
          <el-input v-model="transferTo" placeholder="请输入目标负责人ID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="transferVisible = false">取消</el-button>
        <el-button type="primary" @click="doTransfer">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const salesStore = useSalesStore()
const storeTypeMap = { supermarket: '超市', restaurant: '餐饮', convenience: '便利店' }
const queryForm = reactive({ customerName: '', sortBy: '', page: 1, pageSize: 20 })
const transferVisible = ref(false)
const transferTo = ref('')
const transferId = ref('')

const fetchData = () => salesStore.fetchPrivateCustomers(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { customerName: '', sortBy: '', page: 1, pageSize: 20 }); fetchData() }

const handleTransfer = (id) => {
  transferId.value = id
  transferTo.value = ''
  transferVisible.value = true
}

const doTransfer = async () => {
  await salesStore.transferCustomer(transferId.value, { assignedTo: transferTo.value })
  ElMessage.success('转移成功')
  transferVisible.value = false
  fetchData()
}

const handleReturn = async (id) => {
  await ElMessageBox.confirm('确认将该客户归还到公海?', '提示', { type: 'warning' })
  await salesStore.returnCustomer(id)
  ElMessage.success('归还成功')
  fetchData()
}

onMounted(() => fetchData())
</script>