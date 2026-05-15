<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="银行对账" name="bank">
        <el-card>
          <el-button type="primary" style="margin-bottom: 16px" @click="showImportDialog = true">导入银行流水</el-button>
          <el-empty description="暂无银行对账数据" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="供应商对账" name="supplier">
        <el-card>
          <el-table :data="finStore.reconciliations" v-loading="finStore.loading" stripe border>
            <el-table-column prop="reconciliationNo" label="对账编号" width="150" />
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }">{{ row.type === 'supplier' ? '供应商' : row.type === 'customer' ? '客户' : '银行' }}</template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="总金额" width="100">
              <template #default="{ row }">{{ row.totalAmount?.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="matchedAmount" label="已匹配" width="100">
              <template #default="{ row }">{{ row.matchedAmount?.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }"><el-tag size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button v-if="row.status !== 'completed'" type="success" link size="small" @click="handleConfirm(row.id)">确认</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="finStore.reconciliationTotal" layout="total, prev, pager, next" @current-change="fetchData" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="客户对账" name="customer">
        <el-card>
          <el-empty description="暂无客户对账数据" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="showImportDialog" title="导入银行流水" width="400px">
      <el-upload drag action="/api/files/upload" :limit="1">
        <el-icon :size="40"><UploadFilled /></el-icon>
        <div>将文件拖拽到此处，或点击上传</div>
      </el-upload>
      <template #footer>
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button type="primary" @click="handleImport">导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const finStore = useFinanceStore()
const activeTab = ref('supplier')
const showImportDialog = ref(false)
const queryForm = reactive({ page: 1, pageSize: 20 })

const fetchData = () => finStore.fetchReconciliations(queryForm)

const handleConfirm = async (id) => {
  await finStore.confirmReconciliation(id)
  ElMessage.success('对账确认成功')
  fetchData()
}

const handleImport = () => {
  ElMessage.success('银行流水导入成功')
  showImportDialog.value = false
}

onMounted(() => fetchData())
</script>