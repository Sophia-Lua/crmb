<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="商家名"><el-input v-model="queryForm.name" placeholder="商家名称" clearable /></el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="opsStore.merchantApplications" v-loading="opsStore.loading" stripe border>
        <el-table-column prop="merchantName" label="商家名称" min-width="140" />
        <el-table-column prop="contactName" label="联系人" width="100" />
        <el-table-column prop="contactPhone" label="联系电话" width="120" />
        <el-table-column prop="businessType" label="经营类型" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'" size="small">{{ merchantStatusMap[row.status] || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="170">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleReview(row.id, 'approved')">通过</el-button>
            <el-button v-if="row.status === 'pending'" type="danger" link size="small" @click="handleReview(row.id, 'rejected')">驳回</el-button>
            <el-button type="primary" link size="small" @click="ElMessage.info('查看详情')">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="opsStore.merchantTotal" layout="total, prev, pager, next" @current-change="fetchData" />
    </el-card>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useOperationsStore } from '@/stores/operations'
import { ElMessage, ElMessageBox } from 'element-plus'

const opsStore = useOperationsStore()
const merchantStatusMap = { pending: '待审核', approved: '已通过', rejected: '已驳回' }

const queryForm = reactive({ name: '', status: '', page: 1, pageSize: 20 })
const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const fetchData = () => opsStore.fetchMerchantApplications(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { name: '', status: '', page: 1, pageSize: 20 }); fetchData() }

const handleReview = async (id, status) => {
  if (status === 'rejected') {
    const { value } = await ElMessageBox.prompt('请输入驳回原因', '驳回')
    await opsStore.reviewMerchant(id, { status, rejectReason: value })
  } else {
    await ElMessageBox.confirm('确认通过审核?', '提示', { type: 'success' })
    await opsStore.reviewMerchant(id, { status })
  }
  ElMessage.success('审核完成')
  fetchData()
}

onMounted(() => fetchData())
</script>