<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="评价列表" name="reviews">
        <el-card>
          <el-form :model="reviewQuery" inline style="margin-bottom: 16px">
            <el-form-item label="评分">
              <el-select v-model="reviewQuery.rating" placeholder="全部" clearable>
                <el-option label="5星" value="5" />
                <el-option label="4星" value="4" />
                <el-option label="3星" value="3" />
                <el-option label="2星" value="2" />
                <el-option label="1星" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="reviewQuery.status" placeholder="全部" clearable>
                <el-option label="待回复" value="pending" />
                <el-option label="已回复" value="replied" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="fetchReviews">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="csStore.reviews" v-loading="csStore.loading" stripe border>
            <el-table-column prop="orderNo" label="订单号" width="150" />
            <el-table-column prop="customerName" label="客户" width="100" />
            <el-table-column prop="rating" label="评分" width="80">
              <template #default="{ row }">
                <el-rate v-model="row.rating" disabled size="small" />
              </template>
            </el-table-column>
            <el-table-column prop="content" label="评价内容" min-width="200" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === 'replied' ? 'success' : 'warning'" size="small">{{ row.status === 'replied' ? '已回复' : '待回复' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reply" label="回复" min-width="160" show-overflow-tooltip />
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="{ row }">
                <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="showReplyDialog(row)">回复</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="意见反馈" name="feedbacks">
        <el-card>
          <el-table :data="csStore.feedbacks" v-loading="csStore.loading" stripe border>
            <el-table-column prop="customerName" label="客户" width="100" />
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }">{{ row.type === 'suggestion' ? '建议' : row.type === 'complaint' ? '投诉' : '其他' }}</template>
            </el-table-column>
            <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === 'processing' ? 'warning' : 'success'" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="handlerReply" label="处理回复" min-width="160" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="replyDialogVisible" title="回复评价" width="400px">
      <el-input v-model="replyContent" type="textarea" :rows="3" placeholder="回复内容" />
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReplyReview">回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCustomerServiceStore } from '@/stores/customer-service'
import { ElMessage } from 'element-plus'

const csStore = useCustomerServiceStore()
const activeTab = ref('reviews')
const replyDialogVisible = ref(false)
const replyContent = ref('')
const replyReviewId = ref('')

const reviewQuery = reactive({ rating: '', status: '', page: 1, pageSize: 20 })

const fetchReviews = () => csStore.fetchReviews(reviewQuery)

const showReplyDialog = (row) => {
  replyReviewId.value = row.id
  replyContent.value = ''
  replyDialogVisible.value = true
}

const handleReplyReview = async () => {
  await csStore.replyReview(replyReviewId.value, { reply: replyContent.value })
  ElMessage.success('回复成功')
  replyDialogVisible.value = false
  fetchReviews()
}

onMounted(() => {
  fetchReviews()
  csStore.fetchFeedbacks()
})
</script>