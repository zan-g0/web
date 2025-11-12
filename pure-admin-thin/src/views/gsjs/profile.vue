<template>
  <div class="profile-management">
    <el-card>
      <div class="flex justify-between items-center mb-4">
        <span class="text-2xl font-medium">公司简介管理</span>
        <div>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </div>

      <el-table :data="tableData" stripe border style="width: 100%" @sort-change="handleSortChange">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="id" label="ID" width="120" align="center" sortable>
          <template #default="{ row }">{{ row.id }}</template>
        </el-table-column>

        <el-table-column prop="txt" label="介绍内容" min-width="400">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input type="textarea" v-model="editableRow.txt" rows="3" />
            </div>
            <div v-else style="white-space:pre-wrap; word-break:break-word;">{{ row.txt }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="order" label="排序" width="120" align="center" sortable>
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input-number v-model="editableRow.order" :min="0" style="width:100px" />
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
              <el-button size="small" type="primary" :loading="submitLoading" @click="() => saveEdit(row)">保存</el-button>
              <el-button size="small" @click="cancelEdit">取消</el-button>
            </template>
            <template v-else>
              <el-button size="small" @click="() => startEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="() => handleDelete(row)">删除</el-button>
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

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="内容" prop="txt">
          <el-input type="textarea" v-model="form.txt" rows="6" />
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
import { ref, reactive, computed, onMounted } from "vue";
import type { FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getCompanyProfileList,
  createCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
} from "@/api/companyProfile";

interface Profile {
  id: number;
  txt: string;
  order: number;
  is_active: number | string;
}

const loading = ref(false);
const dialogVisible = ref(false);
const submitLoading = ref(false);
const formRef = ref();

const tableData = ref<Profile[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const form = reactive({
  id: 0,
  txt: "",
  order: 0,
  is_active: 1,
});

const rules: FormRules = {
  txt: [{ required: true, message: "内容不能为空", trigger: "blur" }],
  order: [{ required: true, message: "排序不能为空", trigger: "change" }],
};

const dialogTitle = computed(() => (form.id ? "编辑公司简介" : "新增公司简介"));

const initialized = ref(false);
const editingRowId = ref<number | null>(null);
const editableRow = reactive({
  txt: "",
  order: 0,
});

const fetchList = async () => {
  loading.value = true;
  try {
    const params: any = { page: currentPage.value, size: pageSize.value };
    const res: any = await getCompanyProfileList(params);
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

onMounted(() => {
  fetchList();
});

const handleAdd = () => {
  form.id = 0;
  form.txt = "";
  const maxOrder = tableData.value.length ? Math.max(...tableData.value.map((r: any) => Number(r.order) || 0)) : 0;
  form.order = maxOrder + 1;
  form.is_active = 1;
  dialogVisible.value = true;
};

const handleEdit = (row: Profile) => {
  form.id = row.id;
  form.txt = row.txt;
  form.order = row.order;
  form.is_active = Number(row.is_active) === 1 ? 1 : 0;
  dialogVisible.value = true;
};

const startEdit = (row: Profile) => {
  editingRowId.value = row.id;
  editableRow.txt = row.txt;
  editableRow.order = Number(row.order) || 0;
};

const cancelEdit = () => {
  editingRowId.value = null;
};

const saveEdit = async (originalRow: Profile) => {
  if (!editableRow.txt || editableRow.txt.toString().trim() === "") {
    ElMessage.error("内容不能为空");
    return;
  }
  if (editableRow.order === null || editableRow.order === undefined || isNaN(Number(editableRow.order))) {
    ElMessage.error("排序不能为空且为数字");
    return;
  }

  submitLoading.value = true;
  try {
    await updateCompanyProfile(originalRow.id, {
      txt: editableRow.txt,
      order: Number(editableRow.order),
    });
    originalRow.txt = editableRow.txt;
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

const handleDelete = (row: Profile) => {
  ElMessageBox.confirm("确认删除该条简介？", "提示", { type: "warning" })
    .then(async () => {
      try {
        await deleteCompanyProfile(row.id);
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
      await updateCompanyProfile(form.id, {
        txt: form.txt,
        order: form.order,
        is_active: form.is_active,
      });
      ElMessage.success("更新成功");
    } else {
      await createCompanyProfile({
        txt: form.txt,
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
    await updateCompanyProfile(row.id, { is_active: newNum });
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
  font-size: 1.15rem;
  font-weight: 600;
}
.profile-management .el-table td {
  font-size: 1.05rem;
}
</style>
