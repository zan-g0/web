<template>
  <div class="honor-management">
    <el-card>
      <div class="flex justify-between items-center mb-4">
        <span class="text-2xl font-medium">荣誉资质管理</span>
        <div>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </div>

      <el-table :data="tableData" stripe border style="width:100%" @sort-change="handleSortChange" :row-style="{ height: '80px' }" :cell-style="{ padding: '12px 0' }">
        <el-table-column type="index" label="序号" width="70" align="center" fixed="left" />
        <el-table-column prop="id" label="ID" width="80" align="center" sortable fixed="left" />

        <el-table-column prop="title" label="标题" width="180" align="center" sortable fixed="left">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.title" size="large" />
            </div>
            <div v-else class="title-text">{{ row.title }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="描述" min-width="280">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input type="textarea" v-model="editableRow.description" rows="3" size="large" />
            </div>
            <div v-else class="description-text">{{ row.description || '暂无描述' }}</div>
          </template>
        </el-table-column>

        <el-table-column label="图片" width="200" align="center">
          <template #default="{ row }">
            <div class="image-cell">
              <img 
                v-if="row.image" 
                :src="getUploadUrl('honor/' + row.image)" 
                class="honor-image"
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

        <el-table-column prop="order" label="排序" width="100" align="center" sortable>
          <template #default="{ row }">
            <div v-if="editingRowId === row.id" class="flex justify-center">
              <el-input-number v-model="editableRow.order" :min="0" :max="999" controls-position="right" size="large"
                style="width:100px;" />
            </div>
            <div v-else class="order-number">{{ row.order }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="is_active" label="启用" width="90" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.is_active === 1" @change="(val) => onSwitchChange(row, val)" size="large" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="240" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <template v-if="editingRowId === row.id">
                <el-button size="large" type="primary" :loading="submitLoading"
                  @click="() => saveEdit(row)">保存</el-button>
                <el-button size="large" @click="cancelEdit">取消</el-button>
              </template>
              <template v-else>
                <el-button size="large" type="primary" plain @click="() => startEdit(row)">编辑</el-button>
                <el-button size="large" type="danger" plain @click="() => handleDelete(row)">删除</el-button>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="flex justify-end mt-4">
        <el-pagination background layout="prev, pager, next, sizes, total" :current-page="currentPage"
          :page-size="pageSize" :page-sizes="[5, 10, 20, 50]" :total="total" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="700px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" size="large" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description" rows="4" placeholder="请输入描述" size="large" />
        </el-form-item>

        <el-form-item label="图片" prop="image">
          <div class="flex items-center">
            <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" class="hidden" />
            <el-button type="primary" size="large" @click="triggerUpload">
              <el-icon>
                <Upload />
              </el-icon> 上传图片
            </el-button>
            <span class="ml-3 text-gray-500" v-if="uploading">上传中...</span>
          </div>

          <!-- 图片预览 -->
          <div v-if="previewUrl || form.image" class="mt-3">
            <p class="text-sm text-gray-500 mb-2">预览：</p>
            <div class="relative inline-block">
              <img :src="previewUrl || getUploadUrl('honor/' + form.image)"
                style="max-width:220px; max-height:150px; object-fit:cover; border-radius:4px; border:1px solid #eee;" />
              <el-button v-if="previewUrl || form.image" type="danger" :icon="Delete" circle size="small"
                class="absolute -top-2 -right-2" @click="clearImage" />
            </div>
          </div>

          <div v-if="form.image && !previewUrl" class="mt-2 text-sm text-gray-500">
            当前图片: {{ form.image }}
          </div>
        </el-form-item>

        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" size="large" />
        </el-form-item>

        <el-form-item label="启用" prop="is_active">
          <el-switch :model-value="form.is_active === 1" @change="(val) => (form.is_active = val ? 1 : 0)" size="large" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button size="large" @click="dialogVisible = false">取消</el-button>
        <el-button size="large" type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
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
  getHonorsList,
  createHonor,
  updateHonor,
  deleteHonor
} from "@/api/honor";

interface HonorItem {
  id: number;
  title: string;
  description: string;
  image: string;
  order: number;
  is_active: number;
  active?: boolean;
}

const tableData = ref<HonorItem[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const formRef = ref();
const submitLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const uploading = ref(false);

const form = reactive({
  id: 0,
  title: "",
  description: "",
  image: "",
  order: 0,
  is_active: 1,
});

const rules: FormRules = {
  title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
  order: [{ required: true, message: "排序不能为空", trigger: "change" }],
};

const dialogTitle = computed(() => (form.id ? "编辑荣誉" : "新增荣誉"));

const initialized = ref(false);
const editingRowId = ref<number | null>(null);
const editableRow = reactive({
  title: "",
  description: "",
  order: 0,
  image: ""
});

const fetchList = async () => {
  try {
    const params = { page: currentPage.value, size: pageSize.value };
    const res: any = await getHonorsList(params);
    tableData.value = (res.data || []).map((item: any) => ({
      ...item,
      is_active: Number(item.is_active),
      active: Number(item.is_active) === 1
    }));
    total.value = res.total || res.data?.length || 0;
    initialized.value = true;
  } catch {
    ElMessage.error("获取数据失败");
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

const handleAdd = () => {
  form.id = 0;
  form.title = "";
  form.description = "";
  form.image = "";
  form.is_active = 1;

  // 计算最大排序值
  const maxOrder = tableData.value.length
    ? Math.max(...tableData.value.map((r) => Number(r.order) || 0))
    : 0;
  form.order = maxOrder + 1;

  previewUrl.value = null;
  if (fileInput.value) fileInput.value.value = "";
  dialogVisible.value = true;
};

const startEdit = (row: HonorItem) => {
  editingRowId.value = row.id;
  editableRow.title = row.title;
  editableRow.description = row.description;
  editableRow.order = Number(row.order) || 0;
  editableRow.image = row.image;
};

const cancelEdit = () => {
  editingRowId.value = null;
};

const saveEdit = async (originalRow: HonorItem) => {
  if (!editableRow.title || editableRow.title.trim() === "") {
    ElMessage.error("标题不能为空");
    return;
  }
  if (editableRow.order === null || editableRow.order === undefined || isNaN(Number(editableRow.order))) {
    ElMessage.error("排序不能为空且为数字");
    return;
  }

  submitLoading.value = true;
  try {
    await updateHonor(originalRow.id, {
      title: editableRow.title,
      description: editableRow.description,
      order: Number(editableRow.order),
    });

    // 更新本地数据
    originalRow.title = editableRow.title;
    originalRow.description = editableRow.description;
    originalRow.order = Number(editableRow.order);

    ElMessage.success("保存成功");
    editingRowId.value = null;
    fetchList();
  } catch {
    ElMessage.error("保存失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleDelete = (row: HonorItem) => {
  ElMessageBox.confirm("确认删除该条荣誉？", "提示", { type: "warning" })
    .then(async () => {
      try {
        await deleteHonor(row.id);
        ElMessage.success("删除成功");
        fetchList();
      } catch {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => { });
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
    const res: any = await uploadFile(file, 'honor');
    if (res.success) {
      form.image = res.data.fileName;
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
  form.image = "";
  if (fileInput.value) fileInput.value.value = "";
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  submitLoading.value = true;

  try {
    const submitData = {
      title: form.title,
      description: form.description,
      image: form.image,
      order: form.order,
      is_active: form.is_active
    };

    if (form.id) {
      await updateHonor(form.id, submitData);
      ElMessage.success("更新成功");
    } else {
      await createHonor(submitData);
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

const onSwitchChange = async (row: any, val: boolean) => {
  if (!initialized.value) return;

  const prevActive = row.active;
  const prevNum = Number(row.is_active);
  const newNum = val ? 1 : 0;

  row.active = val;
  row.is_active = newNum;

  try {
    await updateHonor(row.id, { is_active: newNum });
    ElMessage.success("状态已更新");
  } catch {
    row.active = prevActive;
    row.is_active = prevNum;
    ElMessage.error("更新失败");
  }
};

const onImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.style.display = 'none';
  img.parentElement?.classList.add('image-error');
};
</script>

<style scoped>
.honor-management .el-table th {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 15px 0;
  background-color: #f5f7fa;
}

.honor-management .el-table td {
  font-size: 1.15rem;
  padding: 15px 0;
}

.title-text,
.description-text,
.order-number {
  font-size: 1.15rem;
  font-weight: 500;
  color: #303133;
  text-align: center;
}
/* 图片列样式优化 */
.honor-management .el-table .image-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 140px;
}

.honor-management .el-table .honor-image {
  width: 220px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 操作按钮样式优化 */
.honor-management .el-table .action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.honor-management .el-table .action-buttons .el-button {
  font-size: 1.1rem;
  padding: 10px 18px;
}

.honor-management .el-table .action-buttons .el-button--large {
  font-size: 1.1rem;
  padding: 12px 20px;
}

/* 表格整体样式优化 */
.honor-management .el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.honor-management .el-table--border {
  border-color: #e4e7ed;
}

.honor-management .el-table--border th {
  border-right: 1px solid #e4e7ed;
}

.honor-management .el-table--border td {
  border-right: 1px solid #e4e7ed;
}

/* 无图片占位符样式 */
.honor-management .no-image-placeholder {
  width: 140px;
  height: 140px;
  background-color: #f5f7fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 1.1rem;
  border: 1px dashed #dcdfe6;
}

.honor-management .no-image-placeholder .el-icon {
  font-size: 2.4rem;
  margin-bottom: 6px;
}

.hidden {
  display: none;
}
</style>