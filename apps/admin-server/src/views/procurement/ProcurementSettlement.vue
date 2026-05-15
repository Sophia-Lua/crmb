<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="应付账款" name="payable">
        <el-card>
          <el-table :data="procStore.payableAccounts" v-loading="procStore.loading" stripe border>
            <el-table-column prop="supplierName" label="供应商" min-width="120" />
            <el-table-column prop="totalAmount" label="应付金额" width="100" />
            <el-table-column prop="paidAmount" label="已付金额" width="100" />
            <el-table-column prop="unpaidAmount" label="未付金额" width="100" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }"><el-tag size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="对账管理" name="reconciliation">
        <el-card>
          <el-button type="primary" style="margin-bottom: 16px" @click="handleGenerate">生成对账单</el-button>
          <el-empty description="暂无对账数据" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="付款管理" name="payment">
        <el-card>
          <el-button type="primary" style="margin-bottom: 16px" @click="showPayDialog = true">创建付款申请</el-button>
          <el-empty description="暂无付款数据" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="showPayDialog" title="创建付款申请" width="500px">
      <el-form :model="payForm" label-width="80px">
        <el-form-item label="供应商"><el-input v-model="payForm.supplierId" placeholder="供应商ID" /></el-form-item>
        <el-form-item label="金额"><el-input-number v-model="payForm.amount" :precision="2" :min="0" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="payForm.remark" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPayDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreatePayment">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useProcurementStore } from '@/stores/procurement'
import { ElMessage } from 'element-plus'

const procStore = useProcurementStore()
const activeTab = ref('payable')
const showPayDialog = ref(false)
const payForm = reactive({ supplierId: '', amount: 0, remark: '' })

const handleGenerate = async () => {
  await procStore.generateReconciliation({})
  ElMessage.success('对账单生成成功')
}

const handleCreatePayment = async () => {
  await procStore.createPaymentRequest(payForm)
  ElMessage.success('付款申请创建成功')
  showPayDialog.value = false
}

onMounted(() => procStore.fetchPayableAccounts())
</script>