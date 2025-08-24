<template>
  <section class="p-5">
    <div class="container">
      <h2 class="text-center">科技创新</h2>
      <p class="lead mb-5 text-center">以下是我公司的科技成果展示</p>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
        <p class="mt-2">正在加载数据...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="alert alert-danger text-center">
        {{ error }}
        <button @click="fetchData" class="btn btn-sm btn-outline-danger ms-2">重试</button>
      </div>
      
      <!-- 正常状态 -->
      <template v-else>
        <!-- 科技介绍 -->
        <div v-for="(intro, index) in introductions" :key="'intro-' + intro.id" 
             class="row align-items-center justify-content-between mb-5"
             :class="{'flex-row-reverse': index % 2 === 1}">
          <div class="col-md-6 p-5">
            <h1>{{ intro.title }}</h1>
            <p class="lead">{{ intro.content }}</p>
          </div>
          <div class="col-md-6 text-center">
            <img 
              :src="getImageUrl(intro.image_url)" 
              :alt="intro.title" 
              class="img-fluid rounded shadow"
              @error="handleImageError"
              style="max-height: 300px; width: auto;"
            />
            <p v-if="!intro.image_url" class="text-muted mt-2">暂无图片</p>
          </div>
        </div>

        <!-- 成果展示 -->
        <div v-if="achievements.length > 0" class="mb-5 text-center">
          <h3>成果展示</h3>
          <h5>主推品种技术参数对比</h5>
          <div class="table-responsive mb-3">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>品种名称</th>
                  <th>抗倒伏性</th>
                  <th>稻瘟病抗性</th>
                  <th>产量表现</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="achievement in achievements" :key="'achieve-' + achievement.id">
                  <td>{{ achievement.variety_name }}</td>
                  <td>{{ achievement.lodging_resistance }}</td>
                  <td>{{ achievement.blast_resistance }}</td>
                  <td>{{ achievement.yield_performance }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 技术合作 -->
        <section v-if="cooperations.length > 0" class="p-5">
          <div class="container">
            <h2 class="text-center">技术合作</h2>
            <div v-for="cooperation in cooperations" :key="'coop-' + cooperation.id">
              <p class="lead text-center mb-5">{{ cooperation.description }}</p>
              <div class="row justify-content-center">
                <div v-for="(imgUrl, imgIndex) in cooperation.image_urls" :key="'img-' + imgIndex" 
                     class="col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-3 text-center">
                  <img 
                    :src="getImageUrl(imgUrl)" 
                    class="img-fluid rounded shadow mb-2" 
                    :alt="cooperation.title + ' ' + (imgIndex + 1)"
                    @error="handleImageError"
                    style="max-height: 200px; width: auto;"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 定义接口
interface TechIntroduction {
  id: number;
  title: string;
  content: string;
  image_url: string;
  display_order: number;
}

interface TechAchievement {
  id: number;
  variety_name: string;
  lodging_resistance: string;
  blast_resistance: string;
  yield_performance: string;
  display_order: number;
}

interface TechCooperation {
  id: number;
  title: string;
  description: string;
  image_urls: string[];
  display_order: number;
}

// 响应式数据
const introductions = ref<TechIntroduction[]>([]);
const achievements = ref<TechAchievement[]>([]);
const cooperations = ref<TechCooperation[]>([]);
const loading = ref(true);
const error = ref('');

// 获取图片URL
const getImageUrl = (path: string) => {
  if (!path) return '';
  
  // 如果已经是完整URL，直接返回
  if (path.startsWith('http') || path.startsWith('//')) {
    return path;
  }
  
  if (path.startsWith('/')) {
    return path;
  }
  
  // 假设图片在public/images/tech目录下
  return `/images/tech/${path}`;
};

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const imgElement = event.target as HTMLImageElement;
  console.error('图片加载失败:', imgElement.src);
  imgElement.style.display = 'none';
};

// 获取科技数据
const fetchData = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // 并行获取所有数据
    const [introRes, achieveRes, coopRes] = await Promise.all([
      fetch('/api/tech/introductions'),
      fetch('/api/tech/achievements'),
      fetch('/api/tech/cooperations')
    ]);
    
    if (!introRes.ok) throw new Error('获取科技介绍失败');
    if (!achieveRes.ok) throw new Error('获取科技成果失败');
    if (!coopRes.ok) throw new Error('获取技术合作失败');
    
    introductions.value = await introRes.json();
    achievements.value = await achieveRes.json();
    cooperations.value = await coopRes.json();
    
  } catch (err) {
    console.error('获取科技数据失败:', err);
    error.value = err instanceof Error ? err.message : '未知错误';
  } finally {
    loading.value = false;
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.img-fluid {
  max-height: 400px;
  object-fit: contain;
}

.table th {
  background-color: #2c5e2e;
  color: white;
}

h2, h3 {
  color: #2c5e2e;
  font-weight: bold;
}

.lead {
  color: #555;
  line-height: 1.8;
}

.shadow {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.rounded {
  border-radius: 10px;
}

.row.align-items-center {
  min-height: 400px;
}
</style>