<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="促销活动" name="promotions">
        <el-card>
          <el-form :model="promoQuery" inline style="margin-bottom: 16px">
            <el-form-item label="状态">
              <el-select v-model="promoQuery.status" placeholder="全部" clearable>
                <el-option label="进行中" value="active" />
                <el-option label="已结束" value="ended" />
                <el-option label="待开始" value="pending" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="fetchPromos">查询</el-button>
              <el-button type="success" @click="showAddPromo = true">创建促销</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="opsStore.promotions" v-loading="opsStore.loading" stripe border>
            <el-table-column prop="name" label="活动名称" min-width="140" />
            <el-table-column prop="type" label="活动类型" width="100" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === 'active' ? 'success' : row.status === 'pending' ? 'info' : 'danger'" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="startDate" label="开始日期" width="110" />
            <el-table-column prop="endDate" label="结束日期" width="110" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="ElMessage.info('查看效果分析')">分析</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="优惠券" name="coupons">
        <el-card>
          <el-button type="success" style="margin-bottom: 16px" @click="showAddCoupon = true">创建优惠券</el-button>
          <el-table :data="opsStore.coupons" stripe border>
            <el-table-column prop="name" label="优惠券名称" min-width="140" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="discount" label="折扣/金额" width="100" />
            <el-table-column prop="usedCount" label="已使用" width="80" />
            <el-table-column prop="totalCount" label="总数量" width="80" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }"><el-tag size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="秒杀配置" name="seckill">
        <el-card>
          <el-descriptions :column="2" border title="秒杀配置" v-if="opsStore.seckillConfig">
            <el-descriptions-item label="开启状态">{{ opsStore.seckillConfig.enabled ? '已开启' : '已关闭' }}</el-descriptions-item>
            <el-descriptions-item label="开始时间">{{ opsStore.seckillConfig.startTime }}</el-descriptions-item>
            <el-descriptions-item label="结束时间">{{ opsStore.seckillConfig.endTime }}</el-descriptions-item>
            <el-descriptions-item label="限购数量">{{ opsStore.seckillConfig.limitPerUser }}</el-descriptions-item>
          </el-descriptions>
          <el-button type="primary" style="margin-top: 16px" @click="showSeckillEdit = true">修改配置</el-button>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="showAddPromo" title="创建促销活动" width="500px">
      <el-form :model="promoForm" label-width="80px">
        <el-form-item label="活动名称"><el-input v-model="promoForm.name" /></el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="promoForm.type">
            <el-option label="折扣" value="discount" />
            <el-option label="满减" value="full_reduction" />
            <el-option label="赠品" value="gift" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期"><el-date-picker v-model="promoForm.startDate" type="date" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="结束日期"><el-date-picker v-model="promoForm.endDate" type="date" value-format="YYYY-MM-DD" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddPromo = false">取消</el-button>
        <el-button type="primary" @click="handleAddPromo">创建</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showAddCoupon" title="创建优惠券" width="500px">
      <el-form :model="couponForm" label-width="80px">
        <el-form-item label="名称"><el-input v-model="couponForm.name" /></el-form-item>
        <el-form-item label="类型">
          <el-select v-model="couponForm.type">
            <el-option label="折扣券" value="discount" />
            <el-option label="满减券" value="reduction" />
          </el-select>
        </el-form-item>
        <el-form-item label="折扣/金额"><el-input-number v-model="couponForm.discount" :precision="2" /></el-form-item>
        <el-form-item label="总数量"><el-input-number v-model="couponForm.totalCount" :min="1" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddCoupon = false">取消</el-button>
        <el-button type="primary" @click="handleAddCoupon">创建</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showSeckillEdit" title="修改秒杀配置" width="500px">
      <el-form :model="seckillForm" label-width="80px">
        <el-form-item label="开启"><el-switch v-model="seckillForm.enabled" /></el-form-item>
        <el-form-item label="开始时间"><el-time-picker v-model="seckillForm.startTime" /></el-form-item>
        <el-form-item label="结束时间"><el-time-picker v-model="seckillForm.endTime" /></el-form-item>
        <el-form-item label="限购数量"><el-input-number v-model="seckillForm.limitPerUser" :min="1" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSeckillEdit = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateSeckill">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useOperationsStore } from '@/stores/operations'
import { ElMessage } from 'element-plus'

const opsStore = useOperationsStore()
const activeTab = ref('promotions')
const showAddPromo = ref(false)
const showAddCoupon = ref(false)
const showSeckillEdit = ref(false)

const promoQuery = reactive({ status: '', page: 1, pageSize: 20 })
const promoForm = reactive({ name: '', type: '', startDate: '', endDate: '' })
const couponForm = reactive({ name: '', type: '', discount: 0, totalCount: 100 })
const seckillForm = reactive({ enabled: false, startTime: '', endTime: '', limitPerUser: 1 })

const fetchPromos = () => opsStore.fetchPromotions(promoQuery)

const handleAddPromo = async () => {
  await opsStore.createPromotion(promoForm)
  ElMessage.success('创建成功')
  showAddPromo.value = false
  fetchPromos()
}

const handleAddCoupon = async () => {
  await opsStore.createCoupon(couponForm)
  ElMessage.success('创建成功')
  showAddCoupon.value = false
  opsStore.fetchCoupons()
}

const handleUpdateSeckill = async () => {
  await opsStore.updateSeckillConfig(seckillForm)
  ElMessage.success('配置已更新')
  showSeckillEdit.value = false
  opsStore.fetchSeckillConfig()
}

onMounted(() => {
  fetchPromos()
  opsStore.fetchCoupons()
  opsStore.fetchSeckillConfig()
})
</script>