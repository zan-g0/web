<template>
  <div class="profile-management">
    <el-card>
      <div class="flex justify-between items-center mb-4">
        <span class="text-2xl font-medium">公司简介图片管理</span>
        <div>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </div>

      <el-table :data="tableData" stripe border style="width:100%" @sort-change="handleSortChange">
        <el-table-column type="index" label="序号" width="80" align="center" />

        <el-table-column prop="id" label="ID" width="100" align="center">
          <template #default="{ row }">{{ row.id }}</template>
        </el-table-column>

        <el-table-column label="图片预览" min-width="220" align="center">
          <template #default="{ row }">
            <img
              :src="getImgUrl(row.img_name)"
              alt="img"
              style="max-width:200px; max-height:200px; object-fit:cover;"
            />
          </template>
        </el-table-column>

        <el-table-column prop="img_name" label="图片名" min-width="220">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.img_name" placeholder="不带后缀的图片名" />
            </div>
            <div v-else>{{ row.img_name }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="order" label="排序" width="100" align="center" sortable>
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input-number v-model="editableRow.order" :min="0" />
            </div>
            <div v-else>{{ row.order }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="is_active" label="启用" width="100" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.active" @change="(val) => onSwitchChange(row, val)" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="260" align="center" fixed="right">
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

      <div class="flex justify-end mt-4">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5,10,20,50]"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="560px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="图片名" prop="img_name">
          <el-input v-model="form.img_name" placeholder="不带后缀的图片名" />
        </el-form-item>

        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" />
        </el-form-item>

        <el-form-item label="启用" prop="is_active">
          <el-switch :model-value="form.is_active === 1" @change="(val) => (form.is_active = val ? 1 : 0)" />
        </el-form-item>

        <el-form-item label="图片文件 (可选)">
          <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" />
          <div v-if="previewUrl" style="margin-top:8px;">
            <img :src="previewUrl" style="max-width:200px; max-height:120px; object-fit:cover;" />
          </div>
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
import { ref, reactive, computed, onMounted } from "vue";
import type { FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getCompanyProfileImgList,
  createCompanyProfileImg,
  updateCompanyProfileImg,
  deleteCompanyProfileImg,
  
} from "@/api/companyProfileImg";

interface ImgItem {
  id: number;
  img_name: string;
  order: number;
  is_active: number | string;
}

const tableData = ref<ImgItem[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false);
const dialogVisible = ref(false);
const submitLoading = ref(false);
const formRef = ref();
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);

const form = reactive({
  id: 0,
  img_name: "",
  order: 0,
  is_active: 1,
});

const rules: FormRules = {
  img_name: [{ required: true, message: "图片名不能为空", trigger: "blur" }],
  order: [{ required: true, message: "排序不能为空", trigger: "change" }],
};

const dialogTitle = computed(() => (form.id ? "编辑图片" : "新增图片"));

const initialized = ref(false);
const editingRowId = ref<number | null>(null);
const editableRow = reactive({ img_name: "", order: 0 });

const fetchList = async () => {
  loading.value = true;
  try {
    const params: any = { page: currentPage.value, size: pageSize.value };
    const res: any = await getCompanyProfileImgList(params);
    tableData.value = res.data.map((r: any) => ({
      ...r,
      is_active: Number(r.is_active) === 1 ? 1 : 0,
      active: Number(r.is_active) === 1,
    }));
    total.value = res.total;
    initialized.value = true;
  } catch {
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchList);

const getImgUrl = (imgName: string) => { if (!imgName) return ""; return `http://localhost:3000/uploads/company/${imgName}`; };

const handleAdd = () => {
  form.id = 0;
  form.img_name = "";
  const maxOrder = tableData.value.length ? Math.max(...tableData.value.map((r) => Number(r.order) || 0)) : 0;
  form.order = maxOrder + 1;
  form.is_active = 1;
  previewUrl.value = null;
  if (fileInput.value) fileInput.value.value = "";
  dialogVisible.value = true;
};

const startEdit = (row: ImgItem) => {
  editingRowId.value = row.id;
  editableRow.img_name = row.img_name;
  editableRow.order = Number(row.order) || 0;
};

const cancelEdit = () => {
  editingRowId.value = null;
};

const saveEdit = async (originalRow: ImgItem) => {
  if (!editableRow.img_name || editableRow.img_name.trim() === "") {
    ElMessage.error("图片名不能为空");
    return;
  }
  submitLoading.value = true;
  try {
    await updateCompanyProfileImg(originalRow.id, {
      img_name: editableRow.img_name,
      order: Number(editableRow.order),
    });
    originalRow.img_name = editableRow.img_name;
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

const handleDelete = (row: ImgItem) => {
  ElMessageBox.confirm("确认删除该图片记录？", "提示", { type: "warning" })
    .then(async () => {
      try {
        await deleteCompanyProfileImg(row.id);
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
    // 如果选择了文件则先上传（后端会返回带后缀的文件名）
    const files = fileInput.value?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const ext = file.name.substring(file.name.lastIndexOf("."));
      const finalName = form.img_name + ext;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("newName", finalName);
      fd.append("type", "company");
      // uploadImage 应该调用后端 /api/upload 或专门的上传接口
      const upRes: any = await fetch("/api/upload/company", { method: "POST", body: fd }).then(res => res.json());
      if (!upRes || !upRes.success) {
        ElMessage.error("图片上传失败");
        submitLoading.value = false;
        return;
      }
      form.img_name = upRes.data.fileName;
    }

    if (form.id) {
      await updateCompanyProfileImg(form.id, {
        img_name: form.img_name,
        order: form.order,
        is_active: form.is_active,
      });
      ElMessage.success("更新成功");
    } else {
      await createCompanyProfileImg({
        img_name: form.img_name,
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
  tableData.value.sort((a: any, b: any) => (a[prop] === b[prop] ? 0 : a[prop] > b[prop] ? dir : -dir));
};

const onSwitchChange = async (row: any, val: boolean) => {
  if (!initialized.value) return;
  const prevBool = row.active;
  const prevNum = Number(row.is_active);
  const newNum = val ? 1 : 0;
  row.active = val;
  try {
    await updateCompanyProfileImg(row.id, { is_active: newNum });
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
.profile-management .el-table th {
  font-size: 1.05rem;
  font-weight: 600;
}
.profile-management .el-table td {
  font-size: 1rem;
}
</style>