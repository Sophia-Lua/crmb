<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
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
        <el-table-column prop="claimBy" label="领取人" width="100" />
        <el-table-column prop="createdAt" label="录入时间" width="170">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
            <el-button type="success" link size="small" @click="handleReview(row.id, 'approved')">通过</el-button>
            <el-button type="danger" link size="small" @click="handleReview(row.id, 'rejected')">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="detailVisible" title="店铺详情" width="600px">
      <el-descriptions :column="2" border v-if="currentStore">
        <el-descriptions-item label="店铺名称">{{ currentStore.storeName }}</el-descriptions-item>
        <el-descriptions-item label="店铺类型">{{ storeTypeMap[currentStore.storeType] }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ currentStore.address }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ currentStore.contactName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentStore.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="面积">{{ currentStore.area }}m²</el-descriptions-item>
        <el-descriptions-item label="领取人">{{ currentStore.claimBy }}</el-descriptions-item>
      </el-descriptions>
      <div v-if="currentStore?.licenses?.length" style="margin-top: 16px">
        <div style="font-weight: bold; margin-bottom: 8px">资质证书</div>
        <el-image v-for="lic in currentStore.licenses" :key="lic.id" :src="lic.url" style="width: 120px; height: 120px; margin-right: 8px" fit="cover" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useSalesStore } from '@/stores/sales'
import { ElMessage, ElMessageBox } from 'element-plus'

const salesStore = useSalesStore()
const storeTypeMap = { supermarket: '超市', convenience: '便利店', restaurant: '餐饮' }
const queryForm = reactive({ storeName: '' })
const detailVisible = ref(false)
const currentStore = ref(null)

const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const filteredStores = computed(() => {
  let list = salesStore.reviewStores
  if (queryForm.storeName) list = list.filter(s => s.storeName?.includes(queryForm.storeName))
  return list
})

const handleQuery = () => {}
const resetQuery = () => { queryForm.storeName = '' }

const showDetail = (row) => {
  currentStore.value = row
  detailVisible.value = true
}

const handleReview = async (id, status) => {
  if (status === 'rejected') {
    const { value } = await ElMessageBox.prompt('请输入驳回原因', '驳回', { inputPattern: /.+/, inputErrorMessage: '驳回原因不能为空' })
    await salesStore.reviewStore(id, { status, rejectReason: value })
  } else {
    await ElMessageBox.confirm('确认通过审核?', '提示', { type: 'success' })
    await salesStore.reviewStore(id, { status })
  }
  ElMessage.success('审核完成')
  salesStore.fetchReviewStores()
}

onMounted(() => {
  salesStore.fetchReviewStores()
})
</script>