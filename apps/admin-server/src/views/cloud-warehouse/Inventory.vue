<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="实时库存" name="realtime">
        <el-card>
          <el-form :model="queryForm" inline style="margin-bottom: 16px">
            <el-form-item label="SKU"><el-input v-model="queryForm.sku" placeholder="SKU" clearable /></el-form-item>
            <el-form-item label="商品名"><el-input v-model="queryForm.name" placeholder="商品名称" clearable /></el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="cwStore.inventory" v-loading="cwStore.loading" stripe border>
            <el-table-column prop="sku" label="SKU" width="120" />
            <el-table-column prop="productName" label="商品名称" min-width="140" />
            <el-table-column prop="quantity" label="库存数量" width="100" />
            <el-table-column prop="reserved" label="预留数量" width="100" />
            <el-table-column prop="location" label="库位" width="100" />
            <el-table-column prop="batchNo" label="批次号" width="140" />
            <el-table-column prop="expiryDate" label="保质期至" width="110">
              <template #default="{ row }">{{ row.expiryDate?.split('T')[0] }}</template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleCheck(row)">盘点</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="cwStore.inventoryTotal" layout="total, prev, pager, next" @current-change="fetchData" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="库存盘点" name="check">
        <el-card>
          <el-button type="primary" style="margin-bottom: 16px" @click="showCheckDialog = true">发起盘点</el-button>
          <el-empty description="暂无盘点计划" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="预警管理" name="warning">
        <el-card>
          <el-row :gutter="20" style="margin-bottom: 16px">
            <el-col :span="12">
              <el-card shadow="hover">
                <el-statistic title="低库存预警" :value="cwStore.lowStockWarning.length" />
                <div style="margin-top: 8px">
                  <el-tag v-for="item in cwStore.lowStockWarning.slice(0, 3)" :key="item.sku" type="danger" style="margin-right: 4px" size="small">{{ item.productName }}</el-tag>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <el-statistic title="临期预警" :value="cwStore.expiryWarning.length" />
                <div style="margin-top: 8px">
                  <el-tag v-for="item in cwStore.expiryWarning.slice(0, 3)" :key="item.sku" type="warning" style="margin-right: 4px" size="small">{{ item.productName }}</el-tag>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="showCheckDialog" title="库存盘点" width="400px">
      <el-form :model="checkForm" label-width="80px">
        <el-form-item label="SKU"><el-input v-model="checkForm.sku" /></el-form-item>
        <el-form-item label="库位"><el-input v-model="checkForm.location" /></el-form-item>
        <el-form-item label="实际数量"><el-input-number v-model="checkForm.actualQuantity" :min="0" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCheckDialog = false">取消</el-button>
        <el-button type="primary" @click="handleDoCheck">执行盘点</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCloudWarehouseStore } from '@/stores/cloud-warehouse'
import { ElMessage } from 'element-plus'

const cwStore = useCloudWarehouseStore()
const activeTab = ref('realtime')
const showCheckDialog = ref(false)

const queryForm = reactive({ sku: '', name: '', page: 1, pageSize: 20 })
const checkForm = reactive({ sku: '', location: '', actualQuantity: 0 })

const fetchData = () => cwStore.fetchInventory(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { sku: '', name: '', page: 1, pageSize: 20 }); fetchData() }

const handleCheck = (row) => {
  Object.assign(checkForm, { sku: row.sku, location: row.location, actualQuantity: row.quantity })
  showCheckDialog.value = true
}

const handleDoCheck = async () => {
  await cwStore.executeCheck(checkForm)
  ElMessage.success('盘点完成')
  showCheckDialog.value = false
  fetchData()
}

onMounted(() => {
  fetchData()
  cwStore.fetchLowStockWarning()
  cwStore.fetchExpiryWarning()
})
</script>