<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="收支管理" name="transactions">
        <el-card>
          <el-form :model="queryForm" inline style="margin-bottom: 16px">
            <el-form-item label="类型">
              <el-select v-model="queryForm.type" placeholder="全部" clearable>
                <el-option label="收入" value="income" />
                <el-option label="支出" value="expense" />
                <el-option label="转账" value="transfer" />
              </el-select>
            </el-form-item>
            <el-form-item label="分类">
              <el-select v-model="queryForm.category" placeholder="全部" clearable>
                <el-option label="销售收入" value="sales" />
                <el-option label="采购支出" value="procurement" />
                <el-option label="运营成本" value="operations" />
              </el-select>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker v-model="queryForm.dateRange" type="daterange" range-separator="-" start-placeholder="开始" end-placeholder="结束" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="success" @click="showAddDialog = true">新增记录</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="20" style="margin-bottom: 16px" v-if="finStore.transactionSummary">
            <el-col :span="6"><el-statistic title="总收入" :value="finStore.transactionSummary.totalIncome || 0" :precision="2" /></el-col>
            <el-col :span="6"><el-statistic title="总支出" :value="finStore.transactionSummary.totalExpense || 0" :precision="2" /></el-col>
            <el-col :span="6"><el-statistic title="净利润" :value="finStore.transactionSummary.netProfit || 0" :precision="2" /></el-col>
          </el-row>
          <el-table :data="finStore.transactions" v-loading="finStore.loading" stripe border>
            <el-table-column prop="transactionNo" label="交易编号" width="150" />
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }">
                <el-tag :type="row.type === 'income' ? 'success' : row.type === 'expense' ? 'danger' : 'info'" size="small">{{ typeMap[row.type] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="100">
              <template #default="{ row }">{{ row.amount?.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="category" label="分类" width="100">
              <template #default="{ row }">{{ categoryMap[row.category] || row.category }}</template>
            </el-table-column>
            <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }"><el-tag size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="170">
              <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="showEdit(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="finStore.transactionTotal" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @current-change="fetchData" @size-change="fetchData" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="成本核算" name="cost">
        <el-card>
          <el-row :gutter="20">
            <el-col :span="8"><el-statistic title="运营成本" :value="0" :precision="2" /></el-col>
            <el-col :span="8"><el-statistic title="人工成本" :value="0" :precision="2" /></el-col>
            <el-col :span="8"><el-statistic title="物流成本" :value="0" :precision="2" /></el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="showAddDialog" title="新增交易记录" width="500px">
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="addForm.type">
            <el-option label="收入" value="income" />
            <el-option label="支出" value="expense" />
            <el-option label="转账" value="transfer" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount"><el-input-number v-model="addForm.amount" :precision="2" :min="0" /></el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="addForm.category">
            <el-option label="销售收入" value="sales" />
            <el-option label="采购支出" value="procurement" />
            <el-option label="运营成本" value="operations" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述"><el-input v-model="addForm.description" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">提交</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showEditDialog" title="编辑交易" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="金额"><el-input-number v-model="editForm.amount" :precision="2" :min="0" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="editForm.description" type="textarea" :rows="2" /></el-form-item>
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
import { useFinanceStore } from '@/stores/finance'
import { ElMessage } from 'element-plus'

const finStore = useFinanceStore()
const activeTab = ref('transactions')
const typeMap = { income: '收入', expense: '支出', transfer: '转账' }
const categoryMap = { sales: '销售收入', procurement: '采购支出', operations: '运营成本' }

const showAddDialog = ref(false)
const showEditDialog = ref(false)
const addFormRef = ref(null)

const queryForm = reactive({ type: '', category: '', dateRange: null, page: 1, pageSize: 20 })
const addForm = reactive({ type: '', amount: 0, category: '', description: '' })
const addRules = {
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'change' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}
const editForm = reactive({ id: '', amount: 0, description: '' })
const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const fetchData = () => finStore.fetchTransactions(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { type: '', category: '', dateRange: null, page: 1, pageSize: 20 }); fetchData() }

const showEdit = (row) => {
  Object.assign(editForm, { id: row.id, amount: row.amount, description: row.description })
  showEditDialog.value = true
}

const handleAdd = async () => {
  const valid = await addFormRef.value.validate().catch(() => false)
  if (!valid) return
  await finStore.createTransaction(addForm)
  ElMessage.success('新增成功')
  showAddDialog.value = false
  fetchData()
}

const handleEdit = async () => {
  await finStore.updateTransaction(editForm.id, editForm)
  ElMessage.success('编辑成功')
  showEditDialog.value = false
  fetchData()
}

onMounted(() => {
  fetchData()
  finStore.fetchTransactionSummary()
})
</script>