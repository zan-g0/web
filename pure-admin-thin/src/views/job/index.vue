<template>
  <div class="job-management">
    <el-card>
      <div class="flex justify-between items-center mb-4">
        <span class="text-2xl font-medium">招聘岗位管理</span>
        <div>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </div>

      <el-table :data="tableData" stripe border style="width:100%">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="id" label="ID" width="100" align="center" />
        <el-table-column prop="category" label="类别" min-width="120">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.category" />
            </div>
            <div v-else>{{ row.category }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="title" label="职位名称" min-width="120">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.title" />
            </div>
            <div v-else>{{ row.title }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="requirements" label="任职要求" min-width="200">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input type="textarea" v-model="editableRow.requirements" rows="2" />
            </div>
            <div v-else style="white-space:pre-wrap;">{{ row.requirements }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="salary_range" label="薪资范围" min-width="120">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.salary_range" />
            </div>
            <div v-else>{{ row.salary_range }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="vacancy_count" label="招聘人数" width="100" align="center">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input-number v-model="editableRow.vacancy_count" :min="0" />
            </div>
            <div v-else>{{ row.vacancy_count }}</div>
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
              <el-button size="large" type="primary" :loading="submitLoading" @click="() => saveEdit(row)">保存</el-button>
              <el-button size="large" @click="cancelEdit">取消</el-button>
            </template>
            <template v-else>
              <el-button size="large" @click="() => startEdit(row)">编辑</el-button>
              <el-button size="large" type="danger" @click="() => handleDelete(row)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="dialogTitle" v-model:visible="dialogVisible" width="640px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="类别" prop="category">
          <el-input v-model="form.category" />
        </el-form-item>

        <el-form-item label="职位名称" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item label="任职要求" prop="requirements">
          <el-input type="textarea" v-model="form.requirements" rows="4" />
        </el-form-item>

        <el-form-item label="薪资范围" prop="salary_range">
          <el-input v-model="form.salary_range" />
        </el-form-item>

        <el-form-item label="招聘人数" prop="vacancy_count">
          <el-input-number v-model="form.vacancy_count" :min="0" />
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
  getJobPositions,
  createJobPositionApi,
  updateJobPositionApi,
  deleteJobPositionApi,
} from "@/api/job";

interface JobPositionItem {
  id: number;
  category: string;
  title: string;
  requirements: string;
  salary_range: string;
  vacancy_count: number;
  display_order: number;
  is_active: number | string;
}

const tableData = ref<JobPositionItem[]>([]);
const dialogVisible = ref(false);
const formRef = ref();
const submitLoading = ref(false);

const form = reactive({
  id: 0,
  category: "",
  title: "",
  requirements: "",
  salary_range: "",
  vacancy_count: 0,
  display_order: 0,
  is_active: 1,
});

const rules: FormRules = {
  category: [{ required: true, message: "类别不能为空", trigger: "blur" }],
  title: [{ required: true, message: "职位名称不能为空", trigger: "blur" }],
  requirements: [{ required: true, message: "任职要求不能为空", trigger: "blur" }],
  salary_range: [{ required: true, message: "薪资范围不能为空", trigger: "blur" }],
  vacancy_count: [{ required: true, message: "招聘人数不能为空", trigger: "change" }]
};

const dialogTitle = computed(() => (form.id ? "编辑招聘岗位" : "新增招聘岗位"));

const initialized = ref(false);
const editingRowId = ref<number | null>(null);
const editableRow = reactive({
  category: "",
  title: "",
  requirements: "",
  salary_range: "",
  vacancy_count: 0,
  display_order: 0,
  is_active: 1
});

const fetchList = async () => {
  try {
    const res: any = await getJobPositions();
    tableData.value = res || [];
    initialized.value = true;
  } catch {
    ElMessage.error("获取数据失败");
  }
};

onMounted(fetchList);

const handleAdd = () => {
  form.id = 0;
  form.category = "";
  form.title = "";
  form.requirements = "";
  form.salary_range = "";
  form.vacancy_count = 0;
  const maxOrder = tableData.value.length ? Math.max(...tableData.value.map((r) => Number(r.display_order) || 0)) : 0;
  form.display_order = maxOrder + 1;
  form.is_active = 1;
  dialogVisible.value = true;
};

const startEdit = (row: JobPositionItem) => {
  editingRowId.value = row.id;
  editableRow.category = row.category;
  editableRow.title = row.title;
  editableRow.requirements = row.requirements;
  editableRow.salary_range = row.salary_range;
  editableRow.vacancy_count = Number(row.vacancy_count) || 0;
  editableRow.display_order = Number(row.display_order) || 0;
  editableRow.is_active = row.is_active === 1 ? 1 : 0;
};

const cancelEdit = () => {
  editingRowId.value = null;
};

const saveEdit = async (originalRow: JobPositionItem) => {
  if (!editableRow.category || editableRow.category.trim() === "") {
    ElMessage.error("类别不能为空");
    return;
  }
  if (!editableRow.title || editableRow.title.trim() === "") {
    ElMessage.error("职位名称不能为空");
    return;
  }
  if (!editableRow.requirements || editableRow.requirements.trim() === "") {
    ElMessage.error("任职要求不能为空");
    return;
  }
  if (!editableRow.salary_range || editableRow.salary_range.trim() === "") {
    ElMessage.error("薪资范围不能为空");
    return;
  }
  submitLoading.value = true;
  try {
    await updateJobPositionApi(originalRow.id, {
      category: editableRow.category,
      title: editableRow.title,
      requirements: editableRow.requirements,
      salary_range: editableRow.salary_range,
      vacancy_count: Number(editableRow.vacancy_count),
      display_order: Number(editableRow.display_order),
      is_active: editableRow.is_active
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

const handleDelete = (row: JobPositionItem) => {
  ElMessageBox.confirm("确认删除该条招聘岗位？", "提示", { type: "warning" })
    .then(async () => {
      try {
        await deleteJobPositionApi(row.id);
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
    if (form.id) {
      await updateJobPositionApi(form.id, {
        category: form.category,
        title: form.title,
        requirements: form.requirements,
        salary_range: form.salary_range,
        vacancy_count: form.vacancy_count,
        display_order: form.display_order,
        is_active: form.is_active,
      });
      ElMessage.success("更新成功");
    } else {
      await createJobPositionApi({
        category: form.category,
        title: form.title,
        requirements: form.requirements,
        salary_range: form.salary_range,
        vacancy_count: form.vacancy_count,
        display_order: form.display_order,
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
    await updateJobPositionApi(row.id, { is_active: newNum });
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
.job-management .el-table th {
  font-size: 1.05rem;
  font-weight: 600;
}
.job-management .el-table td {
  font-size: 1rem;
}
</style>