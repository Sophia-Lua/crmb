<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="订单号"><el-input v-model="queryForm.orderNo" clearable /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="待审批" value="pending" />
            <el-option label="已审批" value="approved" />
            <el-option label="执行中" value="executing" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="success" @click="showCreateDialog = true">创建采购订单</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="procStore.purchaseOrders" v-loading="procStore.loading" stripe border>
        <el-table-column prop="orderNo" label="订单号" width="140" />
        <el-table-column prop="supplierName" label="供应商" width="120" />
        <el-table-column prop="totalAmount" label="总金额" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag size="small">{{ poStatusMap[row.status] || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleApprove(row.id)">审批</el-button>
            <el-button type="primary" link size="small" @click="ElMessage.info('跟踪')">跟踪</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="procStore.purchaseOrderTotal" layout="total, prev, pager, next" @current-change="fetchData" />
    </el-card>
    <el-dialog v-model="showCreateDialog" title="创建采购订单" width="500px">
      <el-form :model="createForm" label-width="80px">
        <el-form-item label="供应商"><el-input v-model="createForm.supplierId" placeholder="供应商ID" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="createForm.remark" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useProcurementStore } from '@/stores/procurement'
import { ElMessage, ElMessageBox } from 'element-plus'

const procStore = useProcurementStore()
const poStatusMap = { pending: '待审批', approved: '已审批', executing: '执行中', completed: '已完成' }
const showCreateDialog = ref(false)

const queryForm = reactive({ orderNo: '', status: '', page: 1, pageSize: 20 })
const createForm = reactive({ supplierId: '', remark: '' })
const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const fetchData = () => procStore.fetchPurchaseOrders(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { orderNo: '', status: '', page: 1, pageSize: 20 }); fetchData() }

const handleApprove = async (id) => {
  await ElMessageBox.confirm('确认审批通过?', '提示')
  await procStore.approvePurchaseOrder(id, { status: 'approved' })
  ElMessage.success('审批通过')
  fetchData()
}

const handleCreate = async () => {
  await procStore.createPurchaseOrder(createForm)
  ElMessage.success('创建成功')
  showCreateDialog.value = false
  fetchData()
}

onMounted(() => fetchData())
</script>