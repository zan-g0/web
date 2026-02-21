<template>
  <section class="page-bg">
    <div class="product-page">
      <h2 class="product-title">产品中心</h2>
      <div class="job-divider"></div>
      <p class="lead mb-5 text-center">以下是我公司的产品展示</p>

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

      <!-- 产品列表 -->
      <div class="product-page">
        <div v-for="product in filteredProducts" :key="product.id" class="mb-4">
          <div
            class="product-card rounded-xl overflow-hidden bg-white h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="p-4 text-center flex flex-col">
              <img :src="getImageUrl(product.image_url)" :alt="product.name"
                class="mb-3 w-full product-image transition-transform duration-300 hover:scale-105" loading="lazy"
                @error="handleImageError" />
              <h3 class="font-bold text-lg text-gray-900">{{ product.name }}</h3>
              <p class="card-text flex-grow-1">{{ product.description }}</p>
              <span class="inline-block px-2 py-1 mt-2 text-sm font-medium rounded bg-gray-200 text-gray-700">{{
                product.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 空状态 -->
    <div v-if="filteredProducts.length === 0" class="text-center py-5">
      <div class="text-muted">
        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
        <p class="mt-3">暂无产品数据</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

// 定义产品接口
interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: string;
  display_order: number;
}

// 响应式数据
const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref('');
const selectedCategory = ref('');

// 获取产品数据
const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = '';

    const response = await fetch('/api/products');

    if (!response.ok) {
      throw new Error(`获取产品失败: ${response.status} ${response.statusText}`);
    }

    products.value = await response.json();

  } catch (err) {
    console.error('获取产品数据失败:', err);
    error.value = err instanceof Error ? err.message : '未知错误';
  } finally {
    loading.value = false;
  }
};

// 获取图片URL
const getImageUrl = (path: string) => {
  if (!path) return '';

  // 处理不同情况的路径
  if (path.startsWith('http') || path.startsWith('//')) {
    return path;
  }

  if (path.startsWith('/')) {
    return path;
  }

  return `/images/product/${path}`;
};

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const imgElement = event.target as HTMLImageElement;
  console.warn('产品图片加载失败，已使用占位图替换:', imgElement.src);
  // 替换为本地占位图（请根据项目实际占位图路径调整）
  imgElement.src = '/images/product-fallback.png';
  // 若没有占位图，可使用透明小图或留空字符串
};

// 计算属性：获取所有分类
const categories = computed(() => {
  const uniqueCategories = new Set(products.value.map(product => product.category));
  return Array.from(uniqueCategories).filter(category => category);
});

// 计算属性：筛选产品
const filteredProducts = computed(() => {
  if (!selectedCategory.value) {
    return products.value;
  }
  return products.value.filter(product => product.category === selectedCategory.value);
});

// 组件挂载时获取数据
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
/* 页面背景：浅绿色，符合农业企业形象 */
.page-bg {
  background: linear-gradient(180deg, #f6fbf5 0%, #eef7ea 100%);
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
  max-height: 160px;
  /* 适当减小 */
  object-fit: contain;
  display: block;
  margin-left: auto;
  margin-right: auto;
  transition: transform 0.25s ease;
}

/* 更小屏幕上适当缩小图片高度 */
@media (max-width: 640px) {
  .product-image {
    max-height: 120px;
  }
}

.btn-group .btn {
  border-radius: 20px;
  margin: 0 5px;
}

.btn-group .btn.active {
  background-color: #2c5e2e;
  border-color: #2c5e2e;
}

.card-title {
  color: #2c5e2e;
  font-weight: bold;
}

.badge {
  align-self: center;
}

.product-page {
  padding: 40px;
  max-width: 980px;
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
  margin: 0 auto;
}
</style>