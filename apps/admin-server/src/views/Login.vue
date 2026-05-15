<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #2d3a4b">
    <el-card style="width: 420px; border-radius: 8px">
      <template #header>
        <div style="text-align: center; font-size: 24px; font-weight: bold; color: #304156">CRMB 管理后台</div>
      </template>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="loginForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="HR人员" value="hr" />
            <el-option label="部门经理" value="department_manager" />
            <el-option label="员工" value="employee" />
            <el-option label="运营人员" value="operations" />
            <el-option label="运营主管" value="operations_manager" />
            <el-option label="数据分析师" value="data_analyst" />
            <el-option label="管理层" value="management" />
            <el-option label="仓管员" value="warehouse_staff" />
            <el-option label="仓库主管" value="warehouse_manager" />
            <el-option label="配送员" value="delivery_staff" />
            <el-option label="物流主管" value="logistics_manager" />
            <el-option label="客服人员" value="cs_staff" />
            <el-option label="客服主管" value="cs_manager" />
            <el-option label="财务人员" value="finance_staff" />
            <el-option label="财务主管" value="finance_manager" />
            <el-option label="采购员" value="purchase_staff" />
            <el-option label="采购主管" value="purchase_manager" />
            <el-option label="供应商" value="supplier" />
            <el-option label="商家" value="merchant" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" :loading="loading" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  role: 'admin'
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const handleLogin = async () => {
  const valid = await loginFormRef.value.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await authStore.login(loginForm)
  } finally {
    loading.value = false
  }
}
</script>