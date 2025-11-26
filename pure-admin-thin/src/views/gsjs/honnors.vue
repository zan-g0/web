<template>
  <div class="honnor-management">
    <el-card>
      <div class="flex justify-between items-center mb-4">
        <span class="text-2xl font-medium">荣誉资质管理</span>
        <div>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </div>

      <el-table :data="tableData" stripe border style="width:100%">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="id" label="ID" width="100" align="center" />
        <el-table-column prop="title" label="标题" min-width="100">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.title" />
            </div>
            <div v-else>{{ row.title }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="描述" min-width="120">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input type="textarea" v-model="editableRow.description" rows="2" />
            </div>
            <div v-else style="white-space:pre-wrap;">{{ row.description }}</div>
          </template>
        </el-table-column>

        <el-table-column label="图片" min-width="220" align="center">
          <template #default="{ row }">
            <img :src="getImgUrl(row.image)" alt="img" style="max-width:200px; max-height:200px; object-fit:cover;" />
          </template>
        </el-table-column>

        <el-table-column prop="order" label="排序" width="100" align="center">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input-number v-model="editableRow.order" :min="0" />
            </div>
            <div v-else>{{ row.order }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="is_active" label="启用" width="100" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.is_active === 1" @change="(val) => onSwitchChange(row, val)" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <template v-if="editingRowId === row.id">
              <el-button size="big" type="primary" :loading="submitLoading" @click="() => saveEdit(row)">保存</el-button>
              <el-button size="big" @click="cancelEdit">取消</el-button>
            </template>
            <template v-else>
              <el-button size="big" @click="() => startEdit(row)">编辑</el-button>
              <el-button size="big" type="danger" @click="() => handleDelete(row)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="dialogTitle" v-model:visible="dialogVisible" width="640px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description" rows="4" />
        </el-form-item>

        <el-form-item label="图片名" prop="image">
          <el-input v-model="form.image" placeholder="存储的文件名（可选，若上传文件则自动覆盖）" />
        </el-form-item>

        <el-form-item label="图片文件 (可选)">
          <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" />
          <div v-if="previewUrl" style="margin-top:8px;">
            <img :src="previewUrl" style="max-width:200px; max-height:120px; object-fit:cover;" />
          </div>
        </el-form-item>

        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" />
        </el-form-item>

        <el-form-item label="启用" prop="is_active">
          <el-switch :model-value="form.is_active === 1" @change="(val) => (form.is_active = val ? 1 : 0)" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getHonnorsList,
  createHonnorApi,
  updateHonnorApi,
  deleteHonnorApi,
  uploadHonnorImage,
} from "@/api/honnors";

interface HonnorItem {
  id: number;
  title: string;
  description: string;
  image: string;
  order: number;
  is_active: number | string;
}

const tableData = ref<HonnorItem[]>([]);
const dialogVisible = ref(false);
const formRef = ref();
const submitLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);

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
const editableRow = reactive({ title: "", description: "", order: 0 });

const fetchList = async () => {
  try {
    const res: any = await getHonnorsList({ page: 1, size: 1000 });
    tableData.value = res.data || [];
    initialized.value = true;
  } catch {
    ElMessage.error("获取数据失败");
  }
};

onMounted(fetchList);

const getImgUrl = (imgName: string) => {
  if (!imgName) return "";
  return `http://localhost:3000/uploads/honnor/${imgName}`;
};

const handleAdd = () => {
  form.id = 0;
  form.title = "";
  form.description = "";
  const maxOrder = tableData.value.length ? Math.max(...tableData.value.map((r) => Number(r.order) || 0)) : 0;
  form.order = maxOrder + 1;
  form.image = "";
  form.is_active = 1;
  previewUrl.value = null;
  if (fileInput.value) fileInput.value.value = "";
  dialogVisible.value = true;
};

const startEdit = (row: HonnorItem) => {
  editingRowId.value = row.id;
  editableRow.title = row.title;
  editableRow.description = row.description;
  editableRow.order = Number(row.order) || 0;
};

const cancelEdit = () => {
  editingRowId.value = null;
};

const saveEdit = async (originalRow: HonnorItem) => {
  if (!editableRow.title || editableRow.title.trim() === "") {
    ElMessage.error("标题不能为空");
    return;
  }
  submitLoading.value = true;
  try {
    await updateHonnorApi(originalRow.id, {
      title: editableRow.title,
      description: editableRow.description,
      order: Number(editableRow.order),
    });
    ElMessage.success("保存成功");
    editingRowId.value = null;
    fetchList();
  } catch {
    ElMessage.error("保存失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleDelete = (row: HonnorItem) => {
  ElMessageBox.confirm("确认删除该条荣誉？", "提示", { type: "warning" })
    .then(async () => {
      try {
        await deleteHonnorApi(row.id);
        ElMessage.success("删除成功");
        fetchList();
      } catch {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || !files.length) return;
  const f = files[0];
  previewUrl.value = URL.createObjectURL(f);
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  submitLoading.value = true;
  try {
    const files = fileInput.value?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const ext = file.name.substring(file.name.lastIndexOf("."));
      const finalName = (form.image ? form.image : `honnor_${Date.now()}`) + ext;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("newName", finalName);
      fd.append("type", "honnor"); // 指定上传目录为 honnor
      const upRes: any = await uploadHonnorImage(fd);
      if (!upRes || !upRes.success) {
        ElMessage.error("图片上传失败");
        submitLoading.value = false;
        return;
      }
      form.image = upRes.data.fileName;
    }

    if (form.id) {
      await updateHonnorApi(form.id, {
        title: form.title,
        description: form.description,
        image: form.image,
        order: form.order,
        is_active: form.is_active,
      });
      ElMessage.success("更新成功");
    } else {
      await createHonnorApi({
        title: form.title,
        description: form.description,
        image: form.image,
        order: form.order,
        is_active: form.is_active,
      });
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
  const prevBool = row.active;
  const prevNum = Number(row.is_active);
  const newNum = val ? 1 : 0;
  row.active = val;
  try {
    await updateHonnorApi(row.id, { is_active: newNum });
    row.is_active = newNum;
    ElMessage.success("状态已更新");
  } catch {
    row.active = prevBool;
    row.is_active = prevNum;
    ElMessage.error("更新失败");
  }
};
</script>

<style scoped>
.honnor-management .el-table th {
  font-size: 1.05rem;
  font-weight: 600;
}
.honnor-management .el-table td {
  font-size: 1rem;
}
</style>