<template>
  <el-container style="height: 100vh">
    <el-aside :width="isCollapse ? '64px' : '220px'" style="transition: width 0.3s; background: #304156">
      <div style="height: 60px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: bold; white-space: nowrap; overflow: hidden">
        <span v-if="!isCollapse">CRMB 管理后台</span>
        <span v-else>C</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><Monitor /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        <el-sub-menu index="sales">
          <template #title>
            <el-icon><Sell /></el-icon>
            <span>销售管理</span>
          </template>
          <el-menu-item index="/sales/visits">拜访管理</el-menu-item>
          <el-menu-item index="/sales/stores/unclaimed">待领取店铺</el-menu-item>
          <el-menu-item index="/sales/stores/review">待审核店铺</el-menu-item>
          <el-menu-item index="/sales/customers/public">公海客户</el-menu-item>
          <el-menu-item index="/sales/customers/private">私海客户</el-menu-item>
          <el-menu-item index="/sales/complaints">客诉管理</el-menu-item>
          <el-menu-item index="/sales/special-stock">特殊备货</el-menu-item>
          <el-menu-item index="/sales/blacklist">黑名单</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="hr">
          <template #title>
            <el-icon><User /></el-icon>
            <span>人事管理</span>
          </template>
          <el-menu-item index="/hr/employees">员工管理</el-menu-item>
          <el-menu-item index="/hr/attendance">考勤管理</el-menu-item>
          <el-menu-item index="/hr/performance">绩效管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="customer-service">
          <template #title>
            <el-icon><Service /></el-icon>
            <span>客服管理</span>
          </template>
          <el-menu-item index="/customer-service/orders">订单管理</el-menu-item>
          <el-menu-item index="/customer-service/after-sales">售后管理</el-menu-item>
          <el-menu-item index="/customer-service/complaints">客诉管理</el-menu-item>
          <el-menu-item index="/customer-service/satisfaction">客户满意度</el-menu-item>
          <el-menu-item index="/customer-service/invoices">发票管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="operations">
          <template #title>
            <el-icon><Operation /></el-icon>
            <span>运营管理</span>
          </template>
          <el-menu-item index="/operations/products">商品管理</el-menu-item>
          <el-menu-item index="/operations/promotions">活动管理</el-menu-item>
          <el-menu-item index="/operations/merchants">商家审核</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="data-center">
          <template #title>
            <el-icon><DataAnalysis /></el-icon>
            <span>数据中心</span>
          </template>
          <el-menu-item index="/data-center/query">数据查询</el-menu-item>
          <el-menu-item index="/data-center/analysis">统计分析</el-menu-item>
          <el-menu-item index="/data-center/reports">报表导出</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="cloud-warehouse">
          <template #title>
            <el-icon><Box /></el-icon>
            <span>云仓管理</span>
          </template>
          <el-menu-item index="/cloud-warehouse/outbound">出库管理</el-menu-item>
          <el-menu-item index="/cloud-warehouse/inbound">入库管理</el-menu-item>
          <el-menu-item index="/cloud-warehouse/inventory">库存管理</el-menu-item>
          <el-menu-item index="/cloud-warehouse/admin">行政管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="procurement">
          <template #title>
            <el-icon><ShoppingCart /></el-icon>
            <span>采购管理</span>
          </template>
          <el-menu-item index="/procurement/suppliers">供应商管理</el-menu-item>
          <el-menu-item index="/procurement/orders">采购订单</el-menu-item>
          <el-menu-item index="/procurement/settlement">结算管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="payment">
          <template #title>
            <el-icon><CreditCard /></el-icon>
            <span>支付管理</span>
          </template>
          <el-menu-item index="/payment/merchants">商家管理</el-menu-item>
          <el-menu-item index="/payment/receipts">收款管理</el-menu-item>
          <el-menu-item index="/payment/settlement">结算管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="supplier">
          <template #title>
            <el-icon><Van /></el-icon>
            <span>供应商端</span>
          </template>
          <el-menu-item index="/supplier/orders">订单管理</el-menu-item>
          <el-menu-item index="/supplier/shipping">发货管理</el-menu-item>
          <el-menu-item index="/supplier/reconciliation">对账管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="finance">
          <template #title>
            <el-icon><Wallet /></el-icon>
            <span>财务管理</span>
          </template>
          <el-menu-item index="/finance/transactions">财务核算</el-menu-item>
          <el-menu-item index="/finance/reconciliation">对账管理</el-menu-item>
          <el-menu-item index="/finance/reports">报表管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="direct-delivery">
          <template #title>
            <el-icon><Location /></el-icon>
            <span>直配管理</span>
          </template>
          <el-menu-item index="/direct-delivery/routes">线路管理</el-menu-item>
          <el-menu-item index="/direct-delivery/tasks">配送管理</el-menu-item>
          <el-menu-item index="/direct-delivery/tracking">轨迹跟踪</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="height: 60px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e6e6e6; background: #fff">
        <div style="display: flex; align-items: center">
          <el-icon style="font-size: 20px; cursor: pointer" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-if="isCollapse" />
          </el-icon>
          <el-breadcrumb separator="/" style="margin-left: 16px">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRoute.meta?.title">{{ currentRoute.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-dropdown @command="handleCommand">
          <span style="cursor: pointer; display: flex; align-items: center">
            <el-avatar :size="32" style="margin-right: 8px">U</el-avatar>
            {{ authStore.userInfo?.name || '用户' }}
            <el-icon style="margin-left: 4px"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main style="background: #f0f2f5; padding: 20px">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Monitor, Sell, User, Service, Operation, DataAnalysis, Box, ShoppingCart, CreditCard, Van, Wallet, Location, Fold, Expand, ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isCollapse = ref(false)

const activeMenu = computed(() => route.path)
const currentRoute = computed(() => route)

const handleCommand = (command) => {
  if (command === 'logout') {
    authStore.logout()
  }
}
</script>