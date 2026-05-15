<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="订单号"><el-input v-model="queryForm.orderNo" placeholder="订单号" clearable /></el-form-item>
        <el-form-item label="客户名"><el-input v-model="queryForm.customerName" placeholder="客户名称" clearable /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="待确认" value="pending" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="csStore.orders" v-loading="csStore.loading" stripe border>
        <el-table-column prop="orderNo" label="订单号" width="150" />
        <el-table-column prop="customerName" label="客户" width="100" />
        <el-table-column prop="totalAmount" label="总金额" width="100">
          <template #default="{ row }">{{ row.totalAmount?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="payAmount" label="实付" width="100">
          <template #default="{ row }">{{ row.payAmount?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="orderStatusMap[row.status]?.type || 'info'" size="small">{{ orderStatusMap[row.status]?.label || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式" width="80">
          <template #default="{ row }">{{ payTypeMap[row.payType] || '-' }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleConfirm(row.id)">确认</el-button>
            <el-button v-if="row.status === 'pending'" type="danger" link size="small" @click="handleCancel(row.id)">取消</el-button>
            <el-button type="warning" link size="small" @click="showRemark(row)">备注</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="csStore.orderTotal" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @current-change="fetchData" @size-change="fetchData" />
    </el-card>
    <el-dialog v-model="detailVisible" title="订单详情" width="700px">
      <el-descriptions :column="2" border v-if="currentOrder">
        <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="客户">{{ currentOrder.customerName }}</el-descriptions-item>
        <el-descriptions-item label="总金额">{{ currentOrder.totalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="实付金额">{{ currentOrder.payAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="折扣">{{ currentOrder.discountAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ orderStatusMap[currentOrder.status]?.label }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentOrder.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
      <el-table :data="currentOrder?.items || []" stripe border style="margin-top: 16px">
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="price" label="单价" width="80">
          <template #default="{ row }">{{ row.price?.toFixed(2) }}</template>
        </el-table-column>
      </el-table>
      <div v-if="currentOrder?.operatorLog?.length" style="margin-top: 16px">
        <div style="font-weight: bold; margin-bottom: 8px">操作日志</div>
        <el-timeline>
          <el-timeline-item v-for="log in currentOrder.operatorLog" :key="log.id" :timestamp="formatDate(log.createdAt)" placement="top">
            {{ log.operatorName }} - {{ log.action }}: {{ log.remark || '-' }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
    <el-dialog v-model="remarkVisible" title="添加备注" width="400px">
      <el-input v-model="remarkContent" type="textarea" :rows="3" placeholder="备注内容" />
      <template #footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddRemark">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCustomerServiceStore } from '@/stores/customer-service'
import { ElMessage, ElMessageBox } from 'element-plus'

const csStore = useCustomerServiceStore()
const orderStatusMap = { pending: { label: '待确认', type: 'info' }, confirmed: { label: '已确认', type: '' }, shipped: { label: '已发货', type: 'warning' }, completed: { label: '已完成', type: 'success' }, cancelled: { label: '已取消', type: 'danger' } }
const payTypeMap = { wechat: '微信', alipay: '支付宝' }

const queryForm = reactive({ orderNo: '', customerName: '', status: '', page: 1, pageSize: 20 })
const detailVisible = ref(false)
const remarkVisible = ref(false)
const remarkContent = ref('')
const remarkOrderId = ref('')
const currentOrder = ref(null)

const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const fetchData = () => csStore.fetchOrders(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { orderNo: '', customerName: '', status: '', page: 1, pageSize: 20 }); fetchData() }
const handleExport = () => ElMessage.success('导出已触发')

const showDetail = async (row) => {
  await csStore.fetchOrderDetail(row.id)
  currentOrder.value = csStore.orderDetail
  detailVisible.value = true
}

const handleConfirm = async (id) => {
  await csStore.approveOrder(id)
  ElMessage.success('确认成功')
  fetchData()
}

const handleCancel = async (id) => {
  await ElMessageBox.confirm('确认取消该订单?', '提示', { type: 'warning' })
  await csStore.cancelOrder(id)
  ElMessage.success('取消成功')
  fetchData()
}

const showRemark = (row) => {
  remarkOrderId.value = row.id
  remarkContent.value = ''
  remarkVisible.value = true
}

const handleAddRemark = async () => {
  await csStore.remarkOrder(remarkOrderId.value, { remark: remarkContent.value })
  ElMessage.success('备注添加成功')
  remarkVisible.value = false
  fetchData()
}

onMounted(() => fetchData())
</script>