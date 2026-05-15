<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="资产负债表" name="balance">
        <el-card>
          <el-button type="primary" style="margin-bottom: 16px" @click="handleGenerate('balance')">生成报表</el-button>
          <el-empty description="暂无资产负债表数据" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="利润表" name="income">
        <el-card>
          <el-button type="primary" style="margin-bottom: 16px" @click="handleGenerate('income')">生成报表</el-button>
          <el-empty description="暂无利润表数据" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="现金流量表" name="cashflow">
        <el-card>
          <el-button type="primary" style="margin-bottom: 16px" @click="handleGenerate('cashflow')">生成报表</el-button>
          <el-empty description="暂无现金流量表数据" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="统计分析" name="trend">
        <el-card>
          <el-row :gutter="20" style="margin-bottom: 16px">
            <el-col :span="8"><el-statistic title="收入趋势" :value="0" /></el-col>
            <el-col :span="8"><el-statistic title="支出趋势" :value="0" /></el-col>
            <el-col :span="8"><el-statistic title="利润率" :value="0" suffix="%" /></el-col>
          </el-row>
          <el-button type="primary" @click="fetchTrends">刷新数据</el-button>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="报表导出" name="export">
        <el-card>
          <el-table :data="finStore.reports" stripe border>
            <el-table-column prop="reportNo" label="报表编号" width="140" />
            <el-table-column prop="type" label="类型" width="120">
              <template #default="{ row }">{{ reportTypeMap[row.type] || row.type }}</template>
            </el-table-column>
            <el-table-column prop="period" label="周期" width="80" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }"><el-tag size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="170">
              <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button type="success" link size="small" @click="handleExportExcel(row.id)">Excel</el-button>
                <el-button type="warning" link size="small" @click="handleExportPDF(row.id)">PDF</el-button>
                <el-button link size="small" @click="handlePrint(row.id)">打印</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { ElMessage } from 'element-plus'

const finStore = useFinanceStore()
const activeTab = ref('balance')
const reportTypeMap = { income_statement: '利润表', balance_sheet: '资产负债表', cash_flow: '现金流量表' }
const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const handleGenerate = async (type) => {
  const typeMap = { balance: 'balance_sheet', income: 'income_statement', cashflow: 'cash_flow' }
  await finStore[`generate${type === 'balance' ? 'BalanceSheet' : type === 'income' ? 'IncomeStatement' : 'CashFlowStatement'}`]({})
  ElMessage.success('报表生成成功')
}

const fetchTrends = async () => {
  await finStore.fetchIncomeTrend()
  await finStore.fetchExpenseTrend()
  await finStore.fetchProfitRate()
}

const handleExportExcel = async (id) => {
  await finStore.exportExcel(id)
  ElMessage.success('Excel导出成功')
}

const handleExportPDF = async (id) => {
  await finStore.exportPDF(id)
  ElMessage.success('PDF导出成功')
}

const handlePrint = async (id) => {
  await finStore.printReport(id)
  ElMessage.success('打印任务已提交')
}

onMounted(() => finStore.fetchTransactions({ page: 1, pageSize: 20 }))
</script>