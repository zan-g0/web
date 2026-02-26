<template>
  <section class="py-24 bg-gray-50" v-scroll-animate>
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-20" v-scroll-animate>
        <h2 class="honor-title">荣誉资质</h2>
        <div class="honor-divider"></div>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          我们获得的各项专业认证与荣誉
        </p>
        <div class="w-32 h-1.5 bg-green-600 mx-auto rounded-full mt-4"></div>
      </div>

      <div class="grid honor-grid gap-10">
        <div
          v-for="item in honor"
          :key="item.id"
          class="honor-card bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-transparent hover:border-green-200"
          v-scroll-animate
        >
          <div class="relative overflow-hidden flex items-center justify-center min-h-[200px]">
            <img
              :src="getUploadUrl('honor/' + item.image)"
              :alt="item.title"
              class="max-w-full max-h-full object-contain transition-transform duration-700 hover:scale-110"
              loading="lazy"
            >
          </div>
          <div class="p-8 relative">
            <div class="mb-6">
              <h3 class="text-2xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-50 to-white px-4 py-2 rounded-lg inline-block">
                {{ item.title }}
              </h3>
            </div>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>

      <div v-if="honor.length === 0" class="text-center py-16" v-scroll-animate>
        <div class="bg-white rounded-2xl p-12 shadow-lg inline-block">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-gray-500 text-xl">暂无荣誉资质信息</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getUploadUrl } from '@/utils/urls';

interface HonorItem {
  id: number | string;
  title: string;
  description: string;
  image: string;
}

defineProps<{
  honor: HonorItem[];
}>();
</script>

<style scoped>
.honor-title {
  color: #2c5e2e;
  font-weight: 700;
  font-size: 2.5rem;
  margin: 0 0 1rem;
  text-align: center;
  background: linear-gradient(135deg, #2c5e2e 0%, #4caf50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.honor-divider {
  height: 3px;
  background: linear-gradient(90deg, transparent, #2c5e2e, transparent);
  width: 80px;
  margin: 0 auto;
}
.honor-card {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.honor-card:hover {
  box-shadow: 0 25px 50px -12px rgba(34, 197, 94, 0.15);
}

/* 添加农业主题的装饰线条 */
.honor-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #22c55e, #16a34a, #15803d);
  border-radius: 0 0 1rem 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.honor-card:hover::after {
  opacity: 1;
}

/* 添加植物茎叶装饰 */
.honor-card .decorative-leaf {
  position: absolute;
  bottom: 8px;
  left: 8px;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  opacity: 0.3;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.honor-card:hover .decorative-leaf {
  opacity: 0.6;
  transform: scale(1.2) rotate(15deg);
}

.honor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2.5rem;
}
</style>