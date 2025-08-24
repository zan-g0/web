<template>
  <section class="p-5">
    <div class="container">
      <h2 class="text-center mb-4">人才招聘</h2>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
        <p class="mt-2">正在加载招聘信息...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="alert alert-danger text-center">
        {{ error }}
        <button @click="fetchData" class="btn btn-sm btn-outline-danger ms-2">重试</button>
      </div>
      
      <!-- 正常状态 -->
      <template v-else>
        <!-- 人才理念 -->
        <div class="mb-5 text-center">
          <h4>{{ talentConcept?.title || '人才理念' }}</h4>
          <p class="lead mb-0">{{ talentConcept?.content || '暂无人才理念介绍' }}</p>
        </div>
        
        <!-- 岗位列表 - 卡片式 -->
        <div>
          <h4 class="text-center mb-4">招聘岗位</h4>
          
          <div v-if="positions.length === 0" class="alert alert-info text-center">
            <i class="bi bi-info-circle"></i> 暂无招聘岗位
          </div>
          
          <div v-else class="row justify-content-center">
            <div 
              v-for="position in positions" 
              :key="position.id" 
              class="col-lg-8 col-md-10 col-12 mb-4"
            >
              <div class="card job-card h-100 border-0 shadow-sm">
                <div class="card-body">
                  <!-- 岗位头部 -->
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span class="badge mb-2" :class="getCategoryBadgeClass(position.category)">
                        {{ position.category }}
                      </span>
                      <h5 class="card-title mb-1 text-primary">{{ position.title }}</h5>
                    </div>
                    <span class="badge bg-info fs-6">{{ position.vacancy_count }}人</span>
                  </div>
                  
                  <!-- 岗位要求 -->
                  <div class="mb-3">
                    <h6 class="text-muted mb-2">岗位要求：</h6>
                    <p class="card-text mb-0">{{ position.requirements }}</p>
                  </div>
                  
                  <!-- 薪资待遇 -->
                  <div class="mt-auto">
                    <h6 class="text-muted mb-2">薪资待遇：</h6>
                    <p class="text-success fw-bold mb-0">{{ position.salary_range }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 定义接口
interface TalentConcept {
  id: number;
  title: string;
  content: string;
  display_order: number;
}

interface JobPosition {
  id: number;
  category: string;
  title: string;
  requirements: string;
  salary_range: string;
  vacancy_count: number;
  display_order: number;
}

// 响应式数据
const talentConcept = ref<TalentConcept | null>(null);
const positions = ref<JobPosition[]>([]);
const loading = ref(true);
const error = ref('');

// 获取类别徽章样式
const getCategoryBadgeClass = (category: string) => {
  const categoryClasses: { [key: string]: string } = {
    '研发类': 'bg-primary',
    '技术类': 'bg-success',
    '销售类': 'bg-warning text-dark',
    '管理类': 'bg-info text-dark',
    '行政类': 'bg-secondary'
  };
  return categoryClasses[category] || 'bg-dark';
};

// 获取招聘数据
const fetchData = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // 并行获取数据
    const [conceptRes, positionsRes] = await Promise.all([
      fetch('/api/jobs/talent-concept'),
      fetch('/api/jobs/positions')
    ]);
    
    if (!conceptRes.ok) throw new Error('获取人才理念失败');
    if (!positionsRes.ok) throw new Error('获取岗位列表失败');
    
    talentConcept.value = await conceptRes.json();
    positions.value = await positionsRes.json();
    
  } catch (err) {
    console.error('获取招聘数据失败:', err);
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
.job-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.card-title {
  color: #2c5e2e !important;
  font-weight: 600;
}

.badge {
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
}

.lead {
  color: #555;
  line-height: 1.8;
  font-size: 1.1rem;
}

.text-muted {
  color: #6c757d !important;
  font-weight: 500;
}

.text-success {
  color: #28a745 !important;
  font-size: 1.1rem;
}

.card-body {
  padding: 1.5rem;
}
</style>