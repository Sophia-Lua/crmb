<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="供应商名"><el-input v-model="queryForm.name" placeholder="供应商名称" clearable /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已冻结" value="frozen" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="success" @click="showAddDialog = true">新增供应商</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="procStore.suppliers" v-loading="procStore.loading" stripe border>
        <el-table-column prop="name" label="供应商名称" min-width="140" />
        <el-table-column prop="contactName" label="联系人" width="100" />
        <el-table-column prop="contactPhone" label="联系电话" width="120" />
        <el-table-column prop="mainProducts" label="主营产品" min-width="160" show-overflow-tooltip />
        <el-table-column prop="rating" label="评级" width="80">
          <template #default="{ row }"><el-rate v-model="row.rating" disabled size="small" /></template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'" size="small">{{ supplierStatusMap[row.status] || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleAudit(row.id)">审核</el-button>
            <el-button type="warning" link size="small" @click="showEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="procStore.supplierTotal" layout="total, prev, pager, next" @current-change="fetchData" />
    </el-card>
    <el-dialog v-model="showAddDialog" title="新增供应商" width="500px">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item label="名称" prop="name"><el-input v-model="addForm.name" /></el-form-item>
        <el-form-item label="联系人" prop="contactName"><el-input v-model="addForm.contactName" /></el-form-item>
        <el-form-item label="电话" prop="contactPhone"><el-input v-model="addForm.contactPhone" /></el-form-item>
        <el-form-item label="主营产品"><el-input v-model="addForm.mainProducts" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">提交</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showEditDialog" title="编辑供应商" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="名称"><el-input v-model="editForm.name" /></el-form-item>
        <el-form-item label="联系人"><el-input v-model="editForm.contactName" /></el-form-item>
        <el-form-item label="电话"><el-input v-model="editForm.contactPhone" /></el-form-item>
        <el-form-item label="主营产品"><el-input v-model="editForm.mainProducts" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="handleEdit">保存</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="detailVisible" title="供应商详情" width="500px">
      <el-descriptions :column="2" border v-if="procStore.supplierDetail">
        <el-descriptions-item label="名称">{{ procStore.supplierDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ procStore.supplierDetail.contactName }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ procStore.supplierDetail.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="主营产品">{{ procStore.supplierDetail.mainProducts }}</el-descriptions-item>
        <el-descriptions-item label="评级">{{ procStore.supplierDetail.rating }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ supplierStatusMap[procStore.supplierDetail.status] }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useProcurementStore } from '@/stores/procurement'
import { ElMessage, ElMessageBox } from 'element-plus'

const procStore = useProcurementStore()
const supplierStatusMap = { pending: '待审核', approved: '已通过', frozen: '已冻结' }
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const detailVisible = ref(false)
const addFormRef = ref(null)

const queryForm = reactive({ name: '', status: '', page: 1, pageSize: 20 })
const addForm = reactive({ name: '', contactName: '', contactPhone: '', mainProducts: '' })
const addRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  contactName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入电话', trigger: 'blur' }]
}
const editForm = reactive({ id: '', name: '', contactName: '', contactPhone: '', mainProducts: '' })

const fetchData = () => procStore.fetchSuppliers(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { name: '', status: '', page: 1, pageSize: 20 }); fetchData() }

const showDetail = async (row) => {
  await procStore.fetchSupplierDetail(row.id)
  detailVisible.value = true
}

const handleAudit = async (id) => {
  await ElMessageBox.confirm('确认审核通过?', '提示', { type: 'success' })
  await procStore.auditSupplier(id, { status: 'approved' })
  ElMessage.success('审核通过')
  fetchData()
}

const showEdit = (row) => {
  Object.assign(editForm, { id: row.id, name: row.name, contactName: row.contactName, contactPhone: row.contactPhone, mainProducts: row.mainProducts })
  showEditDialog.value = true
}

const handleAdd = async () => {
  const valid = await addFormRef.value.validate().catch(() => false)
  if (!valid) return
  await procStore.createSupplier(addForm)
  ElMessage.success('新增成功')
  showAddDialog.value = false
  fetchData()
}

const handleEdit = async () => {
  await procStore.updateSupplier(editForm.id, editForm)
  ElMessage.success('编辑成功')
  showEditDialog.value = false
  fetchData()
}

onMounted(() => fetchData())
</script>