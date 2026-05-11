<template>
  <div class="dashboard">
    <h1>CRMB 管理后台</h1>
    <p>欢迎使用 CRMB 商城配送系统管理后台！</p>
    <el-button type="primary" @click="fetchData">测试API连接</el-button>
    <div v-if="data" class="api-response">
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const data = ref(null);

const fetchData = async () => {
  try {
    const response = await axios.get('/api/health');
    data.value = response.data;
  } catch (error) {
    console.error('API调用失败:', error);
    data.value = { error: error.message };
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
.api-response {
  margin-top: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  overflow: auto;
}
</style>