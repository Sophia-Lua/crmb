<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="线路名"><el-input v-model="queryForm.name" clearable /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="success" @click="showAddDialog = true">新增线路</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="ddStore.routes" v-loading="ddStore.loading" stripe border>
        <el-table-column prop="name" label="线路名称" min-width="140" />
        <el-table-column prop="stationCount" label="站点数" width="80" />
        <el-table-column prop="distance" label="总里程" width="80" />
        <el-table-column prop="estimatedTime" label="预计耗时" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showEdit(row)">编辑</el-button>
            <el-button type="success" link size="small" @click="handleOptimize(row.id)">优化</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="ddStore.routeTotal" layout="total, prev, pager, next" @current-change="fetchData" />
    </el-card>
    <el-dialog v-model="showAddDialog" title="新增线路" width="500px">
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="线路名称"><el-input v-model="addForm.name" /></el-form-item>
        <el-form-item label="总里程"><el-input-number v-model="addForm.distance" :min="0" /></el-form-item>
        <el-form-item label="预计耗时"><el-input v-model="addForm.estimatedTime" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showEditDialog" title="编辑线路" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="线路名称"><el-input v-model="editForm.name" /></el-form-item>
        <el-form-item label="总里程"><el-input-number v-model="editForm.distance" :min="0" /></el-form-item>
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
import { useDirectDeliveryStore } from '@/stores/direct-delivery'
import { ElMessage, ElMessageBox } from 'element-plus'

const ddStore = useDirectDeliveryStore()
const showAddDialog = ref(false)
const showEditDialog = ref(false)

const queryForm = reactive({ name: '', page: 1, pageSize: 20 })
const addForm = reactive({ name: '', distance: 0, estimatedTime: '' })
const editForm = reactive({ id: '', name: '', distance: 0 })

const fetchData = () => ddStore.fetchRoutes(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }

const showEdit = (row) => {
  Object.assign(editForm, { id: row.id, name: row.name, distance: row.distance })
  showEditDialog.value = true
}

const handleAdd = async () => {
  await ddStore.createRoute(addForm)
  ElMessage.success('线路创建成功')
  showAddDialog.value = false
  fetchData()
}

const handleEdit = async () => {
  await ddStore.updateRoute(editForm.id, editForm)
  ElMessage.success('编辑成功')
  showEditDialog.value = false
  fetchData()
}

const handleOptimize = async (id) => {
  await ddStore.optimizeRoute(id)
  ElMessage.success('线路优化完成')
  fetchData()
}

const handleDelete = async (id) => {
  await ElMessageBox.confirm('确认删除该线路?', '提示', { type: 'warning' })
  await ddStore.deleteRoute(id)
  ElMessage.success('删除成功')
  fetchData()
}

onMounted(() => fetchData())
</script>