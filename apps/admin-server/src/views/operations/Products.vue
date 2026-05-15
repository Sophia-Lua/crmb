<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="商品名"><el-input v-model="queryForm.name" placeholder="商品名称" clearable /></el-form-item>
        <el-form-item label="分类">
          <el-select v-model="queryForm.categoryId" placeholder="全部" clearable>
            <el-option v-for="cat in opsStore.categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="在售" value="on_sale" />
            <el-option label="下架" value="off_sale" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="success" @click="showAddDialog = true">新增商品</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="opsStore.products" v-loading="opsStore.loading" stripe border>
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="name" label="商品名称" min-width="140" />
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column prop="price" label="价格" width="80">
          <template #default="{ row }">{{ row.price?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="vipPrice" label="VIP价" width="80">
          <template #default="{ row }">{{ row.vipPrice?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="salesCount" label="销量" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'on_sale' ? 'success' : 'danger'" size="small">{{ row.status === 'on_sale' ? '在售' : '下架' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showEdit(row)">编辑</el-button>
            <el-button :type="row.status === 'on_sale' ? 'warning' : 'success'" link size="small" @click="handleToggleStatus(row)">
              {{ row.status === 'on_sale' ? '下架' : '上架' }}
            </el-button>
            <el-button link size="small" @click="handleSyncStock(row.id)">同步库存</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="opsStore.productTotal" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @current-change="fetchData" @size-change="fetchData" />
    </el-card>
    <el-dialog v-model="showAddDialog" title="新增商品" width="600px">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item label="SKU" prop="sku"><el-input v-model="addForm.sku" /></el-form-item>
        <el-form-item label="名称" prop="name"><el-input v-model="addForm.name" /></el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="addForm.categoryId" placeholder="请选择">
            <el-option v-for="cat in opsStore.categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price"><el-input-number v-model="addForm.price" :precision="2" :min="0" /></el-form-item>
        <el-form-item label="VIP价"><el-input-number v-model="addForm.vipPrice" :precision="2" :min="0" /></el-form-item>
        <el-form-item label="库存"><el-input-number v-model="addForm.stock" :min="0" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="addForm.description" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">提交</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showEditDialog" title="编辑商品" width="600px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="名称"><el-input v-model="editForm.name" /></el-form-item>
        <el-form-item label="价格"><el-input-number v-model="editForm.price" :precision="2" :min="0" /></el-form-item>
        <el-form-item label="VIP价"><el-input-number v-model="editForm.vipPrice" :precision="2" :min="0" /></el-form-item>
        <el-form-item label="库存"><el-input-number v-model="editForm.stock" :min="0" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="editForm.description" type="textarea" :rows="3" /></el-form-item>
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
import { useOperationsStore } from '@/stores/operations'
import { ElMessage, ElMessageBox } from 'element-plus'

const opsStore = useOperationsStore()
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const addFormRef = ref(null)

const queryForm = reactive({ name: '', categoryId: '', status: '', page: 1, pageSize: 20 })
const addForm = reactive({ sku: '', name: '', categoryId: '', price: 0, vipPrice: 0, stock: 0, description: '' })
const addRules = {
  sku: [{ required: true, message: '请输入SKU', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'change' }]
}
const editForm = reactive({ id: '', name: '', price: 0, vipPrice: 0, stock: 0, description: '' })

const fetchData = () => opsStore.fetchProducts(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { name: '', categoryId: '', status: '', page: 1, pageSize: 20 }); fetchData() }

const showEdit = (row) => {
  Object.assign(editForm, { id: row.id, name: row.name, price: row.price, vipPrice: row.vipPrice, stock: row.stock, description: row.description })
  showEditDialog.value = true
}

const handleAdd = async () => {
  const valid = await addFormRef.value.validate().catch(() => false)
  if (!valid) return
  await opsStore.createProduct(addForm)
  ElMessage.success('新增成功')
  showAddDialog.value = false
  fetchData()
}

const handleEdit = async () => {
  await opsStore.updateProduct(editForm.id, editForm)
  ElMessage.success('编辑成功')
  showEditDialog.value = false
  fetchData()
}

const handleToggleStatus = async (row) => {
  const newStatus = row.status === 'on_sale' ? 'off_sale' : 'on_sale'
  await opsStore.updateProductStatus(row.id, { status: newStatus })
  ElMessage.success('状态更新成功')
  fetchData()
}

const handleSyncStock = async (id) => {
  await opsStore.syncStock(id)
  ElMessage.success('库存同步成功')
  fetchData()
}

onMounted(() => {
  fetchData()
  opsStore.fetchCategories()
})
</script>