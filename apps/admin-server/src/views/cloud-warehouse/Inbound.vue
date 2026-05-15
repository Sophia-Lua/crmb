<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="采购入库" name="purchase">
        <el-card>
          <el-table :data="cwStore.inboundOrders.filter(o => o.type === 'purchase')" v-loading="cwStore.loading" stripe border>
            <el-table-column prop="orderNo" label="入库单号" width="140" />
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }">采购入库</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === 'completed' ? 'success' : 'warning'" size="small">{{ inboundStatusMap[row.status] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="商品明细" min-width="200">
              <template #default="{ row }">
                <span v-for="(item, idx) in row.items" :key="idx">{{ item.productName }}x{{ item.quantity }}; </span>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="170">
              <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleConfirm(row.id)">确认入库</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="退货入库" name="return">
        <el-card><el-empty description="暂无退货入库数据" /></el-card>
      </el-tab-pane>
      <el-tab-pane label="手动入库" name="manual">
        <el-card>
          <el-button type="primary" style="margin-bottom: 16px" @click="showCreateDialog = true">手动入库</el-button>
          <el-empty description="暂无手动入库数据" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="showCreateDialog" title="创建入库单" width="600px">
      <el-form :model="createForm" label-width="80px">
        <el-form-item label="入库类型">
          <el-select v-model="createForm.type">
            <el-option label="采购入库" value="purchase" />
            <el-option label="退货入库" value="return" />
            <el-option label="手动入库" value="manual" />
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
const activeTab = ref('purchase')
const showCreateDialog = ref(false)
const inboundStatusMap = { pending: '待入库', confirmed: '已确认', completed: '已完成' }

const createForm = reactive({ type: 'purchase', warehouseId: 'WH-001', remark: '' })
const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const handleConfirm = async (id) => {
  await cwStore.confirmInbound(id)
  ElMessage.success('入库确认成功')
  cwStore.fetchInboundOrders()
}

const handleCreate = async () => {
  await cwStore.createInboundOrder(createForm)
  ElMessage.success('入库单创建成功')
  showCreateDialog.value = false
  cwStore.fetchInboundOrders()
}

onMounted(() => cwStore.fetchInboundOrders())
</script>