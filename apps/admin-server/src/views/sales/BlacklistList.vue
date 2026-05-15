<template>
  <div>
    <el-card>
      <el-form :model="queryForm" inline style="margin-bottom: 16px">
        <el-form-item label="客户名">
          <el-input v-model="queryForm.customerName" placeholder="客户名称" clearable />
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="queryForm.reason" placeholder="黑名单原因" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="salesStore.blacklist" v-loading="salesStore.loading" stripe border>
        <el-table-column prop="customerName" label="客户名称" min-width="120" />
        <el-table-column prop="reason" label="黑名单原因" min-width="160" show-overflow-tooltip />
        <el-table-column prop="blacklistedBy" label="操作人" width="100" />
        <el-table-column prop="notes" label="备注" min-width="160" show-overflow-tooltip />
        <el-table-column prop="blacklistedAt" label="列入时间" width="170">
          <template #default="{ row }">{{ formatDate(row.blacklistedAt) }}</template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 16px; justify-content: flex-end" v-model:current-page="queryForm.page" v-model:page-size="queryForm.pageSize" :total="salesStore.blacklistTotal" layout="total, prev, pager, next" @current-change="fetchData" />
    </el-card>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useSalesStore } from '@/stores/sales'

const salesStore = useSalesStore()
const queryForm = reactive({ customerName: '', reason: '', page: 1, pageSize: 20 })
const formatDate = (date) => date ? new Date(date).toLocaleString('zh-CN') : ''

const fetchData = () => salesStore.fetchBlacklist(queryForm)
const handleQuery = () => { queryForm.page = 1; fetchData() }
const resetQuery = () => { Object.assign(queryForm, { customerName: '', reason: '', page: 1, pageSize: 20 }); fetchData() }

onMounted(() => fetchData())
</script>