<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="实时位置" name="realtime">
        <el-card>
          <el-form :model="realtimeQuery" inline style="margin-bottom: 16px">
            <el-form-item label="配送员"><el-input v-model="realtimeQuery.deliveryPersonId" placeholder="配送员ID" clearable /></el-form-item>
            <el-form-item>
              <el-button type="primary" @click="fetchRealtime">查询</el-button>
            </el-form-item>
          </el-form>
          <el-descriptions :column="2" border v-if="ddStore.realtimeTrack">
            <el-descriptions-item label="配送员">{{ ddStore.realtimeTrack.deliveryPerson }}</el-descriptions-item>
            <el-descriptions-item label="当前位置">{{ ddStore.realtimeTrack.currentLocation }}</el-descriptions-item>
            <el-descriptions-item label="当前线路">{{ ddStore.realtimeTrack.routeName }}</el-descriptions-item>
            <el-descriptions-item label="已完成站点">{{ ddStore.realtimeTrack.completedStations }}/{{ ddStore.realtimeTrack.totalStations }}</el-descriptions-item>
            <el-descriptions-item label="预计到达">{{ ddStore.realtimeTrack.estimatedArrival }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ ddStore.realtimeTrack.status }}</el-descriptions-item>
          </el-descriptions>
          <el-empty v-else description="请输入配送员ID查询实时位置" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="历史回放" name="history">
        <el-card>
          <el-form :model="historyQuery" inline style="margin-bottom: 16px">
            <el-form-item label="日期"><el-date-picker v-model="historyQuery.date" type="date" value-format="YYYY-MM-DD" /></el-form-item>
            <el-form-item>
              <el-button type="primary" @click="fetchHistory">查询</el-button>
            </el-form-item>
          </el-form>
          <el-empty v-if="!ddStore.historyTrack" description="暂无历史轨迹数据" />
          <el-descriptions :column="2" border v-if="ddStore.historyTrack">
            <el-descriptions-item label="配送员">{{ ddStore.historyTrack.deliveryPerson }}</el-descriptions-item>
            <el-descriptions-item label="日期">{{ ddStore.historyTrack.date }}</el-descriptions-item>
            <el-descriptions-item label="完成订单">{{ ddStore.historyTrack.completedOrders }}</el-descriptions-item>
            <el-descriptions-item label="总里程">{{ ddStore.historyTrack.totalDistance }}km</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="时效分析" name="analysis">
        <el-card>
          <el-row :gutter="20">
            <el-col :span="6"><el-statistic title="平均配送时间" :value="0" suffix="分钟" /></el-col>
            <el-col :span="6"><el-statistic title="准时率" :value="0" suffix="%" /></el-col>
            <el-col :span="6"><el-statistic title="平均里程" :value="0" suffix="km" /></el-col>
            <el-col :span="6"><el-statistic title="异常数" :value="ddStore.abnormalWarning.length" /></el-col>
          </el-row>
          <el-button type="primary" style="margin-top: 16px" @click="fetchAnalysis">刷新数据</el-button>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="异常预警" name="warning">
        <el-card>
          <el-table :data="ddStore.abnormalWarning" stripe border>
            <el-table-column prop="deliveryPersonId" label="配送员" width="100" />
            <el-table-column prop="type" label="异常类型" width="120" />
            <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
            <el-table-column prop="createdAt" label="时间" width="170" />
          </el-table>
          <el-empty v-if="!ddStore.abnormalWarning.length" description="暂无异常预警" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useDirectDeliveryStore } from '@/stores/direct-delivery'

const ddStore = useDirectDeliveryStore()
const activeTab = ref('realtime')

const realtimeQuery = reactive({ deliveryPersonId: '' })
const historyQuery = reactive({ date: '' })

const fetchRealtime = () => ddStore.fetchRealtimeTrack(realtimeQuery)
const fetchHistory = () => ddStore.fetchHistoryTrack(historyQuery)
const fetchAnalysis = () => {
  ddStore.fetchTimeAnalysis({})
  ddStore.fetchAbnormalWarning()
}

onMounted(() => ddStore.fetchAbnormalWarning())
</script>