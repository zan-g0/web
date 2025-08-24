<template>
  <section class="p-5 bg-light">
    <section class="p-5">
      <div class="container">
        <h2 class="text-center mb-4">新闻中心</h2>
        <p class="lead text-center mb-5">传递企业动态与行业价值</p>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">加载中...</span>
          </div>
          <p class="mt-2">正在加载新闻...</p>
        </div>
        
        <!-- 错误状态 -->
        <div v-else-if="error" class="alert alert-danger text-center">
          {{ error }}
          <button @click="fetchNews" class="btn btn-sm btn-outline-danger ms-2">重试</button>
        </div>
        
        <!-- 正常状态 -->
        <div v-else class="row">
          <!-- 动态渲染每个分类 -->
          <div v-for="(category, index) in categories" :key="index" class="col-md-4 mb-4">
            <h4>{{ category.name }}</h4>
            <ul class="list-group list-group-flush">
              <li v-for="newsItem in category.items" :key="newsItem.id" class="list-group-item">
                <strong>{{ newsItem.title }}</strong><br>
                {{ newsItem.content }}
                <small class="text-muted d-block mt-1">{{ formatDate(newsItem.created_at) }}</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

// 定义新闻项接口
interface NewsItem {
  id: number;
  class_name: string;
  title: string;
  content: string;
  view_count: number;
  is_top: boolean;
  created_at: string;
}

// 响应式数据
const newsData = ref<NewsItem[]>([]);
const loading = ref(true);
const error = ref('');

// 计算属性：按分类分组新闻
const categories = computed(() => {
  const categoriesMap: Record<string, NewsItem[]> = {};
  
  // 按分类名称分组
  newsData.value.forEach(item => {
    if (!categoriesMap[item.class_name]) {
      categoriesMap[item.class_name] = [];
    }
    categoriesMap[item.class_name].push(item);
  });
  
  // 转换为数组格式
  return Object.entries(categoriesMap).map(([name, items]) => ({
    name,
    items
  }));
});

// 获取新闻数据
const fetchNews = async () => {
  try {
    loading.value = true;
    error.value = '';
    const response = await fetch('/api/news');
    
    if (!response.ok) {
      throw new Error(`获取新闻失败: ${response.status} ${response.statusText}`);
    }
    
    newsData.value = await response.json();
  } catch (err) {
    console.error('获取新闻数据失败:', err);
    error.value = err instanceof Error ? err.message : '未知错误';
  } finally {
    loading.value = false;
  }
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 组件挂载时获取数据
onMounted(() => {
  fetchNews();
});
</script>

<style scoped>
.list-group-item {
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.list-group-item:hover {
  background-color: #f8f9fa;
  border-left-color: #0d6efd;
}

h4 {
  color: #2c5e2e;
  border-bottom: 2px solid #2c5e2e;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
</style>