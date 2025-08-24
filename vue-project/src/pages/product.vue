<template>
  <section class="p-5">
    <div class="container">
      <h2 class="text-center">产品中心</h2>
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
      
      <!-- 正常状态 -->
      <template v-else>
        <!-- 分类筛选（可选） -->
        <div v-if="categories.length > 1" class="mb-4 text-center">
          <div class="btn-group" role="group">
            <button 
              type="button" 
              class="btn btn-outline-primary"
              :class="{ active: selectedCategory === '' }"
              @click="selectedCategory = ''"
            >
              全部产品
            </button>
            <button 
              v-for="category in categories" 
              :key="category"
              type="button" 
              class="btn btn-outline-primary"
              :class="{ active: selectedCategory === category }"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </div>
        </div>
        
        <!-- 产品列表 -->
        <div class="row">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id" 
            class="col-md-6 col-lg-4 col-xl-3 mb-4"
          >
            <div class="card bg-light h-100 product-card">
              <div class="card-body text-center d-flex flex-column">
                <img 
                  :src="getImageUrl(product.image_url)" 
                  :alt="product.name"
                  class="mb-3 img-fluid product-image"
                  @error="handleImageError"
                />
                <h3 class="card-title h5">{{ product.name }}</h3>
                <p class="card-text flex-grow-1">{{ product.description }}</p>
                <span class="badge bg-secondary mt-2">{{ product.category }}</span>
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
      </template>
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
  console.error('产品图片加载失败:', imgElement.src);
  imgElement.style.display = 'none';
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
.product-card {
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.product-image {
  max-height: 200px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
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
</style>