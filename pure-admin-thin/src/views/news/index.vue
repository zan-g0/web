<template>
  <div class="news-management">
    <el-card>
      <div class="flex justify-between items-center mb-4">
        <span class="text-2xl font-medium">新闻中心管理</span>
        <div>
          <el-button type="primary" @click="handleAdd">新增新闻</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        :cell-style="{ padding: '8px 12px' }"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" fixed="left" />
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
          fixed="left"
        />
        <el-table-column
          prop="id"
          label="ID"
          width="70"
          align="center"
          sortable
          fixed="left"
        />

        <el-table-column
          prop="title"
          label="标题"
          min-width="180"
          align="left"
          sortable
          fixed="left"
        >
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input
                v-model="editableRow.title"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 3 }"
                size="large"
              />
            </div>
            <div v-else class="title-text">{{ row.title }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="summary" label="摘要" min-width="200">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input
                v-model="editableRow.summary"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 4 }"
                size="large"
              />
            </div>
            <div v-else class="summary-text">
              {{ row.summary || "暂无摘要" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="封面图片" width="180" align="center">
          <template #default="{ row }">
            <div class="image-cell">
              <img
                v-if="row.cover_image"
                :src="getUploadUrl('news/' + row.cover_image)"
                class="cover-image"
                @error="onImageError"
              />
              <div v-else class="no-image-placeholder">
                <el-icon>
                  <Picture />
                </el-icon>
                <span>暂无图片</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="category"
          label="分类"
          width="130"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)" size="large">
              {{ getCategoryName(row.category) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="author"
          label="作者"
          width="85"
          align="center"
        />

        <el-table-column
          prop="views"
          label="浏览量"
          width="95"
          align="center"
          sortable
        >
          <template #default="{ row }">
            <span class="views-number">{{ row.views || 0 }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="is_active"
          label="启用"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-switch
              :model-value="row.is_active === 1"
              @change="val => onSwitchChange(row, val)"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="publish_date"
          label="发布日期"
          width="160"
          align="center"
          sortable
        >
          <template #default="{ row }">
            {{ formatDate(row.publish_date) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <template v-if="editingRowId === row.id">
                <el-button
                  size="large"
                  type="primary"
                  :loading="submitLoading"
                  @click="() => saveEdit(row)"
                  >保存</el-button
                >
                <el-button size="large" @click="cancelEdit">取消</el-button>
              </template>
              <template v-else>
                <el-button
                  size="large"
                  type="primary"
                  plain
                  @click="() => startEdit(row)"
                  >编辑</el-button
                >
                <el-button
                  size="large"
                  type="danger"
                  plain
                  @click="() => handleDelete(row)"
                  >删除</el-button
                >
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-between items-center mt-4">
        <div>
          <el-button
            type="danger"
            size="large"
            :disabled="!selectedIds.length"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
          <span class="ml-3 text-gray-500"
            >已选择 {{ selectedIds.length }} 项</span
          >
        </div>
        <el-pagination
          background
          layout="prev, pager, next, sizes, total"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框（保持不变） -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
    >
      <!-- 对话框内容保持不变 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        size="large"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入新闻标题" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-select
                v-model="form.category"
                placeholder="请选择分类"
                style="width: 100%"
              >
                <el-option label="公司新闻" value="company" />
                <el-option label="行业动态" value="industry" />
                <el-option label="产品资讯" value="product" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="form.author" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            rows="3"
            placeholder="请输入新闻摘要"
          />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            rows="6"
            placeholder="请输入新闻内容"
          />
        </el-form-item>

        <el-form-item label="封面图片" prop="cover_image">
          <div class="flex items-center">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileChange"
            />
            <el-button type="primary" size="large" @click="triggerUpload">
              <el-icon>
                <Upload />
              </el-icon>
              上传封面
            </el-button>
            <span v-if="uploading" class="ml-3 text-gray-500">上传中...</span>
          </div>

          <!-- 图片预览 -->
          <div v-if="previewUrl || form.cover_image" class="mt-3">
            <p class="text-sm text-gray-500 mb-2">预览：</p>
            <div class="relative inline-block">
              <img
                :src="previewUrl || getUploadUrl('news/' + form.cover_image)"
                style="
                  max-width: 200px;
                  max-height: 150px;
                  object-fit: cover;
                  border: 1px solid #eee;
                  border-radius: 4px;
                "
              />
              <el-button
                v-if="previewUrl || form.cover_image"
                type="danger"
                :icon="Delete"
                circle
                size="small"
                class="absolute -top-2 -right-2"
                @click="clearImage"
              />
            </div>
          </div>

          <div
            v-if="form.cover_image && !previewUrl"
            class="mt-2 text-sm text-gray-500"
          >
            当前图片: {{ form.cover_image }}
          </div>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="is_active">
              <el-switch
                v-model="form.is_active"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="禁用"
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布日期" prop="publish_date">
              <el-date-picker
                v-model="form.publish_date"
                type="datetime"
                placeholder="选择发布日期"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
                size="large"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button size="large" @click="dialogVisible = false">取消</el-button>
        <el-button
          size="large"
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
          >保存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import { Picture, Upload, Delete } from "@element-plus/icons-vue"; // 移除了 Search
import { getUploadUrl } from "@/router/urls";
import { uploadFile } from "@/api/upload";
import {
  getNewsList,
  createNews,
  updateNews,
  deleteNews,
  batchDeleteNews,
  updateNewsStatus
  // 移除了 searchNews
} from "@/api/news";
import dayjs from "dayjs";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  cover_image: string;
  category: string;
  author: string;
  is_active: number;
  views: number;
  publish_date: string;
  created_at: string;
  updated_at: string;
}

const loading = ref(false);
const tableData = ref<NewsItem[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const formRef = ref();
const submitLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const uploading = ref(false);
const selectedIds = ref<number[]>([]);

// 移除了 searchKeyword, filterCategory, filterStatus

const form = reactive({
  id: 0,
  title: "",
  summary: "",
  content: "",
  cover_image: "",
  category: "",
  author: "",
  is_active: 1,
  publish_date: ""
});

const rules: FormRules = {
  title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
  category: [{ required: true, message: "请选择分类", trigger: "change" }],
  author: [{ required: true, message: "作者不能为空", trigger: "blur" }]
};

const dialogTitle = computed(() => (form.id ? "编辑新闻" : "新增新闻"));

const initialized = ref(false);
const editingRowId = ref<number | null>(null);
const editableRow = reactive({
  title: "",
  summary: ""
});

const fetchList = async () => {
  loading.value = true;
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    };

    // 移除了筛选参数
    const res: any = await getNewsList(params);

    tableData.value = res.data || [];
    total.value = res.total || 0;
    initialized.value = true;
  } catch {
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchList);

const formatDate = (date: string) => {
  return date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-";
};

const getCategoryName = (category: string) => {
  const map: Record<string, string> = {
    company: "公司新闻",
    industry: "行业动态",
    product: "产品资讯"
  };
  return map[category] || category;
};

const getCategoryType = (category: string) => {
  const map: Record<string, string> = {
    company: "primary",
    industry: "success",
    product: "warning"
  };
  return map[category] || "info";
};

// 移除了 handleSearch 和 resetFilters

const handleSelectionChange = (selection: NewsItem[]) => {
  selectedIds.value = selection.map(item => item.id);
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  fetchList();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchList();
};

const handleSortChange = ({ prop, order }: any) => {
  if (!prop || !order) {
    fetchList();
    return;
  }
  const dir = order === "ascending" ? 1 : -1;
  tableData.value.sort((a: any, b: any) => {
    if (a[prop] === b[prop]) return 0;
    return a[prop] > b[prop] ? dir : -dir;
  });
};

const handleAdd = () => {
  form.id = 0;
  form.title = "";
  form.summary = "";
  form.content = "";
  form.cover_image = "";
  form.category = "";
  form.author = "";
  form.is_active = 1;
  form.publish_date = dayjs().format("YYYY-MM-DD HH:mm:ss");

  previewUrl.value = null;
  if (fileInput.value) fileInput.value.value = "";
  dialogVisible.value = true;
};

const startEdit = (row: NewsItem) => {
  editingRowId.value = row.id;
  editableRow.title = row.title;
  editableRow.summary = row.summary;
};

const cancelEdit = () => {
  editingRowId.value = null;
};

const saveEdit = async (originalRow: NewsItem) => {
  if (!editableRow.title || editableRow.title.trim() === "") {
    ElMessage.error("标题不能为空");
    return;
  }

  submitLoading.value = true;
  try {
    await updateNews(originalRow.id, {
      title: editableRow.title,
      summary: editableRow.summary
    });

    originalRow.title = editableRow.title;
    originalRow.summary = editableRow.summary;

    ElMessage.success("保存成功");
    editingRowId.value = null;
    fetchList();
  } catch {
    ElMessage.error("保存失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleDelete = (row: NewsItem) => {
  ElMessageBox.confirm("确认删除该新闻？", "提示", { type: "warning" })
    .then(async () => {
      try {
        await deleteNews(row.id);
        ElMessage.success("删除成功");
        fetchList();
      } catch {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

const handleBatchDelete = () => {
  if (!selectedIds.value.length) return;

  ElMessageBox.confirm(
    `确认删除选中的 ${selectedIds.value.length} 条新闻？`,
    "提示",
    { type: "warning" }
  )
    .then(async () => {
      try {
        await batchDeleteNews(selectedIds.value);
        ElMessage.success("批量删除成功");
        selectedIds.value = [];
        fetchList();
      } catch {
        ElMessage.error("批量删除失败");
      }
    })
    .catch(() => {});
};

const onSwitchChange = async (row: any, val: boolean) => {
  if (!initialized.value) return;

  const prevValue = row.is_active;
  const newValue = val ? 1 : 0;

  row.is_active = newValue;

  try {
    await updateNewsStatus(row.id, newValue);
    ElMessage.success(`新闻已${newValue === 1 ? "启用" : "禁用"}`);
  } catch (error) {
    console.error("状态更新失败:", error);
    row.is_active = prevValue;
    ElMessage.error("状态更新失败");
  }
};

const triggerUpload = () => {
  fileInput.value?.click();
};

const onFileChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || !files.length) return;

  const file = files[0];
  previewUrl.value = URL.createObjectURL(file);
  uploading.value = true;

  try {
    const res: any = await uploadFile(file, "news");
    if (res.success) {
      form.cover_image = res.data.fileName;
      ElMessage.success("图片上传成功");
    } else {
      ElMessage.error("图片上传失败：" + res.message);
      clearImage();
    }
  } catch {
    ElMessage.error("图片上传失败");
    clearImage();
  } finally {
    uploading.value = false;
    if (fileInput.value) fileInput.value.value = "";
  }
};

const clearImage = () => {
  previewUrl.value = null;
  form.cover_image = "";
  if (fileInput.value) fileInput.value.value = "";
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  submitLoading.value = true;

  try {
    const submitData = {
      title: form.title,
      summary: form.summary,
      content: form.content,
      cover_image: form.cover_image,
      category: form.category,
      author: form.author,
      is_active: form.is_active,
      publish_date: form.publish_date
    };

    if (form.id) {
      await updateNews(form.id, submitData);
      ElMessage.success("更新成功");
    } else {
      await createNews(submitData);
      ElMessage.success("新增成功");
    }
    dialogVisible.value = false;
    fetchList();
  } catch {
    ElMessage.error("保存失败");
  } finally {
    submitLoading.value = false;
  }
};

const onImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.style.display = "none";
  img.parentElement?.classList.add("image-error");
};
</script>

<style scoped>
/* 样式保持不变 */
.news-management .el-table th {
  padding: 12px 0;
  font-size: 1.15rem;
  font-weight: 600;
  background-color: #f5f7fa;
}

.news-management .el-table td {
  padding: 8px 12px;
  font-size: 1.15rem;
  vertical-align: top;
}

/* 穿透 Element Plus 样式 */
.news-management :deep(.el-table th .cell) {
  font-size: 1.15rem;
  font-weight: 600;
}

.news-management :deep(.el-table td .cell) {
  font-size: 1.15rem;
}

.title-text {
  font-weight: 500;
  color: #303133;
}

.summary-text {
  max-height: 80px;
  padding: 4px 8px;
  overflow-y: auto;
  font-size: 1.15rem;
  line-height: 1.5;
  background-color: #fafafa;
  border-radius: 4px;
}

.views-number {
  font-size: 1.15rem;
  font-weight: 500;
  color: #409eff;
}

.image-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.cover-image {
  width: 140px;
  height: 100px;
  object-fit: cover;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.action-buttons .el-button {
  padding: 10px 16px;
  font-size: 1.15rem;
}

.no-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 100px;
  font-size: 1.15rem;
  color: #909399;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

.no-image-placeholder .el-icon {
  margin-bottom: 4px;
  font-size: 2rem;
}

.hidden {
  display: none;
}

:deep(.el-tag--large) {
  height: auto;
  padding: 8px 12px;
  font-size: 1.15rem;
}
</style>
