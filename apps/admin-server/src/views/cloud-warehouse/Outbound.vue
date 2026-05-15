<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="订单出库" name="sale">
        <el-card>
          <el-table :data="cwStore.outboundOrders.filter(o => o.type === 'sale')" v-loading="cwStore.loading" stripe border>
            <el-table-column prop="orderNo" label="出库单号" width="140" />
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }">订单出库</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'pending' ? 'warning' : 'info'" size="small">{{ outboundStatusMap[row.status] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="170">
              <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
            </el-table-column>
            <el-table-column label="商品明细" min-width="200">
              <template #default="{ row }">
                <span v-for="(item, idx) in row.items" :key="idx">{{ item.productName }}x{{ item.quantity }}; </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleConfirm(row.id)">确认出库</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="退货出库" name="return">
        <el-card>
          <el-empty description="暂无退货出库数据" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="手动出库" name="manual">
        <el-card>
          <el-button type="primary" style="margin-bottom: 16px" @click="showCreateDialog = true">手动出库</el-button>
          <el-empty description="暂无手动出库数据" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="showCreateDialog" title="创建出库单" width="600px">
      <el-form :model="createForm" label-width="80px">
        <el-form-item label="出库类型">
          <el-select v-model="createForm.type">
            <el-option label="订单出库" value="sale" />
            <el-option label="退货出库" value="return" />
            <el-option label="手动出库" value="manual" />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库"><el-input v-model="createForm.warehouseId" placeholder="仓库ID" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="createForm.remark" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCloudWarehouseStore } from '@/stores/cloud-warehouse'
import { ElMessage } from 'element-plus'

const cwStore = useCloudWarehouseStore()
const activeTab = ref('sale')
const showCreateDialog = ref(false)
const outboundStatusMap = { pending: '待出库', confirmed: '已确认', completed: '已完成' }

const createForm = reactive({ type: 'sale', warehouseId: 'WH-001', remark: '' })
const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const handleConfirm = async (id) => {
  await cwStore.confirmOutbound(id)
  ElMessage.success('出库确认成功')
  cwStore.fetchOutboundOrders()
}

const handleCreate = async () => {
  await cwStore.createOutboundOrder(createForm)
  ElMessage.success('出库单创建成功')
  showCreateDialog.value = false
  cwStore.fetchOutboundOrders()
}

onMounted(() => cwStore.fetchOutboundOrders())
</script>