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
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="csStore.complaints" v-loading="csStore.loading" stripe border>
        <el-table-column prop="complaintNo" label="编号" width="150" />
        <el-table-column prop="customerName" label="客户" width="100" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">{{ typeMap[row.type] || row.type }}</template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="80">
          <template #default="{ row }">
            <el-tag :type="row.priority === 'high' ? 'danger' : row.priority === 'medium' ? 'warning' : 'info'" size="small">{{ priorityMap[row.priority] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.type || 'info'" size="small">{{ statusMap[row.status]?.label || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="assigneeName" label="处理人" width="100" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleAccept(row.id)">受理</el-button>
            <el-button v-if="row.status === 'accepted'" type="warning" link size="small" @click="handleProcess(row.id)">处理</el-button>
            <el-button v-if="row.status === 'processing'" type="primary" link size="small" @click="showReply(row)">回复</el-button>
            <el-button v-if="row.status === 'processing'" type="success" link size="small" @click="handleClose(row.id)">关闭</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="csStore.complaintTotal" layout="total, prev, pager, next" @current-change="fetchData" />
    </el-card>
    <el-dialog v-model="detailVisible" title="客诉详情" width="700px">
      <el-descriptions :column="2" border v-if="currentComplaint">
        <el-descriptions-item label="编号">{{ currentComplaint.complaintNo }}</el-descriptions-item>
        <el-descriptions-item label="客户">{{ currentComplaint.customerName }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ typeMap[currentComplaint.type] }}</el-descriptions-item>
        <el-descriptions-item label="优先级">{{ priorityMap[currentComplaint.priority] }}</el-descriptions-item>
        <el-descriptions-item label="内容" :span="2">{{ currentComplaint.content }}</el-descriptions-item>
        <el-descriptions-item label="处理人">{{ currentComplaint.assigneeName }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ statusMap[currentComplaint.status]?.label }}</el-descriptions-item>
      </el-descriptions>
      <div v-if="currentComplaint?.process?.length" style="margin-top: 16px">
        <div style="font-weight: bold; margin-bottom: 8px">处理流程</div>
        <el-timeline>
          <el-timeline-item v-for="p in currentComplaint.process" :key="p.id" :timestamp="formatDate(p.createdAt)" placement="top">
            {{ p.operatorName }} - {{ p.action }}: {{ p.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
    <el-dialog v-model="replyVisible" title="回复客诉" width="400px">
      <el-input v-model="replyContent" type="textarea" :rows="4" placeholder="回复内容" />
      <template #footer>
        <el-button @click="replyVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReply">回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCustomerServiceStore } from '@/stores/customer-service'
import { ElMessage } from 'element-plus'

const csStore = useCustomerServiceStore()
const typeMap = { delivery: '配送', quality: '质量', service: '服务' }
const priorityMap = { high: '高', medium: '中', low: '低' }
const statusMap = { pending: { label: '待受理', type: 'info' }, accepted: { label: '已受理', type: '' }, processing: { label: '处理中', type: 'warning' }, closed: { label: '已关闭', type: 'success' } }

const queryForm = reactive({ type: '', priority: '', status: '', page: 1, pageSize: 20 })
const detailVisible = ref(false)
const replyVisible = ref(false)
const replyContent = ref('')
const replyId = ref('')
const currentComplaint = ref(null)

const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const fetchData = () => csStore.fetchComplaints(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { type: '', priority: '', status: '', page: 1, pageSize: 20 }); fetchData() }

const showDetail = async (row) => {
  await csStore.fetchComplaintDetail(row.id)
  currentComplaint.value = csStore.complaintDetail
  detailVisible.value = true
}

const handleAccept = async (id) => {
  await csStore.acceptComplaint(id)
  ElMessage.success('受理成功')
  fetchData()
}

const handleProcess = async (id) => {
  await csStore.processComplaint(id)
  ElMessage.success('开始处理')
  fetchData()
}

const showReply = (row) => {
  replyId.value = row.id
  replyContent.value = ''
  replyVisible.value = true
}

const handleReply = async () => {
  await csStore.replyComplaint(replyId.value, { content: replyContent.value })
  ElMessage.success('回复成功')
  replyVisible.value = false
  fetchData()
}

const handleClose = async (id) => {
  await csStore.closeComplaint(id)
  ElMessage.success('客诉已关闭')
  fetchData()
}

onMounted(() => fetchData())
</script>