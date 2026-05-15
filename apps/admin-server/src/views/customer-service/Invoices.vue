<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="发票类型">
          <el-select v-model="queryForm.type" placeholder="全部" clearable>
            <el-option label="电子发票" value="electronic" />
            <el-option label="纸质发票" value="paper" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已开具" value="issued" />
            <el-option label="已邮寄" value="mailed" />
            <el-option label="已作废" value="voided" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="csStore.invoices" v-loading="csStore.loading" stripe border>
        <el-table-column prop="invoiceNo" label="发票号" width="150" />
        <el-table-column prop="orderNo" label="关联订单" width="150" />
        <el-table-column prop="customerName" label="客户" width="100" />
        <el-table-column prop="type" label="发票类型" width="100">
          <template #default="{ row }">{{ row.type === 'electronic' ? '电子发票' : '纸质发票' }}</template>
        </el-table-column>
        <el-table-column prop="title" label="抬头" width="100" />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">{{ row.amount?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="invoiceStatusMap[row.status]?.type || 'info'" size="small">{{ invoiceStatusMap[row.status]?.label || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="170">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleAudit(row.id)">审核</el-button>
            <el-button v-if="row.status === 'approved'" type="primary" link size="small" @click="handleIssue(row.id)">开具</el-button>
            <el-button v-if="row.status === 'issued' && row.type === 'paper'" type="warning" link size="small" @click="handleMail(row.id)">邮寄</el-button>
            <el-button type="danger" link size="small" @click="handleVoid(row.id)">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="csStore.invoiceTotal" layout="total, prev, pager, next" @current-change="fetchData" />
    </el-card>
    <el-dialog v-model="detailVisible" title="发票详情" width="500px">
      <el-descriptions :column="2" border v-if="currentInvoice">
        <el-descriptions-item label="发票号">{{ currentInvoice.invoiceNo }}</el-descriptions-item>
        <el-descriptions-item label="关联订单">{{ currentInvoice.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="客户">{{ currentInvoice.customerName }}</el-descriptions-item>
        <el-descriptions-item label="发票类型">{{ currentInvoice.type === 'electronic' ? '电子发票' : '纸质发票' }}</el-descriptions-item>
        <el-descriptions-item label="抬头">{{ currentInvoice.title }}</el-descriptions-item>
        <el-descriptions-item label="税号">{{ currentInvoice.taxNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="金额">{{ currentInvoice.amount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ invoiceStatusMap[currentInvoice.status]?.label }}</el-descriptions-item>
        <el-descriptions-item label="审核人">{{ currentInvoice.approverName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="开具人">{{ currentInvoice.issuerName || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCustomerServiceStore } from '@/stores/customer-service'
import { ElMessage, ElMessageBox } from 'element-plus'

const csStore = useCustomerServiceStore()
const invoiceStatusMap = { pending: { label: '待审核', type: 'info' }, approved: { label: '已审核', type: '' }, issued: { label: '已开具', type: 'success' }, mailed: { label: '已邮寄', type: 'success' }, voided: { label: '已作废', type: 'danger' } }

const queryForm = reactive({ type: '', status: '', page: 1, pageSize: 20 })
const detailVisible = ref(false)
const currentInvoice = ref(null)

const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const fetchData = () => csStore.fetchInvoices(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { type: '', status: '', page: 1, pageSize: 20 }); fetchData() }

const showDetail = async (row) => {
  await csStore.fetchInvoiceDetail(row.id)
  currentInvoice.value = csStore.invoiceDetail
  detailVisible.value = true
}

const handleAudit = async (id) => {
  await csStore.auditInvoice(id, { status: 'approved' })
  ElMessage.success('审核通过')
  fetchData()
}

const handleIssue = async (id) => {
  await csStore.issueInvoice(id)
  ElMessage.success('开具成功')
  fetchData()
}

const handleMail = async (id) => {
  const { value } = await ElMessageBox.prompt('请输入快递单号', '邮寄发票')
  await csStore.mailInvoice(id, { trackingNo: value })
  ElMessage.success('邮寄信息已更新')
  fetchData()
}

const handleVoid = async (id) => {
  await ElMessageBox.confirm('确认作废该发票?', '提示', { type: 'warning' })
  await csStore.voidInvoice(id, { reason: '作废' })
  ElMessage.success('发票已作废')
  fetchData()
}

onMounted(() => fetchData())
</script>