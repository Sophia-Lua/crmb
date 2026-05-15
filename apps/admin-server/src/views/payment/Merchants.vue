<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="商家名"><el-input v-model="queryForm.name" clearable /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="success" @click="showAddDialog = true">新增商家</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="payStore.merchants" v-loading="payStore.loading" stripe border>
        <el-table-column prop="name" label="商家名称" min-width="140" />
        <el-table-column prop="contactName" label="联系人" width="100" />
        <el-table-column prop="contactPhone" label="联系电话" width="120" />
        <el-table-column prop="feeRate" label="费率" width="80">
          <template #default="{ row }">{{ row.feeRate }}%</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
            <el-button type="warning" link size="small" @click="showFeeRate(row)">设置费率</el-button>
            <el-button link size="small" @click="showSettlement(row)">结算账户</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="payStore.merchantTotal" layout="total, prev, pager, next" @current-change="fetchData" />
    </el-card>
    <el-dialog v-model="showAddDialog" title="新增商家" width="500px">
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="名称"><el-input v-model="addForm.name" /></el-form-item>
        <el-form-item label="联系人"><el-input v-model="addForm.contactName" /></el-form-item>
        <el-form-item label="电话"><el-input v-model="addForm.contactPhone" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">提交</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="feeRateVisible" title="设置费率" width="400px">
      <el-form :model="feeRateForm" label-width="80px">
        <el-form-item label="费率"><el-input-number v-model="feeRateForm.feeRate" :precision="2" :min="0" :max="100" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="feeRateVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSetFeeRate">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { usePaymentStore } from '@/stores/payment'
import { ElMessage } from 'element-plus'

const payStore = usePaymentStore()
const showAddDialog = ref(false)
const feeRateVisible = ref(false)
const addForm = reactive({ name: '', contactName: '', contactPhone: '' })
const feeRateForm = reactive({ id: '', feeRate: 0 })
const queryForm = reactive({ name: '', page: 1, pageSize: 20 })

const fetchData = () => payStore.fetchMerchants(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }

const showDetail = async (row) => {
  await payStore.fetchMerchantDetail(row.id)
  ElMessage.info('查看详情')
}

const showFeeRate = (row) => {
  feeRateForm.id = row.id
  feeRateForm.feeRate = row.feeRate || 0
  feeRateVisible.value = true
}

const showSettlement = (row) => ElMessage.info('结算账户管理')

const handleAdd = async () => {
  await payStore.createMerchant(addForm)
  ElMessage.success('新增成功')
  showAddDialog.value = false
  fetchData()
}

const handleSetFeeRate = async () => {
  await payStore.setFeeRate(feeRateForm.id, { feeRate: feeRateForm.feeRate })
  ElMessage.success('费率设置成功')
  feeRateVisible.value = false
  fetchData()
}

onMounted(() => fetchData())
</script>