<template>
  <section class="page-bg">
    <div class="news-page">
          <h1 class="news-title">新闻中心</h1>
    <div class="news-divider"></div>
      <div class="toolbar">
        <input v-model="search" @keyup.enter="reload" placeholder="搜索新闻标题或摘要" />
        <button @click="reload">搜索</button>
      </div>

      <ul class="news-list">
        <li v-for="item in items" :key="item.id" class="news-item" @click="openDetail(item.id)">
          <img v-if="item.cover_image" :src="`http://localhost:3000/uploads/news/${item.cover_image}`" alt="封面"
            class="cover" />
          <div class="body">
            <h3 class="title">{{ item.title }}</h3>
            <p class="summary">{{ item.summary }}</p>
            <div class="meta">{{ formatDate(item.publish_date) }} · {{ item.category || '公司新闻' }}</div>
          </div>
          <div class="arrow">点击查看详情-></div>
        </li>
      </ul>

      <div class="pager">
        <button :disabled="page <= 1" @click="changePage(page - 1)">上一页</button>
        <span>第 {{ page }} 页 / 共 {{ totalPages }} 页</span>
        <button :disabled="page >= totalPages" @click="changePage(page + 1)">下一页</button>
      </div>

      <!-- Detail Modal -->
      <div v-if="selected" class="modal-overlay" @click="closeDetail">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ selected.title }}</h2>
            <button class="close-btn" @click.stop="closeDetail">×</button>
          </div>
          <div class="modal-body">
            <img v-if="selected.cover_image" :src="`http://localhost:3000/uploads/news/${selected.cover_image}`"
              class="cover" />
            <div style="color:#666; font-size:14px; margin-bottom:12px">{{ formatDate(selected.publish_date) }} · {{
              selected.category || '公司新闻' }} · 作者：{{ selected.author || '-' }}</div>
            <div class="article" v-html="formatContent(selected.content || selected.summary)"></div>
          </div>
          <div class="modal-footer">
            <button class="close-btn-secondary" @click.stop="closeDetail">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

import type { NewsItem } from '@/types/news';

const items = ref<NewsItem[]>([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const search = ref('');
const loading = ref(false);
const selected = ref<(NewsItem & { content?: string }) | null>(null);
const detailLoading = ref(false);

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));

async function fetchNews() {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: String(page.value),
      pageSize: String(pageSize.value),
    });
    if (search.value) params.append('search', search.value);

    const res = await fetch(`/api/news?${params.toString()}`);
    const data = await res.json();
    if (data && data.code === 0) {
      items.value = data.data.items;
      total.value = data.data.total;
    } else {
      console.error('news api error', data);
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function changePage(p: number) {
  page.value = p;
  fetchNews();
}

function reload() {
  page.value = 1;
  fetchNews();
}

function formatDate(dt?: string | null) {
  if (!dt) return '';
  const d = new Date(dt);
  return d.toLocaleDateString();
}

onMounted(() => {
  fetchNews();
});

async function openDetail(id: number) {
  try {
    detailLoading.value = true;
    const res = await fetch(`/api/news/${id}`);
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data && data.code === 0) {
      selected.value = data.data as NewsItem & { content?: string };
    } else {
      console.error('news detail error', data);
    }
  } catch (err) {
    console.error(err);
  } finally {
    detailLoading.value = false;
  }
}

function closeDetail() {
  selected.value = null;
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatContent(raw?: string | null) {
  if (!raw) return '';
  // 标准化换行
  let s = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 如果看起来包含 HTML 标签，则直接返回（认为为富文本）
  const hasHtmlTag = /<[^>]+>/.test(s);
  if (hasHtmlTag) return s;

  // 否则当作纯文本：转义 HTML、保留缩进与换行
  const escaped = escapeHtml(s);

  // 将制表符转换为 4 个空格
  const tabNormalized = escaped.replace(/\t/g, '    ');

  // 每行的前导空格转换为 &nbsp;，保留中间空格使用普通空格
  const lines = tabNormalized.split('\n').map(line => {
    const m = line.match(/^(\s*)/);
    const leading = m ? m[0].length : 0;
    return (leading ? '&nbsp;'.repeat(leading) : '') + line.trimStart();
  });

  return lines.join('<br/>');
}
</script>

<style scoped>
.page-bg {
  background: linear-gradient(180deg, #f6fbf5 0%, #eef7ea 100%);
}

.news-page {
  padding: 40px;
  max-width: 980px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}
.news-title {
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
.news-divider {
  height: 3px;
  background: linear-gradient(90deg, transparent, #2c5e2e, transparent);
  width: 80px;
  margin: 0 auto;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin:12px;
}

.toolbar input {
  flex: 1;
  padding: 8px;
}

.news-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.news-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 20px 160px;
  border-radius: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;
}

.news-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
  border-color: #2e8b57;
}

.cover {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.body {
  flex: 1;
}

.title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
  color: #1f3a2e;
}

.summary {
  margin: 0 0 8px;
  color: #666;
}

.meta {
  color: #999;
  font-size: 16px;
}

.arrow {
  color: #2e8b57;
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 720px) {
  .news-item {
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
  }

  .arrow {
    margin-top: 8px;
  }

  .modal-content {
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }
}

.pager {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #eee
}

.modal-header h2 {
  margin: 0;
  font-size: 22px;
  color: #1f3a2e
}

.modal-body {
  padding: 24px
}

.modal-body img.cover {
  height: auto;
  max-height: 360px;
  object-fit: cover;
  margin-bottom: 12px
}

.article {
  color: #444;
  line-height: 1.8;
  font-size: 15px;
  white-space: pre-wrap;
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
