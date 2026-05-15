<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="姓名"><el-input v-model="queryForm.name" placeholder="员工姓名" clearable /></el-form-item>
        <el-form-item label="部门">
          <el-select v-model="queryForm.department" placeholder="全部" clearable>
            <el-option label="销售部" value="销售部" />
            <el-option label="仓储部" value="仓储部" />
            <el-option label="客服部" value="客服部" />
            <el-option label="采购部" value="采购部" />
            <el-option label="财务部" value="财务部" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="在职" value="active" />
            <el-option label="离职" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="success" @click="showAddDialog = true">录入员工</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="hrStore.employees" v-loading="hrStore.loading" stripe border>
        <el-table-column prop="employeeNo" label="工号" width="100" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="departmentName" label="部门" width="100" />
        <el-table-column prop="position" label="职位" width="120" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="160" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">{{ row.status === 'active' ? '在职' : '离职' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hireDate" label="入职日期" width="110" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
            <el-button type="warning" link size="small" @click="showEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="hrStore.employeeTotal" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @current-change="fetchData" @size-change="fetchData" />
    </el-card>
    <el-dialog v-model="showAddDialog" title="录入员工" width="500px">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item label="姓名" prop="name"><el-input v-model="addForm.name" /></el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-select v-model="addForm.departmentId" placeholder="请选择">
            <el-option label="销售部" value="dept-001" />
            <el-option label="仓储部" value="dept-002" />
            <el-option label="客服部" value="dept-005" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="position"><el-input v-model="addForm.position" /></el-form-item>
        <el-form-item label="电话" prop="phone"><el-input v-model="addForm.phone" /></el-form-item>
        <el-form-item label="邮箱" prop="email"><el-input v-model="addForm.email" /></el-form-item>
        <el-form-item label="入职日期" prop="hireDate"><el-date-picker v-model="addForm.hireDate" type="date" value-format="YYYY-MM-DD" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleAdd">提交</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showEditDialog" title="编辑员工" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="姓名"><el-input v-model="editForm.name" /></el-form-item>
        <el-form-item label="职位"><el-input v-model="editForm.position" /></el-form-item>
        <el-form-item label="电话"><el-input v-model="editForm.phone" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="editForm.email" /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status">
            <el-option label="在职" value="active" />
            <el-option label="离职" value="inactive" />
          </el-select>
        </el-form-item>
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
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const addFormRef = ref(null)
const submitting = ref(false)

const queryForm = reactive({ name: '', department: '', status: '', page: 1, pageSize: 20 })

const addForm = reactive({ name: '', departmentId: '', position: '', phone: '', email: '', hireDate: '' })
const addRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
  hireDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }]
}

const editForm = reactive({ id: '', name: '', position: '', phone: '', email: '', status: '' })

const fetchData = () => hrStore.fetchEmployees(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { name: '', department: '', status: '', page: 1, pageSize: 20 }); fetchData() }

const showDetail = (row) => ElMessage.info(`员工详情: ${row.name}`)
const showEdit = (row) => {
  Object.assign(editForm, { id: row.id, name: row.name, position: row.position, phone: row.phone, email: row.email, status: row.status })
  showEditDialog.value = true
}

const handleAdd = async () => {
  const valid = await addFormRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await hrStore.createEmployee(addForm)
    ElMessage.success('录入成功')
    showAddDialog.value = false
    fetchData()
  } finally {
    submitting.value = false
  }
}

const handleEdit = async () => {
  await hrStore.updateEmployee(editForm.id, editForm)
  ElMessage.success('编辑成功')
  showEditDialog.value = false
  fetchData()
}

onMounted(() => fetchData())
</script>