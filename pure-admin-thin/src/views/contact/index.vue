<template>
  <div class="contact-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>联系方式管理</h2>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 主要内容 -->
    <div v-else class="content-container">
      <!-- 显示模式 -->
      <div v-if="!isEditing" class="display-mode">
        <div class="info-card">
          <div class="card-header">
            <span class="header-title">联系信息</span>
            <el-button type="primary" size="large" @click="handleEdit">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
          </div>

          <div class="info-content">
            <!-- 无数据状态 -->
            <div v-if="!contactData" class="empty-state">
              <el-empty description="暂无联系信息">
                <el-button type="primary" size="large" @click="handleEdit"
                  >添加信息</el-button
                >
              </el-empty>
            </div>

            <!-- 数据显示 -->
            <div v-else class="info-grid">
              <div class="info-item">
                <div class="item-label">公司电话：</div>
                <div class="item-value">{{ contactData.company_phone }}</div>
              </div>

              <div class="info-item">
                <div class="item-label">服务电话：</div>
                <div class="item-value">{{ contactData.service_phone }}</div>
              </div>

              <div class="info-item">
                <div class="item-label">电子邮箱：</div>
                <div class="item-value">{{ contactData.email }}</div>
              </div>

              <div class="info-item">
                <div class="item-label">邮政编码：</div>
                <div class="item-value">{{ contactData.postal_code }}</div>
              </div>

              <div class="info-item full-width">
                <div class="item-label">公司地址：</div>
                <div class="item-value">{{ contactData.address }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 编辑模式 -->
      <div v-else class="edit-mode">
        <div class="info-card">
          <div class="card-header">
            <span class="header-title">{{
              contactData ? "编辑联系信息" : "添加联系信息"
            }}</span>
          </div>

          <div class="edit-content">
            <el-form
              ref="formRef"
              :model="formData"
              :rules="rules"
              label-width="120px"
              label-position="right"
              size="large"
            >
              <el-form-item label="公司电话" prop="company_phone">
                <el-input
                  v-model="formData.company_phone"
                  placeholder="请输入公司电话"
                  clearable
                />
              </el-form-item>

              <el-form-item label="服务电话" prop="service_phone">
                <el-input
                  v-model="formData.service_phone"
                  placeholder="请输入服务电话"
                  clearable
                />
              </el-form-item>

              <el-form-item label="电子邮箱" prop="email">
                <el-input
                  v-model="formData.email"
                  placeholder="请输入电子邮箱"
                  clearable
                />
              </el-form-item>

              <el-form-item label="邮政编码" prop="postal_code">
                <el-input
                  v-model="formData.postal_code"
                  placeholder="请输入邮政编码"
                  clearable
                />
              </el-form-item>

              <el-form-item label="公司地址" prop="address">
                <el-input
                  v-model="formData.address"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入公司地址"
                />
              </el-form-item>
            </el-form>
          </div>

          <div class="form-actions">
            <el-button size="large" @click="handleCancel">取消</el-button>
            <el-button
              type="primary"
              size="large"
              :loading="submitting"
              @click="handleSubmit"
            >
              保存
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { Edit } from "@element-plus/icons-vue";
import { getContactInfo, updateContactInfo } from "@/api/contact";

// 状态变量
const loading = ref(false);
const submitting = ref(false);
const isEditing = ref(false);
const contactInfoList = ref([]);

// 计算属性：获取第一条联系信息
const contactData = computed(() => {
  if (contactInfoList.value && contactInfoList.value.length > 0) {
    return contactInfoList.value[0];
  }
  return null;
});

// 表单数据
const formData = reactive({
  company_phone: "",
  service_phone: "",
  email: "",
  postal_code: "",
  address: ""
});

// 表单验证规则
const rules = {
  email: [{ type: "email", message: "请输入有效的电子邮箱", trigger: "blur" }],
  postal_code: [
    { pattern: /^\d{6}$/, message: "邮政编码应为6位数字", trigger: "blur" }
  ]
};

// 表单引用
const formRef = ref();

// 获取联系信息
const fetchContactInfo = async () => {
  loading.value = true;
  try {
    const response = await getContactInfo();

    // 处理响应数据
    if (response && response.data) {
      contactInfoList.value = Array.isArray(response.data)
        ? response.data
        : [response.data];
    } else if (Array.isArray(response)) {
      contactInfoList.value = response;
    } else if (response && typeof response === "object") {
      contactInfoList.value = [response];
    } else {
      contactInfoList.value = [];
    }
  } catch (error) {
    console.error("获取联系信息失败:", error);
    ElMessage.error("获取联系信息失败");
    contactInfoList.value = [];
  } finally {
    loading.value = false;
  }
};

// 编辑按钮点击
const handleEdit = () => {
  if (contactData.value) {
    Object.assign(formData, {
      company_phone: contactData.value.company_phone || "",
      service_phone: contactData.value.service_phone || "",
      email: contactData.value.email || "",
      postal_code: contactData.value.postal_code || "",
      address: contactData.value.address || ""
    });
  } else {
    Object.keys(formData).forEach(key => {
      formData[key] = "";
    });
  }
  isEditing.value = true;
};

// 取消编辑
const handleCancel = () => {
  isEditing.value = false;
  formRef.value?.resetFields();
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate();

    submitting.value = true;

    if (contactData.value && contactData.value.id) {
      await updateContactInfo(contactData.value.id, formData);
      ElMessage.success("更新成功");
    } else {
      ElMessage.success("保存成功");
    }

    await fetchContactInfo();
    isEditing.value = false;
  } catch (error) {
    console.error("保存失败:", error);
    ElMessage.error("保存失败");
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchContactInfo();
});
</script>

<style scoped>


/* 响应式调整 */
@media (width <= 768px) {
  .contact-management {
    padding: 16px;
  }

  .card-header {
    padding: 20px 24px;
  }

  .info-content,
  .edit-content {
    padding: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .info-item.full-width {
    grid-column: auto;
  }

  .info-item {
    flex-direction: column;
    line-height: 32px;
  }

  .item-label {
    width: auto;
    margin-bottom: 4px;
  }

  .form-actions {
    padding: 20px 24px;
  }
}

.contact-management {
  min-height: 100%;
  padding: 24px;
  background-color: #f5f7fa;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #1f2f3d;
}

.loading-container {
  padding: 48px;
  background: #fff;
  border-radius: 12px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  overflow: hidden;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px 0 rgb(0 0 0 / 8%);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #ebeef5;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2f3d;
}

.info-content {
  padding: 32px;
}

.empty-state {
  padding: 80px 0;
  text-align: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.info-item {
  display: flex;
  font-size: 16px;
  line-height: 40px;
}

.info-item.full-width {
  grid-column: span 2;
}

.item-label {
  width: 120px;
  font-size: 16px;
  font-weight: 400;
  color: #8c8c8c;
}

.item-value {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: #1f2f3d;
}

.edit-content {
  padding: 32px;
}

.edit-content :deep(.el-form-item) {
  margin-bottom: 24px;
}

.edit-content :deep(.el-form-item__label) {
  font-size: 16px;
  font-weight: 500;
  color: #1f2f3d;
}

.edit-content :deep(.el-input__wrapper) {
  font-size: 16px;
}

.edit-content :deep(.el-textarea__inner) {
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 24px 32px;
  background: #fafafa;
  border-top: 1px solid #ebeef5;
}

.form-actions :deep(.el-button) {
  padding: 12px 24px;
  font-size: 16px;
}
</style>
