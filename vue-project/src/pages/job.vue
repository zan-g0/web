<template>
  <section class="page-bg">
  <div class="job-page">
    <h1 class="job-title">招聘岗位</h1>
    <div class="job-divider"></div>
    <div v-if="loading" class="loading">加载中...</div>

    <div v-else>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-else-if="jobs.length === 0" class="empty">暂无岗位信息</div>

      <ul class="job-list">
        <li v-for="job in jobs" :key="job.id" class="job-item" @click="openJobDetail(job)">
          <div class="item-content">
            <div class="title">{{ job.title }}</div>
            <div class="category">{{ job.category }}</div>
            <div class="date">发布时间：{{ formatDate(job.created_at) }}</div>
          </div>
          <div class="arrow">点击查看详情-></div>
        </li>
      </ul>
    </div>

    <!-- Job Detail Modal -->
    <div v-if="selectedJob" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedJob.title }}</h2>
          <button class="close-btn" @click.stop="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-field">
            <span class="label">岗位类别：</span>
            <span class="value">{{ selectedJob.category }}</span>
          </div>
          <div class="modal-field">
            <span class="label">薪资范围：</span>
            <span class="value">{{ selectedJob.salary_range }}</span>
          </div>
          <div class="modal-field">
            <span class="label">招聘人数：</span>
            <span class="value">{{ selectedJob.vacancy_count ?? '若干' }}</span>
          </div>
          <div class="modal-field">
            <span class="label">发布时间：</span>
            <span class="value">{{ formatDate(selectedJob.created_at) }}</span>
          </div>
          <div class="modal-field">
            <span class="label">岗位要求：</span>
            <div class="value requirements">{{ selectedJob.requirements }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="close-btn-secondary" @click.stop="closeModal">关闭</button>
        </div>
      </div>
    </div>
  </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface JobPosition {
  id: number;
  category: string;
  title: string;
  requirements: string;
  salary_range: string;
  vacancy_count: number | null;
  display_order?: number;
  created_at?: string;
}

const jobs = ref<JobPosition[]>([]);
const loading = ref(true);
const error = ref('');
const selectedJob = ref<JobPosition | null>(null);

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '未知';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function fetchJobs() {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('/api/jobs/positions');
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `HTTP ${res.status}`);
    }
    const data = await res.json();
    jobs.value = Array.isArray(data) ? data : [];
  } catch (e: any) {
    console.error('[fetchJobs error]', e);
    error.value = e?.message || '数据请求失败';
  } finally {
    loading.value = false;
  }
}

function openJobDetail(job: JobPosition) {
  selectedJob.value = job;
}

function closeModal() {
  selectedJob.value = null;
}

onMounted(() => {
  fetchJobs();
});
</script>

<style scoped>
:root {
  --green: #2e8b57;
  --light-green: #eef9f0;
  --muted: #556b46;
  --border-color: #e0e0e0;
  --modal-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.job-page {
  padding: 40px;
  max-width: 980px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}

.loading,
.empty,
.error {
  text-align: center;
  color: #666;
  padding: 18px 0;
}

.error {
  color: #9b2c2c;
}

.job-list {
  list-style: none;
  padding: 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.job-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 160px;
  border-radius: 12px;
  background: white;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: all 0.2s ease;
}

.job-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--modal-shadow);
  border-color: var(--green);
}

.job-item:hover .title,
.job-item:hover .category,
.job-item:hover .arrow {
  color: green;
}

.item-content {
  flex-grow: 1;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #1f3a2e;
  margin-bottom: 4px;
}

.category {
  font-size: 20px;
  color: var(--muted);
  margin-bottom: 4px;
}

.date {
  font-size: 20px;
  color: #888;
}

.arrow {
  color: var(--green);
  font-size: 20px;
  font-weight: bold;
}

.job-title {
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

.page-bg {
  background: linear-gradient(180deg, #f6fbf5 0%, #eef7ea 100%);
  min-height: 90vh;
}
/* Modal Styles */
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--modal-shadow);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 22px;
  color: #1f3a2e;
  font-weight: 700;
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

.modal-body {
  padding: 24px;
}

.modal-field {
  display: flex;
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border-color);
}

.modal-field:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.label {
  font-weight: 600;
  color: #333;
  min-width: 100px;
  flex-shrink: 0;
}

.value {
  color: #444;
  flex-grow: 1;
}

.requirements {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #4b5b48;
}

.modal-footer {
  padding: 24px;
  text-align: right;
  border-top: 1px solid var(--border-color);
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

@media (max-width: 720px) {
  .job-item {
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
  }

  .item-content {
    width: 100%;
  }

  .arrow {
    margin-top: 8px;
  }

  .modal-content {
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }

  .modal-header {
    padding: 18px 16px;
  }

  .modal-header h2 {
    font-size: 20px;
  }

  .modal-body {
    padding: 18px;
  }

  .modal-field {
    flex-direction: column;
    align-items: flex-start;
  }

  .label {
    margin-bottom: 4px;
    min-width: auto;
  }
}
</style>
