<template>
  <div>
    <el-page-header @back="router.push('/sales/visits')" content="新建拜访" style="margin-bottom: 16px" />
    <el-card>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 600px">
        <el-form-item label="客户" prop="customerId">
          <el-select v-model="form.customerId" placeholder="请选择客户" filterable>
            <el-option v-for="c in customerOptions" :key="c.id" :label="c.customerName" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="拜访类型" prop="visitType">
          <el-select v-model="form.visitType" placeholder="请选择">
            <el-option label="首次拜访" value="first" />
            <el-option label="定期回访" value="regular" />
            <el-option label="重点跟进" value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="拜访方式" prop="visitMethod">
          <el-select v-model="form.visitMethod" placeholder="请选择">
            <el-option label="上门" value="onsite" />
            <el-option label="电话" value="phone" />
            <el-option label="线上" value="online" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划日期" prop="planDate">
          <el-date-picker v-model="form.planDate" type="date" placeholder="请选择日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="拜访主题" prop="subject">
          <el-input v-model="form.subject" placeholder="请输入拜访主题" />
        </el-form-item>
        <el-form-item label="拜访内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请输入拜访内容" />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload action="/api/files/upload" list-type="picture-card" :limit="5" :on-success="handleUploadSuccess" :on-remove="handleRemove">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">提交</el-button>
          <el-button @click="router.push('/sales/visits')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const salesStore = useSalesStore()
const formRef = ref(null)
const submitting = ref(false)
const customerOptions = ref([])
const uploadedImages = ref([])

const form = reactive({
  customerId: '',
  visitType: '',
  visitMethod: '',
  planDate: '',
  subject: '',
  content: ''
})

const rules = {
  customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
  visitType: [{ required: true, message: '请选择拜访类型', trigger: 'change' }],
  visitMethod: [{ required: true, message: '请选择拜访方式', trigger: 'change' }],
  planDate: [{ required: true, message: '请选择计划日期', trigger: 'change' }],
  subject: [{ required: true, message: '请输入拜访主题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入拜访内容', trigger: 'blur' }]
}

const handleUploadSuccess = (response) => {
  uploadedImages.value.push({ id: response.data.id, url: response.data.url, name: response.data.name })
}

const handleRemove = (file) => {
  uploadedImages.value = uploadedImages.value.filter(i => i.url !== file.url)
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    const data = { ...form, images: uploadedImages.value }
    await salesStore.createVisit(data)
    ElMessage.success('创建成功')
    router.push('/sales/visits')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await salesStore.fetchPublicCustomers({ pageSize: 100 })
  customerOptions.value = salesStore.publicCustomers
  await salesStore.fetchPrivateCustomers({ pageSize: 100 })
  customerOptions.value = [...customerOptions.value, ...salesStore.privateCustomers]
})
</script>