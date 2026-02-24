<template>
  <section class="py-24 bg-white" v-scroll-animate>
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-20" v-scroll-animate>
        <h2 class="culture-title">企业文化</h2>
        <div class="culture-divider"></div>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          我们坚持的核心价值观和工作理念，塑造了独特的企业文化
        </p>
        <div class="w-32 h-1.5 bg-green-600 mx-auto rounded-full mt-4"></div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 culture-grid">
        <div
          v-for="item in culture"
          :key="item.id"
          class="culture-card bg-gradient-to-br from-green-50/80 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-transparent hover:border-green-200/50"
          v-scroll-animate
        >
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-green-100 shadow-lg">
              <img
                :src="getUploadUrl('culture/' + item.icon_img)"
                :alt="item.title"
                class="w-full h-full object-contain p-2"
              >
            </div>

            <h3 class="text-3xl font-bold text-gray-800 mb-5">{{ item.title }}</h3>

            <div class="space-y-4">
              <p
                v-for="(text, index) in item.content"
                :key="index"
                :class="{ 'font-semibold text-green-700': index % 2 === 1, 'text-gray-700': index % 2 === 0 }"
                class="text-lg leading-relaxed"
              >
                {{ text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { getUploadUrl } from '@/utils/urls';
import { useCompanyData } from '@/composables/useCompanyData';

const props = defineProps<{
  culture: ReturnType<typeof useCompanyData>['data']['value']['culture'];
}>();
</script>

<style scoped>
.culture-title {
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
.culture-divider {
  height: 3px;
  background: linear-gradient(90deg, transparent, #2c5e2e, transparent);
  width: 80px;
  margin: 0 auto;
}
.culture-card {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.culture-card:hover {
  box-shadow: 0 25px 50px -12px rgba(34, 197, 94, 0.12);
}

/* 添加农业主题的叶子装饰效果 */
.culture-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.2));
  border-radius: 0 0 0 100%;
  z-index: 0;
}

/* 添加植物生长动画效果 */
@keyframes leaf-grow {
  0% {
    transform: scale(0.8) rotate(-10deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.2;
  }
}

.culture-card:hover::before {
  animation: leaf-grow 0.6s ease-out forwards;
}

/* Responsive grid fallback in case Tailwind utilities are not active
   Ensures 1 / 2 / 3 / 4 columns at common breakpoints */
.culture-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .culture-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 768px) {
  .culture-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) {
  .culture-grid { grid-template-columns: repeat(4, 1fr); }
}
</style>