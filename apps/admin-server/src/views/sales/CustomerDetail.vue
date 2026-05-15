<template>
  <div>
    <el-page-header @back="router.push('/sales/customers/private')" content="客户详情" style="margin-bottom: 16px" />
    <el-card v-loading="salesStore.loading">
      <el-descriptions :column="2" border title="基本信息" v-if="customer">
        <el-descriptions-item label="客户名称">{{ customer.customerName }}</el-descriptions-item>
        <el-descriptions-item label="客户类型">{{ storeTypeMap[customer.storeType] || customer.storeType }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ customer.contactName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ customer.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ customer.address }}</el-descriptions-item>
        <el-descriptions-item label="营业时间">{{ customer.businessHours }}</el-descriptions-item>
        <el-descriptions-item label="面积">{{ customer.area }}m²</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ customer.assignedTo }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag size="small">{{ customer.status }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="2" border title="经营信息" style="margin-top: 16px" v-if="customer">
        <el-descriptions-item label="主要品类" :span="2">{{ customer.mainCategories?.join('、') }}</el-descriptions-item>
        <el-descriptions-item label="客户等级">
          <el-tag :type="customer.grade === 'A' ? 'success' : customer.grade === 'B' ? '' : 'warning'" size="small">{{ customer.grade }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="订单金额">{{ customer.totalOrderAmount?.toFixed(2) }}元</el-descriptions-item>
        <el-descriptions-item label="最近拜访">{{ formatDate(customer.lastVisitDate) }}</el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 16px">
        <el-button type="primary" @click="router.push(`/sales/visits/create?customerId=${customer?.id}`)">新建拜访</el-button>
        <el-button type="warning" @click="handleTransfer">转移客户</el-button>
        <el-button type="danger" @click="handleReturn">归还公海</el-button>
      </div>
    </el-card>
    <el-card style="margin-top: 16px" title="拜访记录">
      <el-table :data="visitList" stripe border>
        <el-table-column prop="subject" label="拜访主题" min-width="140" show-overflow-tooltip />
        <el-table-column prop="visitType" label="类型" width="100" />
        <el-table-column prop="status" label="状态" width="80" />
        <el-table-column prop="planDate" label="日期" width="110" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="router.push(`/sales/visits/${row.id}`)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const salesStore = useSalesStore()
const storeTypeMap = { supermarket: '超市', restaurant: '餐饮', convenience: '便利店' }
const visitList = ref([])

const customer = computed(() => salesStore.customerDetail)
const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const handleTransfer = async () => {
  const { value } = await ElMessageBox.prompt('请输入目标负责人ID', '转移客户')
  await salesStore.transferCustomer(route.params.id, { assignedTo: value })
  ElMessage.success('转移成功')
  salesStore.fetchCustomerDetail(route.params.id)
}

const handleReturn = async () => {
  await ElMessageBox.confirm('确认将该客户归还到公海?', '提示', { type: 'warning' })
  await salesStore.returnCustomer(route.params.id)
  ElMessage.success('归还成功')
  router.push('/sales/customers/private')
}

onMounted(async () => {
  await salesStore.fetchCustomerDetail(route.params.id)
  await salesStore.fetchVisits({ customerId: route.params.id, pageSize: 10 })
  visitList.value = salesStore.visits.filter(v => v.customerId === route.params.id)
})
</script>