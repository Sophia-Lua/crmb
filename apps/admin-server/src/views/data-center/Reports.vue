<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="报表模板" name="templates">
        <el-card>
          <el-row :gutter="20">
            <el-col :span="6" v-for="tpl in templates" :key="tpl.id">
              <el-card shadow="hover" style="cursor: pointer; margin-bottom: 16px; text-align: center" @click="handleGenerate(tpl)">
                <el-icon :size="32" :color="tpl.color"><Document /></el-icon>
                <div style="margin-top: 8px">{{ tpl.name }}</div>
                <div style="font-size: 12px; color: #909399; margin-top: 4px">{{ tpl.description }}</div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="自定义报表" name="custom">
        <el-card>
          <el-form :model="customForm" label-width="80px" style="max-width: 600px">
            <el-form-item label="报表名称"><el-input v-model="customForm.name" /></el-form-item>
            <el-form-item label="报表类型">
              <el-select v-model="customForm.type">
                <el-option label="销售报表" value="sales" />
                <el-option label="库存报表" value="inventory" />
                <el-option label="财务报表" value="finance" />
                <el-option label="运营报表" value="operations" />
              </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker v-model="customForm.dateRange" type="daterange" range-separator="-" start-placeholder="开始" end-placeholder="结束" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="包含指标">
              <el-checkbox-group v-model="customForm.metrics">
                <el-checkbox label="销售额" value="salesAmount" />
                <el-checkbox label="订单数" value="orderCount" />
                <el-checkbox label="客户数" value="customerCount" />
                <el-checkbox label="利润" value="profit" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleGenerateCustom">生成报表</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="定时导出" name="auto">
        <el-card>
          <el-descriptions :column="2" border v-if="dcStore.autoExportConfig">
            <el-descriptions-item label="开启状态">{{ dcStore.autoExportConfig.enabled ? '已开启' : '已关闭' }}</el-descriptions-item>
            <el-descriptions-item label="导出周期">{{ dcStore.autoExportConfig.period }}</el-descriptions-item>
            <el-descriptions-item label="导出格式">{{ dcStore.autoExportConfig.format }}</el-descriptions-item>
            <el-descriptions-item label="接收人">{{ dcStore.autoExportConfig.recipients }}</el-descriptions-item>
          </el-descriptions>
          <el-button type="primary" style="margin-top: 16px" @click="showAutoConfig = true">修改配置</el-button>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="showAutoConfig" title="定时导出配置" width="500px">
      <el-form :model="autoForm" label-width="80px">
        <el-form-item label="开启"><el-switch v-model="autoForm.enabled" /></el-form-item>
        <el-form-item label="周期">
          <el-select v-model="autoForm.period">
            <el-option label="每日" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
          </el-select>
        </el-form-item>
        <el-form-item label="格式">
          <el-select v-model="autoForm.format">
            <el-option label="Excel" value="xlsx" />
            <el-option label="PDF" value="pdf" />
            <el-option label="CSV" value="csv" />
          </el-select>
        </el-form-item>
        <el-form-item label="接收人"><el-input v-model="autoForm.recipients" placeholder="邮箱列表" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAutoConfig = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateAuto">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useDataCenterStore } from '@/stores/data-center'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'

const dcStore = useDataCenterStore()
const activeTab = ref('templates')
const showAutoConfig = ref(false)

const templates = [
  { id: '1', name: '日报', description: '每日经营数据汇总', color: '#409EFF', type: 'daily' },
  { id: '2', name: '周报', description: '每周经营趋势分析', color: '#67C23A', type: 'weekly' },
  { id: '3', name: '月报', description: '每月综合经营报表', color: '#E6A23C', type: 'monthly' },
  { id: '4', name: '季度报', description: '季度经营总结报告', color: '#F56C6C', type: 'quarterly' }
]

const customForm = reactive({ name: '', type: '', dateRange: null, metrics: [] })
const autoForm = reactive({ enabled: false, period: 'daily', format: 'xlsx', recipients: '' })

const handleGenerate = async (tpl) => {
  await dcStore.generateReport({ type: tpl.type, name: tpl.name })
  ElMessage.success(`${tpl.name}生成成功`)
}

const handleGenerateCustom = async () => {
  await dcStore.generateReport(customForm)
  ElMessage.success('自定义报表生成成功')
}

const handleUpdateAuto = async () => {
  await dcStore.updateAutoExportConfig(autoForm)
  ElMessage.success('配置已更新')
  showAutoConfig.value = false
  dcStore.fetchAutoExportConfig()
}

onMounted(() => dcStore.fetchAutoExportConfig())
</script>