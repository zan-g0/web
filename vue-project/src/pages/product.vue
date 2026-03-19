<template>
  <section class="page-bg" v-scroll-animate>
    <div class="product-page">
      <h2 class="product-title">产品中心</h2>
      <div class="job-divider"></div>

      <!-- 工具栏：搜索 -->
      <div class="toolbar" style="display:flex; gap:8px; margin:12px 0;">
        <input v-model="search" @keyup.enter="reload" placeholder="搜索产品名称或描述" />
        <button @click="reload">搜索</button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
        <p class="mt-2">正在加载产品数据...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="alert alert-danger text-center">
        {{ error }}
        <button @click="fetchProducts" class="btn btn-sm btn-outline-danger ms-2">重试</button>
      </div>

      <!-- 正常状态：非加载且无错误时显示 -->
      <div v-else>
        <!-- 产品列表与空状态包裹在同一父元素下，确保 v-if/v-else 相邻 -->
        <template v-if="products.length > 0">
          <div class="product-grid">
            <div v-for="product in products" :key="product.id" @click="openDetail(product.id)" style="cursor:pointer;">
              <div class="product-card rounded-xl overflow-hidden bg-white">
                <div class="image-wrap">
                  <img :src="getUploadUrl('product/' + product.image_name)" :alt="product.name"
                    class="product-image transition-transform duration-300 hover:scale-105" loading="lazy" />
                </div>

                <div class="p-4 card-body text-left">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <p class="product-desc">{{ product.description }}</p>
                  <div class="arrow">点击查看详情-></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页控件 -->
          <div class="pager"
            style="display:flex; gap:12px; justify-content:center; align-items:center; margin-top:16px;">
            <button :disabled="page <= 1" @click="changePage(page - 1)">上一页</button>
            <span>第 {{ page }} 页 / 共 {{ totalPages }} 页</span>
            <button :disabled="page >= totalPages" @click="changePage(page + 1)">下一页</button>
          </div>
        </template>
        <div v-else class="text-center py-5">
          <div class="text-muted">
            <i class="bi bi-inbox" style="font-size: 3rem;"></i>
            <p class="mt-3">暂无产品数据</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedProduct" class="modal-overlay" @click="closeDetail">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedProduct.name }}</h2>
          <button class="close-btn" @click.stop="closeDetail">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-content-wrapper">
            <div class="image-section" v-if="selectedProduct.image_name">
              <img :src="getUploadUrl('product/' + selectedProduct.image_name)" class="cover" />
            </div>
            <div class="text-section">
              <div class="description-block">
                <div class="description-label">
                  <span class="label-icon">📝</span>
                  <span class="label-text">简述</span>
                </div>
                <div class="product-description">{{ selectedProduct.description }}</div>
              </div>
              <div class="description-block">
                <div class="description-label">
                  <span class="label-icon">📋</span>
                  <span class="label-text">详细描述</span>
                </div>
                <div class="detailed-description" v-html="selectedProduct.txt"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="close-btn-secondary" @click.stop="closeDetail">关闭</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { axiosInstance } from '@/api/index';
import { getUploadUrl } from '@/utils/urls';

// 定义产品接口（与后端 SQL 返回一致：image_name）
interface Product {
  id: number;
  name: string;
  description: string;
  txt: string;
  image_name: string;
  display_order: number;
}

// 响应式数据
const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref('');
const selectedProduct = ref<Product | null>(null);
const detailLoading = ref(false);

// 新增：分页与搜索状态
const page = ref(1);
const pageSize = ref(6);
const total = ref(0);
const search = ref('');

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));

const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = '';
    const res = await axiosInstance.get('/products', {
      params: {
        page: page.value,
        pageSize: pageSize.value,
        search: search.value || undefined
      }
    });
    const data = res.data;
    if (data && data.code === 0 && data.data) {
      products.value = data.data.items || [];
      total.value = data.data.total || 0;
      page.value = data.data.page || page.value;
      pageSize.value = data.data.pageSize || pageSize.value;
    } else if (Array.isArray(data)) {
      products.value = data;
      total.value = data.length;
    } else {
      throw new Error('获取产品失败：数据格式错误');
    }
  } catch (err) {
    console.error('获取产品数据失败:', err);
    error.value = err instanceof Error ? err.message : '未知错误';
    products.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

function changePage(p: number) {
  page.value = p;
  fetchProducts();
}

function reload() {
  page.value = 1;
  fetchProducts();
}

async function openDetail(id: number) {
  try {
    detailLoading.value = true;
    const response = await axiosInstance.get(`/products/${id}`);
    const data = response.data;

    if (data && data.code === 0) {
      selectedProduct.value = data.data as Product;
    } else {
      console.error('product detail error', data);
    }
  } catch (err: any) {
    console.error('openDetail error:', err);
  } finally {
    detailLoading.value = false;
  }
}

function closeDetail() {
  selectedProduct.value = null;
}

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
/* 页面背景：浅绿色，符合农业企业形象 */
.page-bg {
  background: linear-gradient(180deg, #f6fbf5 0%, #eef7ea 100%);
  min-height: 100vh;
}

/* 卡片：增加边框与微妙阴影，更稳重的企业风格 */
.product-card {
  transition: all 0.28s ease;
  border: 1px solid rgba(44, 94, 46, 0.08);
  box-shadow: 0 2px 6px rgba(28, 49, 27, 0.04);
  background: linear-gradient(180deg, #ffffff 0%, #fcfff9 100%);
  overflow: hidden;
}

/* Hover 强化效果 */
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 30px rgba(28, 49, 27, 0.10);
  border-color: rgba(44, 94, 46, 0.18);
}

/* 图片高度微调，避免过大占用卡片 */
.product-image {
  width: 100%;
  display: block;
  transition: transform 0.25s ease;
}

.product-page {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}

.product-title {
  color: #2c5e2e;
  font-weight: 700;
  font-size: 2.2rem;
  margin: 0 0 1rem;
  text-align: center;
  background: linear-gradient(135deg, #2c5e2e 0%, #4caf50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.job-divider {
  height: 3px;
  background: linear-gradient(90deg, transparent, #2c5e2e, transparent);
  width: 80px;
  margin: 0 auto 2rem;
}

/* 新增：响应式网格与卡片改进 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  align-items: stretch;
  margin-top: 24px;
}

.product-card {
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
  border: 1px solid rgba(44, 94, 46, 0.06);
  box-shadow: 0 2px 6px rgba(28, 49, 27, 0.03);
  background: linear-gradient(180deg, #ffffff 0%, #fcfff9 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 12px;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 34px rgba(28, 49, 27, 0.12);
  border-color: rgba(44, 94, 46, 0.18);
}

.image-wrap {
  width: 100%;
  padding-top: 75%;
  /* 4:3 比例 */
  position: relative;
  overflow: hidden;
  background: #f6faf5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrap .product-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 90%;
  max-height: 90%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
}

.card-body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.product-name {
  color: #16381b;
  font-weight: 700;
  font-size: 1.2rem;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-desc {
  color: #4b5b4a;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  align-items: center;
}

.card-footer span {
  display: inline-block;
  padding: 4px 12px;
  background-color: #e8f5e9;
  color: #2c5e2e;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 加载状态样式 */
.text-center {
  text-align: center;
  padding: 3rem 0;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #2c5e2e;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  color: #fff;
  background-color: #dc3545;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.ms-2 {
  margin-left: 0.5rem;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.text-muted {
  color: #6c757d;
}

.bi {
  display: inline-block;
}

.toolbar {
  display: flex;
  gap: 8px;
  margin: 12px;
}

.toolbar input {
  flex: 1;
  padding: 8px;
}

@media (max-width: 768px) {
  .product-page {
    padding: 20px;
  }

  .product-title {
    font-size: 1.8rem;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }
}

.modal-content {
  margin: 0;
  border-radius: 0;
  max-height: 100vh;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 60%;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #eee;
  position: relative;
}

.modal-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #2c5e2e;
  text-align: center;
  background: linear-gradient(135deg, #2c5e2e 0%, #4caf50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-header .close-btn {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
}

.modal-body {
  padding: 24px;
}

.modal-content-wrapper {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.image-section {
  flex-shrink: 0;
  width: 320px;
}

.modal-body .image-section img.cover {
  width: 100%;
  height: auto;
  max-height: 450px;
  object-fit: cover;
  border-radius: 8px; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.text-section {
  flex: 1;
  min-width: 0;
}

.description-block {
  margin-bottom: 24px;
}

.description-block:last-child {
  margin-bottom: 0;
}

.description-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #4caf50;
}

.label-icon {
  font-size: 20px;
}

.label-text {
  font-size: 18px;
  font-weight: 700;
  color: #2c5e2e;
}

.product-description {
  color: #444;
  font-size: 17px;
  line-height: 1.8;
  padding: 12px;
  background-color: #f8fbf7;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.detailed-description {
  color: #444;
  line-height: 1.8;
  font-size: 16px;
  white-space: pre-wrap;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.article {
  color: #444;
  line-height: 1.8;
  font-size: 15px;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .modal-content-wrapper {
    flex-direction: column;
  }

  .image-section {
    width: 100%;
  }

  .modal-body .image-section img.cover {
    max-height: 300px;
  }
}

.modal-footer {
  padding: 24px;
  text-align: right;
  border-top: 1px solid #eee
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  font-weight: bold;
  color: #888;
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

.close-btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-btn-secondary:hover {
  background-color: #e0e0e0;
}
</style>