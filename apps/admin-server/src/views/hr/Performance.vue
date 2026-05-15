<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="员工名"><el-input v-model="queryForm.employeeName" placeholder="员工姓名" clearable /></el-form-item>
        <el-form-item label="考核周期">
          <el-select v-model="queryForm.period" placeholder="全部" clearable>
            <el-option label="2025-Q1" value="2025-Q1" />
            <el-option label="2025-Q2" value="2025-Q2" />
            <el-option label="2024-Q4" value="2024-Q4" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="待提交" value="draft" />
            <el-option label="已提交" value="submitted" />
            <el-option label="已审批" value="approved" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="success" @click="showAddDialog = true">新增考核</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="hrStore.performance" v-loading="hrStore.loading" stripe border>
        <el-table-column prop="employeeName" label="员工姓名" width="120" />
        <el-table-column prop="period" label="考核周期" width="100" />
        <el-table-column prop="score" label="评分" width="80">
          <template #default="{ row }">
            <el-tag :type="row.score >= 4.5 ? 'success' : row.score >= 3 ? '' : 'warning'" size="small">{{ row.score }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comments" label="评语" min-width="200" show-overflow-tooltip />
        <el-table-column prop="reviewerName" label="考核人" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'submitted' ? '' : 'info'" size="small">{{ perfStatusMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showEditPerf(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="hrStore.performanceTotal" layout="total, prev, pager, next" @current-change="fetchData" />
    </el-card>
    <el-dialog v-model="showAddDialog" title="新增考核" width="500px">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item label="员工" prop="employeeId">
          <el-select v-model="addForm.employeeId" placeholder="请选择">
            <el-option label="销售代表张" value="emp-001" />
            <el-option label="仓库管理员李" value="emp-002" />
            <el-option label="客服专员王" value="emp-003" />
          </el-select>
        </el-form-item>
        <el-form-item label="周期" prop="period"><el-input v-model="addForm.period" placeholder="如 2025-Q2" /></el-form-item>
        <el-form-item label="评分" prop="score"><el-input-number v-model="addForm.score" :min="1" :max="5" :precision="1" /></el-form-item>
        <el-form-item label="评语"><el-input v-model="addForm.comments" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">提交</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showEditDialog" title="编辑考核" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="评分"><el-input-number v-model="editForm.score" :min="1" :max="5" :precision="1" /></el-form-item>
        <el-form-item label="评语"><el-input v-model="editForm.comments" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="handleEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useHrStore } from '@/stores/hr'
import { ElMessage } from 'element-plus'

const hrStore = useHrStore()
const perfStatusMap = { draft: '待提交', submitted: '已提交', approved: '已审批' }
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const addFormRef = ref(null)

const queryForm = reactive({ employeeName: '', period: '', status: '', page: 1, pageSize: 20 })
const addForm = reactive({ employeeId: '', period: '', score: 3, comments: '' })
const addRules = {
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  period: [{ required: true, message: '请输入考核周期', trigger: 'blur' }],
  score: [{ required: true, message: '请输入评分', trigger: 'change' }]
}
const editForm = reactive({ id: '', score: 3, comments: '' })

const fetchData = () => hrStore.fetchPerformance(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { employeeName: '', period: '', status: '', page: 1, pageSize: 20 }); fetchData() }

const showEditPerf = (row) => {
  Object.assign(editForm, { id: row.id, score: row.score, comments: row.comments })
  showEditDialog.value = true
}

const handleAdd = async () => {
  const valid = await addFormRef.value.validate().catch(() => false)
  if (!valid) return
  await hrStore.createPerformance(addForm)
  ElMessage.success('新增成功')
  showAddDialog.value = false
  fetchData()
}

const handleEdit = async () => {
  await hrStore.updatePerformance(editForm.id, editForm)
  ElMessage.success('编辑成功')
  showEditDialog.value = false
  fetchData()
}

onMounted(() => fetchData())
</script>