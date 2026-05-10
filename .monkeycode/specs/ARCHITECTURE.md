# 系统架构设计文档

**项目名称**: CRMB 商城配送系统  
**更新日期**: 2026-05-10  
**版本**: v1.0

---

## 第一部分：整体架构

### 1.1 系统概述

CRMB商城配送系统是一个集成了B端管理后台和C端商城应用的综合性电商平台。系统采用前后端分离架构，支持多终端访问（Web管理后台、微信小程序）。

### 1.2 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 前端-B端 | Vue 3.3+ + Element Plus 2.x | Web管理后台 |
| 前端-C端 | UniApp (Vue3) + uView Plus 3.x | 微信小程序 |
| 状态管理 | Pinia 1.x | 跨平台状态管理 |
| HTTP客户端 | Axios 1.x (B端) / uni.request (C端) | API请求封装 |
| 后端 | Go (Gin/Echo) + GORM | RESTful API服务 |
| 数据库 | MySQL + Redis | 主数据库 + 缓存 |
| 地图服务 | 高德地图 JS API (B端) / 高德地图 UniApp SDK (C端) | 地理位置服务 |
| 文件存储 | MinIO | 自托管对象存储服务 |
| 消息队列 | RabbitMQ | 异步任务处理 |

### 1.3 架构图

```
┌─────────────────┐    ┌─────────────────┐
│   C端小程序     │    │   B端Web管理台   │
│  (UniApp)       │    │  (Vue3+Element) │
└────────┬────────┘    └────────┬────────┘
         │                      │
         │                      │
         └──────────┬───────────┘
                    │
            ┌───────▼───────┐
            │   API Gateway │
            │   (Nginx)     │
            └───────┬───────┘
                    │
        ┌───────────┼────────────┐
        │           │            │
┌───────▼─────┐ ┌───▼─────┐ ┌────▼──────┐
│  用户服务   │ │商品服务 │ │ 订单服务  │
│             │ │         │ │           │
└───────┬─────┘ └───┬─────┘ └────┬──────┘
        │           │            │
        └─────┬─────┴─────┬──────┘
              │           │
        ┌─────▼─────┐ ┌───▼──────┐
        │  支付服务 │ │ 仓储服务 │
        │           │ │          │
        └───────────┘ └──────────┘
```

---

## 第二部分：模块划分

### 2.1 核心业务模块

| 模块 | 负责人 | 主要功能 | 终端支持 |
|------|--------|----------|----------|
| 销售模块 | 销售团队 | 客户开发、拜访管理、店铺审核 | B端 + C端 |
| 商城模块 | 产品团队 | C端商城、商品展示、下单支付 | C端(小程序) |
| 云仓模块 | 仓储团队 | 出入库管理、库存管理、行政管理 | B端 + C端 |
| 采购模块 | 采购团队 | 供应商管理、采购订单、结算管理 | B端 |
| 财务模块 | 财务团队 | 财务核算、对账、报表 | B端 |
| 人事模块 | HR团队 | 员工管理、考勤、绩效 | B端 + C端 |
| 支付模块 | 支付团队 | 商家管理、收款管理 | B端 + C端 |
| 客服模块 | 客服团队 | 订单管理、售后处理、客诉 | B端 + C端 |
| 运营模块 | 运营团队 | 商品管理、活动管理、商家审核 | B端 |
| 数据中心 | 数据团队 | 数据查询、统计分析、报表导出 | B端 |
| 直配模块 | 物流团队 | 线路管理、配送管理、轨迹跟踪 | B端 + C端 |
| 供应商模块 | 供应商 | 订单管理、发货管理、对账 | B端 |

### 2.2 公共服务模块

- **认证授权服务**: JWT Token + RBAC权限控制
- **文件服务**: 阿里云OSS文件上传下载
- **消息服务**: 站内信、短信、微信模板消息
- **日志服务**: 操作日志、访问日志
- **监控服务**: 系统监控、业务监控

---

## 第第三部分：部署架构

### 3.1 开发环境

- **前端**: 本地开发服务器 (Vite)
- **后端**: 本地Go服务 (Gin/Echo框架)
- **数据库**: 本地MySQL + Redis
- **调试工具**: Chrome DevTools, UniApp调试器, Delve (Go调试器)

### 3.2 生产环境

- **CDN**: 静态资源CDN加速
- **负载均衡**: Nginx集群
- **应用服务器**: Docker容器化部署
- **数据库**: MySQL主从复制 + Redis集群
- **监控告警**: Prometheus + Grafana

---

## 第四部分：移动端专项说明

### 4.1 UniApp开发规范

#### 技术栈
- **框架**: UniApp (Vue3 Composition API)
- **UI组件库**: uView Plus 3.x
- **状态管理**: Pinia 1.x
- **网络请求**: uni.request 封装
- **地图服务**: 高德地图 UniApp SDK
- **微信能力**: 微信登录、微信支付、模板消息

#### 目录结构
```
src/
├── pages/                 # 页面文件
├── components/            # 组件
├── stores/                # 状态管理
├── api/                   # API封装
├── utils/                 # 工具函数
├── static/                # 静态资源
├── manifest.json          # 应用配置
└── pages.json             # 页面路由配置
```

#### 微信小程序特有功能
1. **微信登录**: 使用 wx.login 获取 code
2. **微信支付**: 调用微信支付API
3. **地理位置**: 获取用户位置信息
4. **扫码功能**: 商品扫码、订单扫码
5. **模板消息**: 订单状态通知
6. **分享功能**: 商品分享、订单分享

### 4.2 跨平台兼容性

| 功能 | H5(Web) | 微信小程序 | App | 备注 |
|------|---------|------------|-----|------|
| 地图 | 高德JS API | 高德UniApp SDK | 高德Native SDK | 统一接口封装 |
| 支付 | 微信JSAPI | 微信小程序支付 | 微信Native支付 | 条件编译 |
| 登录 | 微信OAuth2.0 | 微信小程序登录 | 微信Native登录 | 条件编译 |
| 文件上传 | HTML5 File API | uni.chooseImage | Native File API | 条件编译 |

---

## 第五部分：API设计规范

### 5.1 接口规范

- **基础路径**: `/api/{module}`
- **请求方法**: RESTful风格 (GET/POST/PUT/DELETE)
- **响应格式**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {}
  }
  ```
- **错误码**: 统一错误码规范
- **认证**: Bearer Token (JWT)

### 5.2 版本管理

- **当前版本**: 无版本号 (v1隐式)
- **未来扩展**: 如需版本升级，采用路径版本 `/api/v2/{module}`

### 5.3 跨域处理

- **开发环境**: Vite proxy配置
- **生产环境**: Nginx反向代理

---

## 第六部分：安全架构

### 6.1 认证授权
- **JWT Token**: 无状态认证
- **RBAC**: 基于角色的权限控制
- **数据权限**: 行级数据权限控制

### 6.2 数据安全
- **敏感数据加密**: 密码、手机号等
- **XSS防护**: 前端输入过滤
- **CSRF防护**: Token验证
- **SQL注入防护**: 参数化查询

### 6.3 网络安全
- **HTTPS**: 全站HTTPS
- **CSP**: 内容安全策略
- **Rate Limit**: 接口限流

---

## 第七部分：性能优化

### 7.1 前端优化
- **代码分割**: 按路由懒加载
- **图片优化**: WebP格式 + CDN
- **缓存策略**: HTTP缓存 + 本地缓存
- **虚拟滚动**: 大数据列表优化

### 7.2 后端优化

- **数据库索引**: 关键字段索引
- **Redis缓存**: 热点数据缓存
- **异步处理**: 耗时操作异步化 (Goroutines)
- **连接池**: 数据库连接池 (GORM连接池)
- **内存优化**: Go内存分配优化
- **并发控制**: Goroutines + Channels 并发模式

---

## 第九部分：MinIO文件服务配置

### 9.1 MinIO简介

MinIO是一个高性能、分布式对象存储系统，兼容Amazon S3 API。适用于存储非结构化数据，如图片、视频、日志文件、备份等。

### 9.2 部署配置

#### 开发环境
```yaml
# docker-compose.yml
version: '3.8'
services:
  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - ./data:/data
    command: server /data --console-address ":9001"
```

#### 生产环境
- **集群模式**: 4节点以上部署
- **存储后端**: 使用SSD或高性能磁盘
- **网络配置**: 专用网络接口
- **安全配置**: TLS加密、访问控制

### 9.3 Go后端集成

#### 依赖包
```go
import (
    "github.com/minio/minio-go/v7"
    "github.com/minio/minio-go/v7/pkg/credentials"
)
```

#### 客户端初始化
```go
// internal/config/minio.go
func NewMinioClient() (*minio.Client, error) {
    endpoint := viper.GetString("minio.endpoint")
    accessKeyID := viper.GetString("minio.access_key_id")
    secretAccessKey := viper.GetString("minio.secret_access_key")
    useSSL := viper.GetBool("minio.use_ssl")
    
    client, err := minio.New(endpoint, &minio.Options{
        Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
        Secure: useSSL,
    })
    if err != nil {
        return nil, err
    }
    
    // 检查bucket是否存在，不存在则创建
    bucketName := viper.GetString("minio.bucket_name")
    exists, err := client.BucketExists(context.Background(), bucketName)
    if err != nil {
        return nil, err
    }
    if !exists {
        err = client.MakeBucket(context.Background(), bucketName, minio.MakeBucketOptions{})
        if err != nil {
            return nil, err
        }
    }
    
    return client, nil
}
```

#### 文件上传服务
```go
// internal/service/file_service.go
type FileService struct {
    minioClient *minio.Client
    bucketName  string
}

func (s *FileService) UploadFile(ctx context.Context, file io.Reader, size int64, fileName string, contentType string) (string, error) {
    // 生成唯一文件名
    ext := filepath.Ext(fileName)
    uniqueName := fmt.Sprintf("%s%s", uuid.New().String(), ext)
    
    // 设置对象元数据
    objectInfo, err := s.minioClient.PutObject(
        ctx,
        s.bucketName,
        uniqueName,
        file,
        size,
        minio.PutObjectOptions{
            ContentType: contentType,
        },
    )
    if err != nil {
        return "", err
    }
    
    // 返回文件URL
    fileURL := fmt.Sprintf("/api/files/%s", uniqueName)
    return fileURL, nil
}

func (s *FileService) GetFileURL(fileName string) string {
    return fmt.Sprintf("/api/files/%s", fileName)
}
```

#### 文件下载Handler
```go
// internal/handler/file_handler.go
func (h *FileHandler) DownloadFile(c *gin.Context) {
    fileName := c.Param("filename")
    
    // 验证文件名安全性
    if !isValidFileName(fileName) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid filename"})
        return
    }
    
    // 获取文件对象
    object, err := h.minioClient.GetObject(
        context.Background(),
        h.bucketName,
        fileName,
        minio.GetObjectOptions{},
    )
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
        return
    }
    defer object.Close()
    
    // 获取文件信息
    stat, err := object.Stat()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get file info"})
        return
    }
    
    // 设置响应头
    c.Header("Content-Type", stat.ContentType)
    c.Header("Content-Length", strconv.FormatInt(stat.Size, 10))
    c.Header("Content-Disposition", fmt.Sprintf("inline; filename=\"%s\"", filepath.Base(fileName)))
    
    // 流式传输文件
    io.Copy(c.Writer, object)
}
```

### 9.4 前端集成

#### 文件上传组件
```vue
<!-- src/components/FileUpload.vue -->
<template>
  <div class="file-upload">
    <input 
      type="file" 
      @change="handleFileSelect"
      :accept="acceptTypes"
      multiple
    />
    <div v-if="uploading">上传中...</div>
    <div v-for="file in uploadedFiles" :key="file.id">
      <img :src="file.url" v-if="isImage(file.type)" />
      <a :href="file.url" v-else>{{ file.name }}</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import fileApi from '@/api/file'

const props = defineProps({
  acceptTypes: {
    type: String,
    default: 'image/*,.pdf,.doc,.docx'
  }
})

const uploadedFiles = ref([])
const uploading = ref(false)

const handleFileSelect = async (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return
  
  uploading.value = true
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fileApi.uploadFile(formData)
      uploadedFiles.value.push({
        id: response.data.id,
        name: file.name,
        type: file.type,
        url: response.data.url
      })
    }
  } catch (error) {
    console.error('Upload failed:', error)
  } finally {
    uploading.value = false
  }
}

const isImage = (type) => type.startsWith('image/')
</script>
```

#### API封装
```javascript
// src/api/file.js
import request from '@/utils/request'

export function uploadFile(formData) {
  return request({
    url: '/api/files/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function deleteFile(fileId) {
  return request({
    url: `/api/files/${fileId}`,
    method: 'DELETE'
  })
}
```

### 9.5 各模块文件使用场景

| 模块 | 文件类型 | 存储路径 | 访问权限 |
|------|----------|----------|----------|
| 销售模块 | 店铺资质图片、拜访图片 | sales/stores/{id}/ | 商家可见 |
| 云仓模块 | 商品图片、质检图片 | warehouse/products/{sku}/ | 内部系统 |
| 人事模块 | 员工头像、证件扫描件 | hr/staff/{id}/ | HR管理员 |
| 财务模块 | 发票、合同扫描件 | finance/documents/{id}/ | 财务人员 |
| 客服模块 | 客诉图片、聊天记录 | customer-service/complaints/{id}/ | 客服人员 |

### 9.6 安全配置

- **访问控制**: 基于JWT Token的权限验证
- **文件类型限制**: 只允许上传指定MIME类型的文件
- **文件大小限制**: 单文件最大100MB
- **病毒扫描**: 集成ClamAV进行文件病毒扫描
- **敏感信息过滤**: 对上传的文档进行敏感信息检测

### 9.7 性能优化

- **CDN加速**: 生产环境配置CDN缓存
- **分片上传**: 大文件支持分片上传
- **压缩处理**: 图片自动压缩和格式转换
- **缓存策略**: 静态文件设置长期缓存

---