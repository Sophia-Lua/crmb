<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="发货单号"><el-input v-model="queryForm.shippingNo" clearable /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="待发货" value="pending" />
            <el-option label="已发货" value="shipped" />
            <el-option label="运输中" value="in_transit" />
            <el-option label="已到达" value="arrived" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="success" @click="showCreateDialog = true">创建发货单</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="supStore.shippingOrders" v-loading="supStore.loading" stripe border>
        <el-table-column prop="shippingNo" label="发货单号" width="140" />
        <el-table-column prop="orderNo" label="关联订单" width="140" />
        <el-table-column prop="carrier" label="物流公司" width="100" />
        <el-table-column prop="trackingNo" label="物流单号" width="140" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag size="small">{{ shippingStatusMap[row.status] || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleTrack(row.id)">跟踪</el-button>
            <el-button v-if="!row.trackingNo" type="warning" link size="small" @click="showLogistics(row)">录入物流</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="showCreateDialog" title="创建发货单" width="500px">
      <el-form :model="createForm" label-width="80px">
        <el-form-item label="订单号"><el-input v-model="createForm.orderId" /></el-form-item>
        <el-form-item label="物流公司"><el-input v-model="createForm.carrier" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="logisticsVisible" title="录入物流信息" width="400px">
      <el-form :model="logisticsForm" label-width="80px">
        <el-form-item label="物流公司"><el-input v-model="logisticsForm.carrier" /></el-form-item>
        <el-form-item label="物流单号"><el-input v-model="logisticsForm.trackingNo" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="logisticsVisible = false">取消</el-button>
        <el-button type="primary" @click="handleInputLogistics">录入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSupplierStore } from '@/stores/supplier'
import { ElMessage } from 'element-plus'

const supStore = useSupplierStore()
const shippingStatusMap = { pending: '待发货', shipped: '已发货', in_transit: '运输中', arrived: '已到达' }
const showCreateDialog = ref(false)
const logisticsVisible = ref(false)
const logisticsId = ref('')

const queryForm = reactive({ shippingNo: '', status: '', page: 1, pageSize: 20 })
const createForm = reactive({ orderId: '', carrier: '' })
const logisticsForm = reactive({ id: '', carrier: '', trackingNo: '' })

const handleQuery = () => supStore.fetchOrders(queryForm)

const handleCreate = async () => {
  await supStore.createShippingOrder(createForm)
  ElMessage.success('发货单创建成功')
  showCreateDialog.value = false
}

const showLogistics = (row) => {
  logisticsId.value = row.id
  logisticsForm.carrier = ''
  logisticsForm.trackingNo = ''
  logisticsVisible.value = true
}

const handleInputLogistics = async () => {
  await supStore.inputLogistics(logisticsId.value, logisticsForm)
  ElMessage.success('物流信息录入成功')
  logisticsVisible.value = false
}

const handleTrack = async (id) => {
  await supStore.trackShipping(id)
  ElMessage.info('物流跟踪信息已获取')
}

onMounted(() => supStore.fetchOrders())
</script>