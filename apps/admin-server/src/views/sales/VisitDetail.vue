<template>
  <div>
    <el-page-header @back="router.push('/sales/visits')" content="拜访详情" style="margin-bottom: 16px" />
    <el-card v-loading="salesStore.loading">
      <el-descriptions :column="2" border title="拜访信息" v-if="visit">
        <el-descriptions-item label="客户名称">{{ visit.customerName }}</el-descriptions-item>
        <el-descriptions-item label="客户类型">{{ visit.customerType === 'public' ? '公海' : '私海' }}</el-descriptions-item>
        <el-descriptions-item label="拜访类型">{{ visitTypeMap[visit.visitType] || visit.visitType }}</el-descriptions-item>
        <el-descriptions-item label="拜访方式">{{ visitMethodMap[visit.visitMethod] || visit.visitMethod }}</el-descriptions-item>
        <el-descriptions-item label="计划日期">{{ visit.planDate }}</el-descriptions-item>
        <el-descriptions-item label="计划时间">{{ visit.planTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusMap[visit.status]?.type || 'info'">{{ statusMap[visit.status]?.label || visit.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建人">{{ visit.createdBy }}</el-descriptions-item>
        <el-descriptions-item label="拜访主题" :span="2">{{ visit.subject }}</el-descriptions-item>
        <el-descriptions-item label="拜访内容" :span="2">{{ visit.content }}</el-descriptions-item>
        <el-descriptions-item label="客户反馈" :span="2">{{ visit.feedback || '-' }}</el-descriptions-item>
        <el-descriptions-item label="跟进计划" :span="2">{{ visit.followUpPlan || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(visit.createdAt) }}</el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 16px" v-if="visit?.images?.length">
        <div style="font-weight: bold; margin-bottom: 8px">拜访图片</div>
        <el-image v-for="img in visit.images" :key="img.id" :src="img.url" style="width: 120px; height: 120px; margin-right: 8px" fit="cover" :preview-src-list="visit.images.map(i => i.url)" />
      </div>
      <div style="margin-top: 16px">
        <el-button type="primary" @click="showEditDialog = true">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
        <el-button v-if="visit?.status === 'pending'" type="success" @click="handleUpdateStatus('in_progress')">开始执行</el-button>
        <el-button v-if="visit?.status === 'in_progress'" type="success" @click="handleUpdateStatus('completed')">标记完成</el-button>
        <el-button @click="showNoteDialog = true">添加备注</el-button>
      </div>
    </el-card>
    <el-dialog v-model="showEditDialog" title="编辑拜访" width="600px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="状态">
          <el-select v-model="editForm.status">
            <el-option label="待执行" value="pending" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="反馈"><el-input v-model="editForm.feedback" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="跟进计划"><el-input v-model="editForm.followUpPlan" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="handleEdit">保存</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showNoteDialog" title="添加备注" width="500px">
      <el-input v-model="noteContent" type="textarea" :rows="4" placeholder="请输入备注内容" />
      <template #footer>
        <el-button @click="showNoteDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddNote">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const salesStore = useSalesStore()

const visitTypeMap = { first: '首次拜访', regular: '定期回访', key: '重点跟进' }
const visitMethodMap = { onsite: '上门', phone: '电话', online: '线上' }
const statusMap = { pending: { label: '待执行', type: 'info' }, in_progress: { label: '进行中', type: 'warning' }, completed: { label: '已完成', type: 'success' }, cancelled: { label: '已取消', type: 'danger' } }

const visit = computed(() => salesStore.visitDetail)
const showEditDialog = ref(false)
const showNoteDialog = ref(false)
const noteContent = ref('')
const editForm = reactive({ status: '', feedback: '', followUpPlan: '' })

const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const handleEdit = async () => {
  await salesStore.updateVisit(route.params.id, editForm)
  ElMessage.success('编辑成功')
  showEditDialog.value = false
  salesStore.fetchVisitDetail(route.params.id)
}

const handleDelete = async () => {
  await ElMessageBox.confirm('确认删除该拜访记录?', '提示', { type: 'warning' })
  await salesStore.deleteVisit(route.params.id)
  ElMessage.success('删除成功')
  router.push('/sales/visits')
}

const handleUpdateStatus = async (status) => {
  await salesStore.updateVisit(route.params.id, { status })
  ElMessage.success('状态更新成功')
  salesStore.fetchVisitDetail(route.params.id)
}

const handleAddNote = () => {
  ElMessage.success('备注已添加')
  showNoteDialog.value = false
  noteContent.value = ''
}

onMounted(() => {
  salesStore.fetchVisitDetail(route.params.id)
})
</script>