<template>
  <div>
    <el-card style="margin-bottom: 16px">
      <el-row :gutter="20">
        <el-col :span="6"><el-statistic title="出勤人数" :value="attendanceStats.present" /></el-col>
        <el-col :span="6"><el-statistic title="请假人数" :value="attendanceStats.leave" /></el-col>
        <el-col :span="6"><el-statistic title="迟到人数" :value="attendanceStats.late" /></el-col>
        <el-col :span="6"><el-statistic title="旷工人数" :value="attendanceStats.absent" /></el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="日期"><el-date-picker v-model="queryForm.date" type="date" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="员工名"><el-input v-model="queryForm.employeeName" placeholder="员工姓名" clearable /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="出勤" value="present" />
            <el-option label="迟到" value="late" />
            <el-option label="请假" value="leave" />
            <el-option label="旷工" value="absent" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="success" @click="handleCheckIn">打卡签到</el-button>
          <el-button type="warning" @click="handleCheckOut">打卡签退</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="hrStore.attendance" v-loading="hrStore.loading" stripe border>
        <el-table-column prop="employeeName" label="员工姓名" width="120" />
        <el-table-column prop="date" label="日期" width="110" />
        <el-table-column prop="checkInTime" label="签到时间" width="100" />
        <el-table-column prop="checkOutTime" label="签退时间" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="attStatusMap[row.status]?.type || 'info'" size="small">{{ attStatusMap[row.status]?.label || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="leaveType" label="请假类型" width="100">
          <template #default="{ row }">{{ row.leaveType || '-' }}</template>
        </el-table-column>
        <el-table-column prop="leaveReason" label="请假原因" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">{{ row.leaveReason || '-' }}</template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="hrStore.attendanceTotal" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @current-change="fetchData" @size-change="fetchData" />
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useHrStore } from '@/stores/hr'
import { ElMessage } from 'element-plus'

const hrStore = useHrStore()
const attStatusMap = { present: { label: '出勤', type: 'success' }, late: { label: '迟到', type: 'warning' }, leave: { label: '请假', type: '' }, absent: { label: '旷工', type: 'danger' } }
const attendanceStats = ref({ present: 2, leave: 1, late: 0, absent: 0 })

const queryForm = reactive({ date: '', employeeName: '', status: '', page: 1, pageSize: 20 })

const fetchData = () => hrStore.fetchAttendance(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { date: '', employeeName: '', status: '', page: 1, pageSize: 20 }); fetchData() }

const handleCheckIn = async () => {
  await hrStore.checkIn()
  ElMessage.success('签到成功')
  fetchData()
}

const handleCheckOut = async () => {
  await hrStore.checkOut()
  ElMessage.success('签退成功')
  fetchData()
}

onMounted(() => fetchData())
</script>