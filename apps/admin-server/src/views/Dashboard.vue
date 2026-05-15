<template>
  <div>
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="今日订单数" :value="stats.todayOrders" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="本月销售额" :value="stats.monthlySales" :precision="2" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="活跃客户数" :value="stats.activeCustomers" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="库存预警数" :value="stats.stockWarnings" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4" v-for="item in modules" :key="item.path">
        <el-card shadow="hover" style="cursor: pointer; text-align: center; margin-bottom: 16px" @click="router.push(item.path)">
          <el-icon :size="32" :color="item.color"><component :is="item.icon" /></el-icon>
          <div style="margin-top: 8px; font-size: 14px">{{ item.name }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Monitor, Sell, User, Service, Operation, DataAnalysis, Box, ShoppingCart, CreditCard, Van, Wallet, Location } from '@element-plus/icons-vue'

const router = useRouter()

const stats = ref({
  todayOrders: 128,
  monthlySales: 35680,
  activeCustomers: 245,
  stockWarnings: 8
})

const modules = [
  { name: '销售管理', path: '/sales/visits', icon: Sell, color: '#409EFF' },
  { name: '人事管理', path: '/hr/employees', icon: User, color: '#67C23A' },
  { name: '客服管理', path: '/customer-service/orders', icon: Service, color: '#E6A23C' },
  { name: '运营管理', path: '/operations/products', icon: Operation, color: '#F56C6C' },
  { name: '数据中心', path: '/data-center/query', icon: DataAnalysis, color: '#909399' },
  { name: '云仓管理', path: '/cloud-warehouse/outbound', icon: Box, color: '#304156' },
  { name: '采购管理', path: '/procurement/suppliers', icon: ShoppingCart, color: '#9B59B6' },
  { name: '支付管理', path: '/payment/merchants', icon: CreditCard, color: '#3498DB' },
  { name: '供应商端', path: '/supplier/orders', icon: Van, color: '#1ABC9C' },
  { name: '财务管理', path: '/finance/transactions', icon: Wallet, color: '#E74C3C' },
  { name: '直配管理', path: '/direct-delivery/routes', icon: Location, color: '#2ECC71' },
  { name: '仪表盘', path: '/dashboard', icon: Monitor, color: '#95A5A6' }
]

onMounted(async () => {
  try {
    const res = await fetch('/api/health')
    if (res.ok) {
      const data = await res.json()
      if (data) {
        stats.value.todayOrders = 128
      }
    }
  } catch (e) {}
})
</script>