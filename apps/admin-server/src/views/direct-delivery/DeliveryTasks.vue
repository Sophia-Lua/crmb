<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="配送员"><el-input v-model="queryForm.deliveryPerson" clearable /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="待分配" value="pending" />
            <el-option label="配送中" value="delivering" />
            <el-option label="已完成" value="completed" />
            <el-option label="异常" value="exception" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="success" @click="handleAutoAssign">自动分配</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="taskList" stripe border>
        <el-table-column prop="id" label="任务ID" width="100" />
        <el-table-column prop="routeName" label="线路" width="120" />
        <el-table-column prop="deliveryPerson" label="配送员" width="100" />
        <el-table-column prop="stationCount" label="站点数" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="taskStatusMap[row.status]?.type || 'info'" size="small">{{ taskStatusMap[row.status]?.label || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleAssign(row.id)">分配</el-button>
            <el-button v-if="row.status === 'delivering'" type="primary" link size="small" @click="handleTrack(row.id)">跟踪</el-button>
            <el-button v-if="row.status === 'exception'" type="warning" link size="small" @click="handleException(row.id)">处理异常</el-button>
            <el-button v-if="row.status === 'delivering'" type="success" link size="small" @click="handleConfirm(row.id)">确认完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="assignVisible" title="分配配送任务" width="400px">
      <el-form :model="assignForm" label-width="80px">
        <el-form-item label="配送员"><el-input v-model="assignForm.deliveryPersonId" placeholder="配送员ID" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDoAssign">分配</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useDirectDeliveryStore } from '@/stores/direct-delivery'
import { ElMessage } from 'element-plus'

const ddStore = useDirectDeliveryStore()
const taskStatusMap = { pending: { label: '待分配', type: 'info' }, delivering: { label: '配送中', type: 'warning' }, completed: { label: '已完成', type: 'success' }, exception: { label: '异常', type: 'danger' } }
const assignVisible = ref(false)
const assignId = ref('')
const assignForm = reactive({ deliveryPersonId: '' })
const taskList = ref([])
const queryForm = reactive({ deliveryPerson: '', status: '', page: 1, pageSize: 20 })

const handleQuery = () => {}
const handleAutoAssign = async () => {
  await ddStore.autoAssign()
  ElMessage.success('自动分配完成')
}

const handleAssign = (id) => {
  assignId.value = id
  assignForm.deliveryPersonId = ''
  assignVisible.value = true
}

const handleDoAssign = async () => {
  await ddStore.assignTask({ taskId: assignId.value, deliveryPersonId: assignForm.deliveryPersonId })
  ElMessage.success('分配成功')
  assignVisible.value = false
}

const handleTrack = async (id) => {
  await ddStore.trackDeliveryStatus(id)
  ElMessage.info('配送状态已获取')
}

const handleException = async (id) => {
  await ddStore.handleException(id, { remark: '异常处理' })
  ElMessage.success('异常已处理')
}

const handleConfirm = async (id) => {
  await ddStore.confirmDelivery(id)
  ElMessage.success('配送确认完成')
}

onMounted(() => {})
</script>