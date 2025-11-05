<template>
  <div class="banner-management text-xl">
    <!-- 页面标题和操作栏 -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-3xl font-bold">轮播图管理</h2>
      <el-button type="primary" @click="handleAdd">
        <i class="el-icon-plus mr-1" />
        添加轮播图
      </el-button>
    </div>

    <!-- 轮播图列表 -->
    <el-card>
      <template #header>
        <span class="font-medium text-2xl">轮播图列表</span>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        empty-text="暂无轮播图数据"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />

        <el-table-column label="轮播图" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-image
                :src="getImageUrl(row.image_name)"
                :preview-src-list="[getImageUrl(row.image_name)]"
                fit="cover"
                class="w-80 h-48 rounded border"
              >
                <template #error>
                  <div
                    class="w-40 h-24 flex items-center justify-center bg-gray-100"
                  >
                    <i class="el-icon-picture-outline text-gray-400" />
                  </div>
                </template>
              </el-image>
              <span
                class="ml-3 text-lg text-gray-800 font-bold truncate max-w-xs"
              >
                {{ row.image_name }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="id" label="ID" width="100" align="center" />

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row, $index }">
            <el-button
              type="primary"
              link
              style=" height: 48px;font-size: 1.8rem"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              style=" height: 48px;font-size: 1.8rem"
              @click="handleDelete(row.id, $index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="px-2"
      >
        <el-form-item label="图片文件名" prop="image_name">
          <el-input
            v-model="form.image_name"
            placeholder="请输入图片文件名（不带后缀）"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
          <el-button type="primary" @click="triggerFileInput"
            >上传图片</el-button
          >
          <span v-if="form.image_name" class="ml-2 text-gray-600">{{
            form.image_name
          }}</span>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleSubmit"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: "banners"
});
import { ref, reactive, computed, onMounted } from "vue";
import {
  ElMessage,
  ElMessageBox,
  type UploadProps,
  type FormInstance,
  type FormRules
} from "element-plus";
import {
  getBannerList,
  createBanner,
  updateBanner,
  deleteBanner
} from "@/api/banner";

interface Banner {
  id: number;
  image_name: string;
}

// 响应式数据
const loading = ref(false);
const dialogVisible = ref(false);
const submitLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref<Banner[]>([]);
const formRef = ref<FormInstance>();
const fileList = ref<any[]>([]);
const editId = ref<number | null>(null);
const fileInputRef = ref<HTMLInputElement>();
// 新增变量保存待上传文件
const pendingFile = ref<File | null>(null);

// 触发文件选择框
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

// 选择文件但不立即上传
const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;
  pendingFile.value = files[0];
  ElMessage.success("图片已选择，点击确定后上传");
};

// 表单数据
const form = reactive({
  image_name: ""
});

// 表单验证规则
const rules: FormRules = {
  image_name: [{ required: true, message: "请上传轮播图", trigger: "change" }]
};

// 计算属性
const dialogTitle = computed(() =>
  editId.value ? "编辑轮播图" : "添加轮播图"
);

// 上传配置
const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem("admin_token")}`
};

// 获取图片完整URL
const getImageUrl = (imageName: string) => {
  return `http://localhost:3000/uploads/banners/${imageName}`;
};

// 获取轮播图列表
const fetchBanners = async () => {
  try {
    loading.value = true;
    const response = await getBannerList({
      page: currentPage.value,
      size: pageSize.value
    });
    tableData.value = response.data;
    total.value = response.total;
  } catch (error) {
    ElMessage.error("获取轮播图列表失败");
    console.error("Error fetching banners:", error);
  } finally {
    loading.value = false;
  }
};

// 添加轮播图
const handleAdd = () => {
  editId.value = null;
  form.image_name = "";
  fileList.value = [];
  dialogVisible.value = true;
};

// 假设 row.image_name 是 'banner3.jpg'
const getNameWithoutExt = (filename: string) => {
  return filename.replace(/\.[^/.]+$/, "");
};

// 编辑轮播图（只允许更改图片和image_name）
const handleEdit = (row: Banner) => {
  form.image_name = getNameWithoutExt(row.image_name); // 只显示不带后缀的名字
  // 其它表单赋值...
  dialogVisible.value = true;
  editId.value = row.id;
};

// 删除轮播图
const handleDelete = async (id: number, index: number) => {
  try {
    await ElMessageBox.confirm("确定要删除这个轮播图吗？", "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    });

    await deleteBanner(id);
    ElMessage.success("删除成功");
    tableData.value.splice(index, 1);
    // 如果当前页没有数据了，且不是第一页，则跳转到上一页
    if (tableData.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
      fetchBanners();
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

// 上传成功处理
const handleUploadSuccess: UploadProps["onSuccess"] = response => {
  if (response.success) {
    form.image_name = response.data.fileName;
    ElMessage.success("上传成功");
  } else {
    ElMessage.error(response.message || "上传失败");
  }
};

// 上传错误处理
const handleUploadError: UploadProps["onError"] = () => {
  ElMessage.error("上传失败，请重试");
};

// 上传前验证
const beforeUpload: UploadProps["beforeUpload"] = file => {
  const isImage = file.type.startsWith("image/");

  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  return true;
};

// 文件超出限制
const handleExceed: UploadProps["onExceed"] = () => {
  ElMessage.warning("只能上传一张图片");
};

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    submitLoading.value = true;

    // 保存原始文件名后缀
    let fileExtension = "";

    if (pendingFile.value) {
      const formData = new FormData();
      formData.append("file", pendingFile.value);
      formData.append("newName", form.image_name); // 传递新文件名

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        form.image_name = result.data.fileName; // 更新表单中的文件名
        // 提取文件后缀
        fileExtension = result.data.fileName.substring(
          result.data.fileName.lastIndexOf(".")
        );
        ElMessage.success("图片上传成功");
      } else {
        ElMessage.error(result.message || "图片上传失败");
        return;
      }
    }

    // 调用后端接口保存到数据库
    if (editId.value) {
      // 如果是编辑模式且没有上传新文件，则需要保留原文件后缀
      let imageName = form.image_name;
      if (!pendingFile.value) {
        // 查找原文件的后缀
        const originalBanner = tableData.value.find(
          item => item.id === editId.value
        );
        if (originalBanner) {
          const ext = originalBanner.image_name.substring(
            originalBanner.image_name.lastIndexOf(".")
          );
          // 如果表单中的文件名不包含后缀，则添加原后缀
          if (!form.image_name.includes(".")) {
            imageName = form.image_name + ext;
          }
        }
      }
      await updateBanner(editId.value, { image_name: imageName });
      ElMessage.success("更新成功");
    } else {
      await createBanner({ image_name: form.image_name });
      ElMessage.success("添加成功");
    }

    dialogVisible.value = false;
    fetchBanners();
    pendingFile.value = null;
  } catch (error) {
    console.error("Submit error:", error);
    ElMessage.error("提交失败");
  } finally {
    submitLoading.value = false;
  }
};

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
  fetchBanners();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchBanners();
};

// 生命周期
onMounted(() => {
  fetchBanners();
});
</script>

<style scoped>
.banner-management {
  padding: 20px;
}

:deep(.el-upload-list__item) {
  transition: none !important;
}

.upload-demo {
  width: 100%;
}

:deep(.el-table th) {
  font-size: 1.4rem;
  font-weight: bold;
}

:deep(.el-table .el-table__cell) {
  font-size: 1.4rem;
}
</style>
