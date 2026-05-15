<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="店铺类型">
          <el-select v-model="queryForm.storeType" placeholder="全部" clearable>
            <el-option label="超市" value="supermarket" />
            <el-option label="便利店" value="convenience" />
            <el-option label="餐饮" value="restaurant" />
          </el-select>
        </el-form-item>
        <el-form-item label="区域">
          <el-input v-model="queryForm.district" placeholder="区域" clearable />
        </el-form-item>
        <el-form-item label="店铺名">
          <el-input v-model="queryForm.storeName" placeholder="店铺名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="filteredStores" v-loading="salesStore.loading" stripe border>
        <el-table-column prop="storeName" label="店铺名称" min-width="140" />
        <el-table-column prop="storeType" label="店铺类型" width="100">
          <template #default="{ row }">{{ storeTypeMap[row.storeType] || row.storeType }}</template>
        </el-table-column>
        <el-table-column prop="address" label="地址" min-width="180" show-overflow-tooltip />
        <el-table-column prop="contactName" label="联系人" width="100" />
        <el-table-column prop="contactPhone" label="联系电话" width="120" />
        <el-table-column prop="area" label="面积" width="80">
          <template #default="{ row }">{{ row.area }}m²</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="录入时间" width="170">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleClaim(row.id)">领取</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useSalesStore } from '@/stores/sales'
import { ElMessage, ElMessageBox } from 'element-plus'

const salesStore = useSalesStore()
const storeTypeMap = { supermarket: '超市', convenience: '便利店', restaurant: '餐饮' }

const queryForm = reactive({ storeType: '', district: '', storeName: '' })

const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const filteredStores = computed(() => {
  let list = salesStore.unclaimedStores
  if (queryForm.storeType) list = list.filter(s => s.storeType === queryForm.storeType)
  if (queryForm.district) list = list.filter(s => s.district?.includes(queryForm.district))
  if (queryForm.storeName) list = list.filter(s => s.storeName?.includes(queryForm.storeName))
  return list
})

const handleQuery = () => {}
const resetQuery = () => {
  Object.assign(queryForm, { storeType: '', district: '', storeName: '' })
}

const handleClaim = async (id) => {
  await ElMessageBox.confirm('确认领取该店铺?', '提示', { type: 'warning' })
  await salesStore.claimStore(id)
  ElMessage.success('领取成功')
  salesStore.fetchUnclaimedStores()
}

onMounted(() => {
  salesStore.fetchUnclaimedStores()
})
</script>