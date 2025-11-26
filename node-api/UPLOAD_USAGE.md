# Upload Controller 使用指南

## 概述

新的上传控制器支持将图片上传到不同的文件夹中，便于管理不同类型的图片资源。

## 支持的上传类型

| 类型 | 文件夹路径 | 说明 |
|------|------------|------|
| banners | `/uploads/banners/` | 轮播图 |
| products | `/uploads/products/` | 产品图片 |
| profiles | `/uploads/profiles/` | 个人资料图片 |
| company | `/uploads/company/` | 公司相关图片 |
| news | `/uploads/news/` | 新闻图片 |
| general | `/uploads/general/` | 通用图片 |

## API 接口

### 1. 专用上传接口

```http
POST /api/upload/{type}
```

**参数:**
- `file`: 图片文件 (multipart/form-data)
- `newName`: 自定义文件名 (可选)

**示例:**
```http
POST /api/upload/banner
Content-Type: multipart/form-data

file: [图片文件]
newName: home-banner-1.jpg
```

### 2. 动态类型上传接口

```http
POST /api/upload/dynamic
```

**参数:**
- `file`: 图片文件 (multipart/form-data)
- `type`: 上传类型 (可选，默认为 general)
- `newName`: 自定义文件名 (可选)

### 3. 获取上传类型信息

```http
GET /api/upload/types
```

## 返回格式

### 成功响应
```json
{
  "success": true,
  "message": "上传成功",
  "data": {
    "fileName": "home-banner-1_1701234567890_abc123.jpg",
    "filePath": "/uploads/banners/home-banner-1_1701234567890_abc123.jpg",
    "originalName": "home-banner-1.jpg",
    "size": 1024000,
    "mimetype": "image/jpeg",
    "uploadType": "banners"
  }
}
```

### 错误响应
```json
{
  "success": false,
  "message": "上传失败",
  "error": "错误详情"
}
```

## PureAdmin 前端集成示例

### 1. 使用 Axios 上传

```javascript
import axios from 'axios';

// 上传轮播图
const uploadBanner = async (file, customName) => {
  const formData = new FormData();
  formData.append('file', file);
  if (customName) {
    formData.append('newName', customName);
  }
  
  try {
    const response = await axios.post('/api/upload/banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('上传失败:', error);
    throw error;
  }
};

// 动态类型上传
const uploadDynamic = async (file, type = 'general', customName) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  if (customName) {
    formData.append('newName', customName);
  }
  
  try {
    const response = await axios.post('/api/upload/dynamic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('上传失败:', error);
    throw error;
  }
};
```

### 2. Element Plus 上传组件配置

```vue
<template>
  <el-upload
    action="/api/upload/banner"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-upload="beforeUpload"
    :data="{ newName: customFileName }"
    accept="image/*"
  >
    <el-button type="primary">上传轮播图</el-button>
  </el-upload>
</template>

<script setup>
const customFileName = ref('');

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!');
    return false;
  }
  
  return true;
};

const handleSuccess = (response, uploadFile) => {
  if (response.success) {
    ElMessage.success('上传成功!');
    console.log('文件路径:', response.data.filePath);
  } else {
    ElMessage.error(response.message);
  }
};

const handleError = (error) => {
  ElMessage.error('上传失败!');
  console.error('上传错误:', error);
};
</script>
```

## 特性说明

1. **自动文件夹创建**: 上传时自动创建对应的文件夹
2. **唯一文件名**: 如果不指定自定义文件名，会自动生成带时间戳的唯一文件名
3. **图片格式验证**: 只允许上传图片格式的文件
4. **文件大小限制**: 默认限制 5MB
5. **向后兼容**: 原有的 `/api/upload/` 接口仍然可用
6. **类型验证**: 动态上传时验证上传类型的有效性

## 注意事项

1. 确保 `uploads` 目录有写入权限
2. 上传路径返回的是相对路径，前端需要配合静态文件服务使用
3. 可以根据需要调整文件大小限制和允许的文件类型
4. 自定义文件名会保留原始文件的扩展名
