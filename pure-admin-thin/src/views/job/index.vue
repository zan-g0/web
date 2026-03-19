<template>
  <div class="job-management">
    <el-card>
      <div class="flex justify-between items-center mb-4">
        <span class="text-2xl font-medium">招聘岗位管理</span>
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
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="category" label="类别" min-width="40">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.category" />
            </div>
            <div v-else>{{ row.category }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="title" label="职位名称" min-width="80">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.title" />
            </div>
            <div v-else>{{ row.title }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="requirements" label="任职要求" min-width="200" align="left">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input
                v-model="editableRow.requirements"
                type="textarea"
                rows="2"
              />
            </div>
            <div v-else style="white-space: pre-wrap">
              {{ row.requirements }}
            </div>
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

        <el-table-column
          prop="vacancy_count"
          label="招聘人数"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input-number v-model="editableRow.vacancy_count" :min="0" />
            </div>
            <div v-else>{{ row.vacancy_count }}</div>
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
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="640px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="类别" prop="category">
          <el-input v-model="form.category" />
        </el-form-item>

        <el-form-item label="职位名称" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item label="任职要求" prop="requirements">
          <el-input v-model="form.requirements" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="薪资范围" prop="salary_range">
          <el-input v-model="form.salary_range" />
        </el-form-item>

        <el-form-item label="招聘人数" prop="vacancy_count">
          <el-input-number v-model="form.vacancy_count" :min="0" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormRules, FormInstance } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getJobPositions,
  createJobPositionApi,
  updateJobPositionApi,
  deleteJobPositionApi
} from "@/api/job";

interface JobPositionItem {
  id: number;
  category: string;
  title: string;
  requirements: string;
  salary_range: string;
  vacancy_count: number;
  display_order: number;
  is_active: number;
}

const tableData = ref<JobPositionItem[]>([]);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

const form = reactive({
  id: 0,
  category: "",
  title: "",
  requirements: "",
  salary_range: "",
  vacancy_count: 0,
  display_order: 0,
  is_active: 1 as number
});

const rules: FormRules = {
  category: [{ required: true, message: "类别不能为空", trigger: "blur" }],
  title: [{ required: true, message: "职位名称不能为空", trigger: "blur" }],
  requirements: [
    { required: true, message: "任职要求不能为空", trigger: "blur" }
  ],
  salary_range: [
    { required: true, message: "薪资范围不能为空", trigger: "blur" }
  ],
  vacancy_count: [
    { required: true, message: "招聘人数不能为空", trigger: "change" }
  ]
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

    // 处理数据
    if (res && res.code === 0 && res.data) {
      tableData.value = res.data.items || [];
    } else if (Array.isArray(res)) {
      tableData.value = res;
    } else if (res && res.data && Array.isArray(res.data)) {
      tableData.value = res.data;
    } else {
      tableData.value = [];
      // 只在开发环境打印警告
      if (process.env.NODE_ENV === "development") {
        console.warn("未知的数据格式:", res);
      }
    }

    initialized.value = true;
  } catch (error) {
    // 只在开发环境打印错误
    if (process.env.NODE_ENV === "development") {
      console.error("获取数据失败:", error);
    }
    ElMessage.error("获取数据失败");
    tableData.value = [];
  }
};

onMounted(fetchList);

const handleAdd = () => {
  // 重置表单
  form.id = 0;
  form.category = "";
  form.title = "";
  form.requirements = "";
  form.salary_range = "";
  form.vacancy_count = 0;

  // 计算新的排序值
  const maxOrder = tableData.value.length
    ? Math.max(...tableData.value.map(r => Number(r.display_order) || 0))
    : 0;
  form.display_order = maxOrder + 1;
  form.is_active = 1;

  // 打开对话框
  dialogVisible.value = true;

  // 清除表单验证
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

const handleDialogClose = () => {
  // 对话框关闭时重置表单验证
  if (formRef.value) {
    formRef.value.clearValidate();
  }
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
  // 表单验证
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
    await fetchList();
  } catch (error) {
    ElMessage.error("保存失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleDelete = (row: JobPositionItem) => {
  ElMessageBox.confirm("确认删除该条招聘岗位？", "提示", {
    type: "warning",
    confirmButtonText: "确认",
    cancelButtonText: "取消"
  })
    .then(async () => {
      try {
        await deleteJobPositionApi(row.id);
        ElMessage.success("删除成功");
        await fetchList();
      } catch (error) {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {
      // 用户取消删除
    });
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    // 准备提交数据
    const submitData = {
      category: form.category,
      title: form.title,
      requirements: form.requirements,
      salary_range: form.salary_range,
      vacancy_count: Number(form.vacancy_count),
      display_order: Number(form.display_order),
      is_active: Number(form.is_active)
    };

    if (form.id) {
      await updateJobPositionApi(form.id, submitData);
      ElMessage.success("更新成功");
    } else {
      await createJobPositionApi(submitData);
      ElMessage.success("新增成功");
    }

    dialogVisible.value = false;
    await fetchList();
  } catch (error) {
    // 如果是验证错误，不显示错误消息
    if (error instanceof Error) {
      ElMessage.error("保存失败");
    }
  } finally {
    submitLoading.value = false;
  }
};

const onSwitchChange = async (row: JobPositionItem, val: boolean) => {
  if (!initialized.value) return;

  // 保存原始状态
  const prevNum = Number(row.is_active);
  const newNum = val ? 1 : 0;

  // 先更新UI
  row.is_active = newNum;

  try {
    // 只传递需要更新的字段
    await updateJobPositionApi(row.id, {
      is_active: newNum
    });
    ElMessage.success("状态已更新");
  } catch (error) {
    // 失败时回滚
    row.is_active = prevNum;
    ElMessage.error("更新失败");
  }
};
</script>

<style scoped>
.job-management .el-table th {
  padding: 15px 0;
  font-size: 1.15rem;
  font-weight: 600;
  background-color: #f5f7fa;
}

.job-management .el-table td {
  padding: 15px 0;
  font-size: 1.15rem;
}

/* 穿透 Element Plus 样式 */
.job-management :deep(.el-table th .cell) {
  font-size: 1.15rem;
  font-weight: 600;
}

.job-management :deep(.el-table td .cell) {
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
</style>
