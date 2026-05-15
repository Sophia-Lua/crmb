<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="卸货管理" name="unloading">
        <el-card>
          <el-button type="primary" style="margin-bottom: 16px" @click="showAddUnloading = true">创建卸货记录</el-button>
          <el-table :data="cwStore.unloadingPlan" stripe border>
            <el-table-column prop="id" label="ID" width="100" />
            <el-table-column prop="supplierName" label="供应商" width="120" />
            <el-table-column label="商品明细" min-width="200">
              <template #default="{ row }">
                <span v-for="(item, idx) in row.items" :key="idx">{{ item.productName }}x{{ item.quantity }}; </span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === 'completed' ? 'success' : 'warning'" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="plannedTime" label="计划时间" width="170">
              <template #default="{ row }">{{ formatDate(row.plannedTime) }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="排班管理" name="schedule">
        <el-card>
          <el-table :data="cwStore.schedule" stripe border>
            <el-table-column prop="id" label="ID" width="100" />
            <el-table-column prop="employeeName" label="员工" width="120" />
            <el-table-column prop="shift" label="班次" width="100" />
            <el-table-column prop="date" label="日期" width="110" />
          </el-table>
          <el-empty v-if="!cwStore.schedule.length" description="暂无排班数据" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="车辆管理" name="vehicles">
        <el-card>
          <el-table :data="cwStore.vehicles" stripe border>
            <el-table-column prop="id" label="ID" width="100" />
            <el-table-column prop="vehicleNo" label="车牌号" width="120" />
            <el-table-column prop="type" label="车型" width="100" />
            <el-table-column prop="status" label="状态" width="80" />
          </el-table>
          <el-empty v-if="!cwStore.vehicles.length" description="暂无车辆数据" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="showAddUnloading" title="创建卸货记录" width="500px">
      <el-form :model="unloadingForm" label-width="80px">
        <el-form-item label="供应商"><el-input v-model="unloadingForm.supplierId" placeholder="供应商ID" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="unloadingForm.remark" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddUnloading = false">取消</el-button>
        <el-button type="primary" @click="handleAddUnloading">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCloudWarehouseStore } from '@/stores/cloud-warehouse'
import { ElMessage } from 'element-plus'

const cwStore = useCloudWarehouseStore()
const activeTab = ref('unloading')
const showAddUnloading = ref(false)
const unloadingForm = reactive({ supplierId: '', remark: '' })
const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const handleAddUnloading = async () => {
  await cwStore.createUnloadingRecord(unloadingForm)
  ElMessage.success('卸货记录创建成功')
  showAddUnloading.value = false
  cwStore.fetchUnloadingPlan()
}

onMounted(() => {
  cwStore.fetchUnloadingPlan()
  cwStore.fetchSchedule()
  cwStore.fetchVehicles()
})
</script>