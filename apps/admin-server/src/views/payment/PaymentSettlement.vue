<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="结算周期" name="config">
        <el-card>
          <el-descriptions :column="2" border v-if="payStore.settlementConfig">
            <el-descriptions-item label="结算周期">{{ payStore.settlementConfig.period }}</el-descriptions-item>
            <el-descriptions-item label="最低结算金额">{{ payStore.settlementConfig.minAmount }}</el-descriptions-item>
            <el-descriptions-item label="结算方式">{{ payStore.settlementConfig.method }}</el-descriptions-item>
            <el-descriptions-item label="自动结算">{{ payStore.settlementConfig.auto ? '开启' : '关闭' }}</el-descriptions-item>
          </el-descriptions>
          <el-empty v-else description="暂无结算配置" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="结算报表" name="reports">
        <el-card>
          <el-table :data="payStore.settlementReports" stripe border>
            <el-table-column prop="period" label="结算周期" width="120" />
            <el-table-column prop="merchantName" label="商家" width="120" />
            <el-table-column prop="amount" label="结算金额" width="100" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }"><el-tag size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="执行结算" name="execute">
        <el-card>
          <el-button type="primary" @click="handleExecute">执行结算</el-button>
          <el-empty description="暂无待结算数据" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePaymentStore } from '@/stores/payment'
import { ElMessage } from 'element-plus'

const payStore = usePaymentStore()
const activeTab = ref('config')

const handleExecute = async () => {
  await payStore.executeSettlement({})
  ElMessage.success('结算执行成功')
}

onMounted(() => {
  payStore.fetchSettlementConfig()
  payStore.fetchSettlementReports()
})
</script>