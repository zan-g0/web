<script setup lang="ts">
defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: "contact"
});

import { ref, reactive, computed, onMounted } from "vue";
import type { FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getContactInfoList,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
} from "@/api/contact";

interface ContactInfo {
  id: number;
  company_phone: string;
  service_phone: string;
  fax: string;
  email: string;
  postal_code: string;
  address: string;
  is_active: number | string;
}

const loading = ref(false);
const dialogVisible = ref(false);
const submitLoading = ref(false);
const formRef = ref();

const tableData = ref<ContactInfo[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const form = reactive({
  id: 0,
  company_phone: "",
  service_phone: "",
  fax: "",
  email: "",
  postal_code: "",
  address: "",
  is_active: 1
});

const rules: FormRules = {
  company_phone: [{ required: false, message: "公司电话不能为空", trigger: "blur" }],
  service_phone: [{ required: false, message: "销售服务热线不能为空", trigger: "blur" }],
  fax: [{ required: false, message: "传真不能为空", trigger: "blur" }],
  email: [
    { required: false, message: "邮箱不能为空", trigger: "blur" },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  postal_code: [{ required: false, message: "邮编不能为空", trigger: "blur" }],
  address: [{ required: false, message: "地址不能为空", trigger: "blur" }],
};

const dialogTitle = computed(() => (form.id ? "编辑联系方式" : "新增联系方式"));

const initialized = ref(false);
const editingRowId = ref<number | null>(null);
const editableRow = reactive({
  company_phone: "",
  service_phone: "",
  fax: "",
  email: "",
  postal_code: "",
  address: "",
});

const fetchList = async () => {
  loading.value = true;
  try {
    const params: any = { page: currentPage.value, size: pageSize.value };
    const res: any = await getContactInfoList(params);
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

const handleAdd = () => {
  form.id = 0;
  form.company_phone = "";
  form.service_phone = "";
  form.fax = "";
  form.email = "";
  form.postal_code = "";
  form.address = "";
  form.is_active = 1;
  dialogVisible.value = true;
};

const handleEdit = (row: ContactInfo) => {
  form.id = row.id;
  form.company_phone = row.company_phone;
  form.service_phone = row.service_phone;
  form.fax = row.fax;
  form.email = row.email;
  form.postal_code = row.postal_code;
  form.address = row.address;
  form.is_active = Number(row.is_active) === 1 ? 1 : 0;
  dialogVisible.value = true;
};

const startEdit = (row: ContactInfo) => {
  editingRowId.value = row.id;
  editableRow.company_phone = row.company_phone;
  editableRow.service_phone = row.service_phone;
  editableRow.fax = row.fax;
  editableRow.email = row.email;
  editableRow.postal_code = row.postal_code;
  editableRow.address = row.address;
};

const cancelEdit = () => {
  editingRowId.value = null;
};

const saveEdit = async (originalRow: ContactInfo) => {
  submitLoading.value = true;
  try {
    await updateContactInfo(originalRow.id, {
      company_phone: editableRow.company_phone,
      service_phone: editableRow.service_phone,
      fax: editableRow.fax,
      email: editableRow.email,
      postal_code: editableRow.postal_code,
      address: editableRow.address,
      is_active: originalRow.is_active,
    });
    originalRow.company_phone = editableRow.company_phone;
    originalRow.service_phone = editableRow.service_phone;
    originalRow.fax = editableRow.fax;
    originalRow.email = editableRow.email;
    originalRow.postal_code = editableRow.postal_code;
    originalRow.address = editableRow.address;
    ElMessage.success("保存成功");
    editingRowId.value = null;
    fetchList();
  } catch {
    ElMessage.error("保存失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleDelete = (row: ContactInfo) => {
  ElMessageBox.confirm("确认删除该条联系方式？", "提示", { type: "warning" })
    .then(async () => {
      try {
        await deleteContactInfo(row.id);
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
      await updateContactInfo(form.id, {
        company_phone: form.company_phone,
        service_phone: form.service_phone,
        fax: form.fax,
        email: form.email,
        postal_code: form.postal_code,
        address: form.address,
        order: form.order,
        is_active: form.is_active,
      });
      ElMessage.success("更新成功");
    } else {
      await createContactInfo({
        company_phone: form.company_phone,
        service_phone: form.service_phone,
        fax: form.fax,
        email: form.email,
        postal_code: form.postal_code,
        address: form.address,
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
    await updateContactInfo(row.id, {
  company_phone: row.company_phone,
  service_phone: row.service_phone,
  fax: row.fax,
  email: row.email,
  postal_code: row.postal_code,
  address: row.address,
  is_active: newNum
});
    row.is_active = newNum;
    ElMessage.success("状态已更新");
  } catch {
    row.active = prevBool;
    row.is_active = prevNum;
    ElMessage.error("更新失败");
  }
};
</script>

<template>
  <div class="contact-management">
    <el-card>
      <div class="flex justify-between items-center mb-4">
        <span class="text-2xl font-medium">联系方式管理</span>
        <div>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </div>

      <el-table :data="tableData" stripe border style="width: 100%" @sort-change="handleSortChange">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="id" label="ID" width="120" align="center" sortable>
          <template #default="{ row }">{{ row.id }}</template>
        </el-table-column>

        <el-table-column prop="company_phone" label="公司电话" min-width="150">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.company_phone" />
            </div>
            <div v-else>{{ row.company_phone || '-' }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="service_phone" label="销售服务热线" min-width="150">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.service_phone" />
            </div>
            <div v-else>{{ row.service_phone || '-' }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="fax" label="传真" min-width="150">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.fax" />
            </div>
            <div v-else>{{ row.fax || '-' }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="邮箱" min-width="200">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.email" />
            </div>
            <div v-else>{{ row.email || '-' }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="postal_code" label="邮编" min-width="120">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input v-model="editableRow.postal_code" />
            </div>
            <div v-else>{{ row.postal_code || '-' }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="address" label="地址" min-width="300">
          <template #default="{ row }">
            <div v-if="editingRowId === row.id">
              <el-input type="textarea" v-model="editableRow.address" rows="2" />
            </div>
            <div v-else style="white-space:pre-wrap; word-break:break-word;">{{ row.address || '-' }}</div>
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
        <el-form-item label="公司电话" prop="company_phone">
          <el-input v-model="form.company_phone" />
        </el-form-item>

        <el-form-item label="销售服务热线" prop="service_phone">
          <el-input v-model="form.service_phone" />
        </el-form-item>

        <el-form-item label="传真" prop="fax">
          <el-input v-model="form.fax" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="邮编" prop="postal_code">
          <el-input v-model="form.postal_code" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input type="textarea" v-model="form.address" rows="6" />
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

<style scoped>
.contact-management .el-table th {
  font-size: 1.15rem;
  font-weight: 600;
}
.contact-management .el-table td {
  font-size: 1.05rem;
}
</style>
