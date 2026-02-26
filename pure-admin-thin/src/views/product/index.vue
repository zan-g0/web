<template>
  <div class="products-management">
    <el-card>
      <div class="flex justify-between items-center mb-4">
        <span class="text-2xl font-medium">产品管理</span>
        <div>
          <el-button type="primary" @click="handleAdd">新增产品</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        :row-style="{ height: '100px' }"
        :cell-style="{ padding: '12px 0' }"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column
          type="index"
          label="序号"
          width="70"
          align="center"
          fixed="left"
        />
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
          sortable
          fixed="left"
        />

        <el-table-column
          prop="name"
          label="产品名称"
          width="200"
          align="left"
          sortable
          fixed="left"
        >
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.name" size="large" />
            </div>
            <div v-else class="name-text">{{ row.name }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="产品描述" min-width="300">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input
                v-model="editableRow.description"
                type="textarea"
                rows="3"
                size="large"
              />
            </div>
            <div v-else class="description-text">
              {{ row.description || "暂无描述" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="产品图片" width="200" align="center">
          <template #default="{ row }">
            <div class="image-cell">
              <img
                v-if="row.image_name"
                :src="getUploadUrl('product/' + row.image_name)"
                class="product-image"
                @error="onImageError"
              />
              <div v-else class="no-image-placeholder">
                <el-icon><Picture /></el-icon>
                <span>暂无图片</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="display_order"
          label="排序"
          width="100"
          align="center"
          sortable
        >
          <template #default="{ row }">
            <div v-if="editingRowId === row.id" class="flex justify-center">
              <el-input-number
                v-model="editableRow.display_order"
                :min="0"
                :max="999"
                controls-position="right"
                size="large"
                style="width: 100px"
              />
            </div>
            <div v-else class="order-number">{{ row.display_order }}</div>
          </template>
        </el-table-column>

        <el-table-column
          prop="is_active"
          label="状态"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-switch
              :model-value="row.is_active === 1"
              size="large"
              active-text="启用"
              inactive-text="禁用"
              @change="val => onSwitchChange(row, val)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="280" align="center" fixed="right">
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        size="large"
      >
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入产品名称" />
        </el-form-item>

        <el-form-item label="产品描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            rows="4"
            placeholder="请输入产品描述"
          />
        </el-form-item>

        <el-form-item label="产品图片" prop="image_name">
          <div class="flex items-center">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileChange"
            />
            <el-button type="primary" size="large" @click="triggerUpload">
              <el-icon><Upload /></el-icon> 上传图片
            </el-button>
            <span v-if="uploading" class="ml-3 text-gray-500">上传中...</span>
          </div>

          <!-- 图片预览 -->
          <div v-if="previewUrl || form.image_name" class="mt-3">
            <p class="text-sm text-gray-500 mb-2">预览：</p>
            <div class="relative inline-block">
              <img
                :src="previewUrl || getUploadUrl('product/' + form.image_name)"
                style="
                  max-width: 200px;
                  max-height: 150px;
                  object-fit: cover;
                  border: 1px solid #eee;
                  border-radius: 4px;
                "
              />
              <el-button
                v-if="previewUrl || form.image_name"
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
            v-if="form.image_name && !previewUrl"
            class="mt-2 text-sm text-gray-500"
          >
            当前图片: {{ form.image_name }}
          </div>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序" prop="display_order">
              <el-input-number
                v-model="form.display_order"
                :min="0"
                :max="999"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
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
import { Picture, Upload, Delete } from "@element-plus/icons-vue";
import { getUploadUrl } from "@/router/urls";
import { uploadFile } from "@/api/upload";
import {
  getProductsList,
  createProduct,
  updateProduct,
  deleteProduct,
  batchDeleteProducts,
  updateProductStatus
} from "@/api/products";

interface ProductItem {
  id: number;
  name: string;
  description: string;
  image_name: string;
  display_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

const loading = ref(false);
const tableData = ref<ProductItem[]>([]);
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

const form = reactive({
  id: 0,
  name: "",
  description: "",
  image_name: "",
  display_order: 0,
  is_active: 1
});

const rules: FormRules = {
  name: [{ required: true, message: "产品名称不能为空", trigger: "blur" }]
};

const dialogTitle = computed(() => (form.id ? "编辑产品" : "新增产品"));

const initialized = ref(false);
const editingRowId = ref<number | null>(null);
const editableRow = reactive({
  name: "",
  description: "",
  display_order: 0
});

const fetchList = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    };

    const res: any = await getProductsList(params);

    tableData.value = res.data || [];
    total.value = res.total || 0;
    initialized.value = true;
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchList);

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

const handleSelectionChange = (selection: ProductItem[]) => {
  selectedIds.value = selection.map(item => item.id);
};

const handleAdd = () => {
  form.id = 0;
  form.name = "";
  form.description = "";
  form.image_name = "";

  // 计算最大排序值
  const maxOrder = tableData.value.length
    ? Math.max(...tableData.value.map(r => Number(r.display_order) || 0))
    : 0;
  form.display_order = maxOrder + 1;

  form.is_active = 1;

  previewUrl.value = null;
  if (fileInput.value) fileInput.value.value = "";
  dialogVisible.value = true;
};

const startEdit = (row: ProductItem) => {
  editingRowId.value = row.id;
  editableRow.name = row.name;
  editableRow.description = row.description;
  editableRow.display_order = Number(row.display_order) || 0;
};

const cancelEdit = () => {
  editingRowId.value = null;
};

const saveEdit = async (originalRow: ProductItem) => {
  if (!editableRow.name || editableRow.name.trim() === "") {
    ElMessage.error("产品名称不能为空");
    return;
  }
  if (
    editableRow.display_order === null ||
    editableRow.display_order === undefined ||
    isNaN(Number(editableRow.display_order))
  ) {
    ElMessage.error("排序不能为空且为数字");
    return;
  }

  submitLoading.value = true;
  try {
    await updateProduct(originalRow.id, {
      name: editableRow.name,
      description: editableRow.description,
      display_order: Number(editableRow.display_order)
    });

    originalRow.name = editableRow.name;
    originalRow.description = editableRow.description;
    originalRow.display_order = Number(editableRow.display_order);

    ElMessage.success("保存成功");
    editingRowId.value = null;
    fetchList();
  } catch (error) {
    console.error("保存失败:", error);
    ElMessage.error("保存失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleDelete = (row: ProductItem) => {
  ElMessageBox.confirm("确认删除该产品？", "提示", { type: "warning" })
    .then(async () => {
      try {
        await deleteProduct(row.id);
        ElMessage.success("删除成功");
        fetchList();
      } catch (error) {
        console.error("删除失败:", error);
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

const handleBatchDelete = () => {
  if (!selectedIds.value.length) return;

  ElMessageBox.confirm(
    `确认删除选中的 ${selectedIds.value.length} 个产品？`,
    "提示",
    { type: "warning" }
  )
    .then(async () => {
      try {
        await batchDeleteProducts(selectedIds.value);
        ElMessage.success("批量删除成功");
        selectedIds.value = [];
        fetchList();
      } catch (error) {
        console.error("批量删除失败:", error);
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
    await updateProductStatus(row.id, newValue);
    ElMessage.success(`产品已${newValue === 1 ? "启用" : "禁用"}`);
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
    const res: any = await uploadFile(file, "product");
    if (res.success) {
      form.image_name = res.data.fileName;
      ElMessage.success("图片上传成功");
    } else {
      ElMessage.error("图片上传失败：" + res.message);
      clearImage();
    }
  } catch (error) {
    console.error("图片上传失败:", error);
    ElMessage.error("图片上传失败");
    clearImage();
  } finally {
    uploading.value = false;
    if (fileInput.value) fileInput.value.value = "";
  }
};

const clearImage = () => {
  previewUrl.value = null;
  form.image_name = "";
  if (fileInput.value) fileInput.value.value = "";
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  submitLoading.value = true;

  try {
    const submitData = {
      name: form.name,
      description: form.description,
      image_name: form.image_name,
      display_order: form.display_order,
      is_active: form.is_active
    };

    if (form.id) {
      await updateProduct(form.id, submitData);
      ElMessage.success("更新成功");
    } else {
      await createProduct(submitData);
      ElMessage.success("新增成功");
    }
    dialogVisible.value = false;
    fetchList();
  } catch (error) {
    console.error("保存失败:", error);
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
.products-management .el-table th {
  padding: 15px 0;
  font-size: 1.2rem;
  font-weight: 600;
  background-color: #f5f7fa;
}

.products-management .el-table td {
  padding: 15px 0;
  font-size: 1.15rem;
}

.name-text {
  font-weight: 500;
  color: #303133;
}

.description-text {
  max-height: 80px;
  padding: 4px 8px;
  overflow-y: auto;
  font-size: 1.1rem;
  line-height: 1.5;
  background-color: #fafafa;
  border-radius: 4px;
}

.order-number {
  font-size: 1.2rem;
  font-weight: 500;
  color: #409eff;
}

.image-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.product-image {
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
  font-size: 1.1rem;
}

.no-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 100px;
  font-size: 1rem;
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

:deep(.el-switch) {
  --el-switch-on-color: #67c23a;
  --el-switch-off-color: #909399;
}

:deep(.el-switch__label) {
  font-size: 1rem;
}
</style>
