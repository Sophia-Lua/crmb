<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="类型">
          <el-select v-model="queryForm.type" placeholder="全部" clearable>
            <el-option label="退货" value="return" />
            <el-option label="换货" value="exchange" />
            <el-option label="退款" value="refund" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已审核" value="approved" />
            <el-option label="已收货" value="received" />
            <el-option label="已退款" value="refunded" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号"><el-input v-model="queryForm.orderNo" placeholder="订单号" clearable /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="csStore.afterSales" v-loading="csStore.loading" stripe border>
        <el-table-column prop="afterSaleNo" label="售后单号" width="140" />
        <el-table-column prop="orderNo" label="关联订单" width="150" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">{{ afterSaleTypeMap[row.type] || row.type }}</template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" min-width="120" show-overflow-tooltip />
        <el-table-column prop="refundAmount" label="退款金额" width="100">
          <template #default="{ row }">{{ row.refundAmount?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="asStatusMap[row.status]?.type || 'info'" size="small">{{ asStatusMap[row.status]?.label || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="handlerName" label="处理人" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="170">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleAudit(row.id)">审核</el-button>
            <el-button v-if="row.status === 'approved'" type="warning" link size="small" @click="handleReceive(row.id)">确认收货</el-button>
            <el-button v-if="row.status === 'received'" type="primary" link size="small" @click="handleRefund(row.id)">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="csStore.afterSaleTotal" layout="total, prev, pager, next" @current-change="fetchData" />
    </el-card>
    <el-dialog v-model="detailVisible" title="售后详情" width="700px">
      <el-descriptions :column="2" border v-if="currentAfterSale">
        <el-descriptions-item label="售后单号">{{ currentAfterSale.afterSaleNo }}</el-descriptions-item>
        <el-descriptions-item label="关联订单">{{ currentAfterSale.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ afterSaleTypeMap[currentAfterSale.type] }}</el-descriptions-item>
        <el-descriptions-item label="退款金额">{{ currentAfterSale.refundAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="原因" :span="2">{{ currentAfterSale.reason }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ currentAfterSale.description }}</el-descriptions-item>
      </el-descriptions>
      <el-table :data="currentAfterSale?.items || []" stripe border style="margin-top: 16px">
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="refundAmount" label="退款金额" width="100" />
      </el-table>
      <div v-if="currentAfterSale?.process?.length" style="margin-top: 16px">
        <div style="font-weight: bold; margin-bottom: 8px">处理流程</div>
        <el-timeline>
          <el-timeline-item v-for="p in currentAfterSale.process" :key="p.id" :timestamp="formatDate(p.createdAt)" placement="top">
            {{ p.operatorName }} - {{ p.action }}: {{ p.remark || '-' }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCustomerServiceStore } from '@/stores/customer-service'
import { ElMessage, ElMessageBox } from 'element-plus'

const csStore = useCustomerServiceStore()
const afterSaleTypeMap = { return: '退货', exchange: '换货', refund: '退款' }
const asStatusMap = { pending: { label: '待审核', type: 'info' }, approved: { label: '已审核', type: '' }, received: { label: '已收货', type: 'warning' }, refunded: { label: '已退款', type: 'success' }, completed: { label: '已完成', type: 'success' }, rejected: { label: '已拒绝', type: 'danger' } }

const queryForm = reactive({ type: '', status: '', orderNo: '', page: 1, pageSize: 20 })
const detailVisible = ref(false)
const currentAfterSale = ref(null)

const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const fetchData = () => csStore.fetchAfterSales(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { type: '', status: '', orderNo: '', page: 1, pageSize: 20 }); fetchData() }

const showDetail = async (row) => {
  await csStore.fetchAfterSaleDetail(row.id)
  currentAfterSale.value = csStore.afterSaleDetail
  detailVisible.value = true
}

const handleAudit = async (id) => {
  await ElMessageBox.confirm('确认审核通过?', '提示', { type: 'success' })
  await csStore.auditAfterSale(id)
  ElMessage.success('审核通过')
  fetchData()
}

const handleReceive = async (id) => {
  await csStore.confirmReceive(id)
  ElMessage.success('确认收货成功')
  fetchData()
}

const handleRefund = async (id) => {
  await ElMessageBox.confirm('确认处理退款?', '提示', { type: 'warning' })
  await csStore.processRefund(id)
  ElMessage.success('退款处理成功')
  fetchData()
}

onMounted(() => fetchData())
</script>