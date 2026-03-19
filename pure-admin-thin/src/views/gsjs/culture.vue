<template>
  <div class="culture-management">
    <el-card>
      <div class="flex justify-between items-center mb-4">
        <span class="text-2xl font-medium">企业文化管理</span>
        <div>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </div>

      <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%"
        :row-style="{ height: '80px' }"
        :cell-style="{ padding: '12px 0' }"
        @sort-change="handleSortChange"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column
          prop="id"
          label="ID"
          width="100"
          align="center"
          sortable
        >
          <template #default="{ row }">{{ row.id }}</template>
        </el-table-column>

        <el-table-column prop="title" label="标题" min-width="150">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.title" />
            </div>
            <div v-else>{{ row.title }}</div>
          </template>
        </el-table-column>

        <el-table-column
          prop="icon_img"
          label="图标"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-button
                size="small"
                type="primary"
                @click="openIconDialog(row)"
                >选择图标</el-button
              >
            </div>
            <div v-else>
              <img
                v-if="row.icon_img"
                :src="getImageUrl(row.icon_img)"
                alt="icon"
                style="
                  width: 40px;
                  height: 40px;
                  object-fit: cover;
                  border-radius: 4px;
                "
                @error="onImageError"
              />
              <span v-else class="text-gray-400">无图标</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="content" label="内容" min-width="300">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <div
                v-for="(item, index) in editableRow.content"
                :key="index"
                class="flex items-center mb-2"
              >
                <el-input
                  v-model="editableRow.content[index]"
                  type="textarea"
                  :rows="2"
                  class="flex-1"
                />
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  class="ml-2"
                  @click="removeContentItem(index)"
                />
              </div>
              <el-button type="primary" link @click="addContentItem">
                <el-icon>
                  <Plus />
                </el-icon>
                添加内容项
              </el-button>
            </div>
            <div v-else>
              <div
                v-for="(item, index) in row.content"
                :key="index"
                class="mb-1"
              >
                • {{ item }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="order"
          label="排序"
          width="100"
          align="center"
          sortable
        >
          <template #default="{ row }">
            <div
              v-if="editingRowId === row.id"
              style="display: flex; justify-content: center"
            >
              <el-input-number
                v-model="editableRow.order"
                :min="0"
                :max="999"
                controls-position="right"
                size="small"
                style="width: 90px"
              />
            </div>
            <div v-else>{{ row.order }}</div>
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
              :model-value="row.active"
              @change="val => onSwitchChange(row, val)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="240" align="center" fixed="right">
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

      <div class="flex justify-end mt-4">
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>

        <el-form-item label="图标" prop="icon_img">
          <div class="flex items-center">
            <el-button type="primary" @click="openIconDialog()">
              {{ form.icon_img ? "更换图标" : "选择图标" }}
            </el-button>
            <div v-if="form.icon_img" class="ml-4">
              <img
                :src="getImageUrl(form.icon_img)"
                alt="icon"
                style="
                  width: 60px;
                  height: 60px;
                  object-fit: cover;
                  border: 1px solid #eee;
                  border-radius: 4px;
                "
              />
              <el-button type="danger" link @click="form.icon_img = ''"
                >清除</el-button
              >
            </div>
          </div>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <div class="w-full">
            <div
              v-for="(item, index) in form.content"
              :key="index"
              class="flex items-center mb-2"
            >
              <el-input
                v-model="form.content[index]"
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                class="flex-1"
              />
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                class="ml-2"
                @click="removeFormContentItem(index)"
              />
            </div>
            <el-button type="primary" link @click="addFormContentItem">
              <el-icon>
                <Plus />
              </el-icon>
              添加内容项
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" />
        </el-form-item>

        <el-form-item label="启用" prop="is_active">
          <el-switch
            :model-value="form.is_active === 1"
            @change="val => (form.is_active = val ? 1 : 0)"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"
          >保存</el-button
        >
      </template>
    </el-dialog>

    <!-- 图标选择对话框 -->
    <el-dialog v-model="iconDialogVisible" title="选择图标" width="800px">
      <div class="icon-upload-section mb-4">
        <div class="flex items-center">
          <input
            ref="iconFileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onIconFileChange"
          />
          <el-button type="primary" @click="triggerIconUpload">
            <el-icon>
              <Upload />
            </el-icon>
            上传新图标
          </el-button>
          <span v-if="uploadingIcon" class="ml-3 text-gray-500">上传中...</span>
        </div>
        <div v-if="iconPreviewUrl" class="mt-2">
          <img
            :src="iconPreviewUrl"
            style="max-width: 100px; max-height: 100px; object-fit: cover"
          />
        </div>
      </div>

      <el-divider>已上传图标</el-divider>

      <div v-loading="iconListLoading" class="icon-grid">
        <div
          v-for="icon in iconList"
          :key="icon.name"
          class="icon-item"
          :class="{ selected: selectedIcon === icon.name }"
          @click="selectIcon(icon.name)"
        >
          <img :src="getImageUrl(icon.name, 'culture')" :alt="icon.name" />
          <div class="icon-name">{{ icon.name }}</div>
        </div>
        <div
          v-if="iconList.length === 0"
          class="text-center text-gray-400 py-8"
        >
          暂无图标，请先上传
        </div>
      </div>

      <template #footer>
        <el-button @click="iconDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="!selectedIcon"
          @click="confirmIconSelect"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import type { FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Delete, Upload } from "@element-plus/icons-vue";
import cultureApi from "@/api/culture";
import { uploadFile } from "@/api/upload";
import { getUploadUrl } from "@/router/urls";

interface Culture {
  id: number;
  title: string;
  content: string[];
  icon_img: string;
  order: number;
  is_active: number;
  active?: boolean;
}

const loading = ref(false);
const dialogVisible = ref(false);
const iconDialogVisible = ref(false);
const submitLoading = ref(false);
const iconListLoading = ref(false);
const uploadingIcon = ref(false);
const formRef = ref();
const iconFileInput = ref<HTMLInputElement | null>(null);
const iconPreviewUrl = ref<string | null>(null);
const iconList = ref<Array<{ name: string; url: string }>>([]);
const selectedIcon = ref<string>("");

const tableData = ref<Culture[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const form = reactive({
  id: 0,
  title: "",
  content: [""],
  icon_img: "",
  order: 0,
  is_active: 1
});

const rules: FormRules = {
  title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
  content: [{ required: true, message: "内容不能为空", trigger: "blur" }],
  icon_img: [{ required: true, message: "请选择图标", trigger: "change" }],
  order: [{ required: true, message: "排序不能为空", trigger: "change" }]
};

const dialogTitle = computed(() => (form.id ? "编辑文化条目" : "新增文化条目"));

const initialized = ref(false);
const editingRowId = ref<number | null>(null);
const editableRow = reactive({
  title: "",
  content: [""],
  icon_img: "",
  order: 0
});

const fetchList = async () => {
  loading.value = true;
  try {
    const params: any = { page: currentPage.value, size: pageSize.value };
    const res: any = await cultureApi.getCultures(params);
    tableData.value = res.data.map((r: any) => ({
      ...r,
      is_active: Number(r.is_active) === 1 ? 1 : 0,
      active: Number(r.is_active) === 1
    }));
    total.value = res.total;
    initialized.value = true;
  } catch {
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchList();
});

const getImageUrl = (imageName: string, type: string = "culture") => {
  if (!imageName) return "";
  return getUploadUrl(`${type}/${imageName}`);
};

const onImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjZmNmY2Ii8+PHRleHQgeD0iMjAiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGRkZGQiPkVycm9yPC90ZXh0Pjwvc3ZnPg==`;
};

const handleAdd = () => {
  form.id = 0;
  form.title = "";
  form.content = [""];
  form.icon_img = "";
  const maxOrder = tableData.value.length
    ? Math.max(...tableData.value.map((r: any) => Number(r.order) || 0))
    : 0;
  form.order = maxOrder + 1;
  form.is_active = 1;
  dialogVisible.value = true;
};

const startEdit = (row: Culture) => {
  editingRowId.value = row.id;
  editableRow.title = row.title;
  editableRow.content = [...row.content];
  editableRow.icon_img = row.icon_img;
  editableRow.order = Number(row.order) || 0;
};

const cancelEdit = () => {
  editingRowId.value = null;
};

const saveEdit = async (originalRow: Culture) => {
  if (!editableRow.title || editableRow.title.trim() === "") {
    ElMessage.error("标题不能为空");
    return;
  }
  if (
    !editableRow.content ||
    editableRow.content.length === 0 ||
    editableRow.content.some(c => !c.trim())
  ) {
    ElMessage.error("内容不能为空");
    return;
  }
  if (
    editableRow.order === null ||
    editableRow.order === undefined ||
    isNaN(Number(editableRow.order))
  ) {
    ElMessage.error("排序不能为空且为数字");
    return;
  }

  submitLoading.value = true;
  try {
    await cultureApi.updateCulture(originalRow.id, {
      title: editableRow.title,
      content: editableRow.content.filter(c => c.trim() !== ""),
      order: Number(editableRow.order)
    });
    originalRow.title = editableRow.title;
    originalRow.content = editableRow.content;
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

const handleDelete = (row: Culture) => {
  ElMessageBox.confirm("确认删除该文化条目？", "提示", { type: "warning" })
    .then(async () => {
      try {
        await cultureApi.deleteCulture(row.id);
        ElMessage.success("删除成功");
        fetchList();
      } catch {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  submitLoading.value = true;
  try {
    const submitData = {
      title: form.title,
      content: form.content.filter(c => c.trim() !== ""),
      icon_img: form.icon_img,
      order: form.order,
      is_active: form.is_active
    };

    if (form.id) {
      await cultureApi.updateCulture(form.id, submitData);
      ElMessage.success("更新成功");
    } else {
      await cultureApi.createCulture(submitData);
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

const onSwitchChange = async (row: any, val: boolean) => {
  if (!initialized.value) return;
  const prevBool = row.active;
  const prevNum = Number(row.is_active);
  const newNum = val ? 1 : 0;
  row.active = val;
  try {
    await cultureApi.updateCulture(row.id, { is_active: newNum });
    row.is_active = newNum;
    ElMessage.success("状态已更新");
  } catch {
    row.active = prevBool;
    row.is_active = prevNum;
    ElMessage.error("更新失败");
  }
};

// 内容项管理
const addContentItem = () => {
  editableRow.content.push("");
};

const removeContentItem = (index: number) => {
  editableRow.content.splice(index, 1);
  if (editableRow.content.length === 0) {
    editableRow.content.push("");
  }
};

const addFormContentItem = () => {
  form.content.push("");
};

const removeFormContentItem = (index: number) => {
  form.content.splice(index, 1);
  if (form.content.length === 0) {
    form.content.push("");
  }
};

// 图标选择
const openIconDialog = (row?: Culture) => {
  iconDialogVisible.value = true;
  selectedIcon.value = row?.icon_img || form.icon_img || "";
  fetchIconList();
};

const triggerIconUpload = () => {
  iconFileInput.value?.click();
};

const onIconFileChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  const file = files[0];
  iconPreviewUrl.value = URL.createObjectURL(file);
  uploadingIcon.value = true;

  try {
    const res: any = await uploadFile(file, "culture");
    if (res.success) {
      ElMessage.success("图标上传成功");
      selectedIcon.value = res.data.fileName;
      fetchIconList();
    } else {
      ElMessage.error("上传失败：" + res.message);
    }
  } catch {
    ElMessage.error("上传失败");
  } finally {
    uploadingIcon.value = false;
    if (iconFileInput.value) iconFileInput.value.value = "";
  }
};

const selectIcon = (iconName: string) => {
  selectedIcon.value = iconName;
};

const confirmIconSelect = () => {
  if (selectedIcon.value) {
    if (editingRowId.value) {
      editableRow.icon_img = selectedIcon.value;
    } else {
      form.icon_img = selectedIcon.value;
    }
    iconDialogVisible.value = false;
  }
};
</script>

<style scoped>
.culture-management .el-table th {
  padding: 15px 0;
  font-size: 1.15rem;
  font-weight: 600;
  background-color: #f5f7fa;
}

.culture-management .el-table td {
  padding: 15px 0;
  font-size: 1.15rem;
}

/* 穿透 Element Plus 样式 */
.culture-management :deep(.el-table th .cell) {
  font-size: 1.15rem;
  font-weight: 600;
}

.culture-management :deep(.el-table td .cell) {
  font-size: 1.15rem;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-buttons .el-button {
  padding: 10px 18px;
  font-size: 1.15rem;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  max-height: 400px;
  padding: 8px;
  overflow-y: auto;
}

.icon-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border: 2px solid #eee;
  border-radius: 8px;
  transition: all 0.3s;
}

.icon-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  transform: translateY(-2px);
}

.icon-item.selected {
  background-color: #ecf5ff;
  border-color: #409eff;
}

.icon-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.icon-name {
  max-width: 100%;
  font-size: 12px;
  color: #666;
  text-align: center;
  word-break: break-all;
}

.hidden {
  display: none;
}
</style>
