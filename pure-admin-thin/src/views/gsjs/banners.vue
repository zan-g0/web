<template>
  <div class="banner-management">
    <el-card>
      <div class="flex justify-between items-center mb-4">
        <span class="text-2xl font-medium">轮播图管理</span>
        <div>
          <el-button type="primary" @click="handleAdd">上传轮播图</el-button>
        </div>
      </div>

      <el-table :data="tableData" stripe border style="width:100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="80" align="center" />

        <el-table-column label="图片预览" min-width="220" align="center">
          <template #default="{ row }">
            <img :src="getImageUrl(row.image_name)" alt="banner"
              style="max-width:200px; max-height:200px; object-fit:cover; border:1px solid #eee;"
              @error="onImageError" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="large" type="danger" @click="() => handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination background layout="prev, pager, next, sizes, total" :current-page="currentPage"
          :page-size="pageSize" :page-sizes="[5, 10, 20, 50]" :total="total" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" />
      </div>
    </el-card>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="560px">
      <el-form :model="form" ref="formRef" label-width="100px">
        <el-form-item label="上传图片">
          <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" />
          <div v-if="previewUrl" style="margin-top:8px;">
            <img :src="previewUrl"
              style="max-width:200px; max-height:120px; object-fit:cover; border:1px solid #eee;" />
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">上传</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getBannerList, createBanner, deleteBanner } from "@/api/banner";
import { uploadFile } from "@/api/upload";
import { getUploadUrl } from "@/router/urls";

interface BannerItem {
  id: number;
  image_name: string;
}

const tableData = ref<BannerItem[]>([]);
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
  image_name: ""
});

const dialogTitle = computed(() => "上传轮播图");

const fetchList = async () => {
  loading.value = true;
  try {
    const params: any = { page: currentPage.value, size: pageSize.value };
    const res: any = await getBannerList(params);
    tableData.value = res.data;
    total.value = res.total;
  } catch {
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchList);

const getImageUrl = (imageName: string) => {
  if (!imageName) return "";
  return getUploadUrl(`banners/${imageName}`);
};

const onImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y2ZjZmNiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGRkZGQiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==`;
};

const handleAdd = () => {
  previewUrl.value = null;
  if (fileInput.value) fileInput.value.value = "";
  dialogVisible.value = true;
};

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || !files.length) return;
  const f = files[0];
  previewUrl.value = URL.createObjectURL(f);
};

const handleSubmit = async () => {
  const files = fileInput.value?.files;
  if (!files || files.length === 0) {
    ElMessage.error("请先选择一张图片");
    return;
  }

  submitLoading.value = true;
  try {
    const file = files[0];
    const res: any = await uploadFile(file, "banners");
    if (!res.success) {
      ElMessage.error("图片上传失败：" + res.message);
      return;
    }

    await createBanner({
      image_name: res.data.fileName
    });

    ElMessage.success("上传成功");
    dialogVisible.value = false;
    fetchList();
  } catch {
    ElMessage.error("保存失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleDelete = (row: BannerItem) => {
  ElMessageBox.confirm("确认删除该轮播图？", "提示", { type: "warning" })
    .then(async () => {
      try {
        await deleteBanner(row.id);
        ElMessage.success("删除成功");
        fetchList();
      } catch {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {
      // 用户取消了删除
    });
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
</script>

<style scoped>
.banner-management .el-table th {
  font-size: 1.05rem;
  font-weight: 600;
}

.banner-management .el-table td {
  font-size: 1rem;
}
</style>