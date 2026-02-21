<template>
  <section class="py-24 bg-gradient-to-b from-green-50 to-white" v-scroll-animate>
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-20" v-scroll-animate>
        <h2 class="profile-title">公司简介</h2>
        <div class="contact-divider"></div>
        <div class="w-32 h-1.5 bg-green-600 mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-16 items-stretch company-grid" v-scroll-animate>
        <!-- Text Content: 合并为单个卡片以便与图片等高 -->
        <div class="h-full text-column" v-scroll-animate>
          <div class="bg-white p-8 rounded-2xl shadow-lg h-full flex flex-col justify-center transition-all duration-300 text-card">
            <div v-for="paragraph in profile" :key="paragraph.id" class="mb-4 last:mb-0">
              <p class="profile-paragraph text-gray-700 font-medium">
                {{ paragraph.txt }}
              </p>
            </div>
          </div>
        </div>

        <!-- Image Column: 图片充满列高度，保持裁剪（object-cover）以匹配文字卡片高度 -->
        <div class="flex items-center justify-center w-full h-full image-column" v-scroll-animate>
          <div class="w-full h-full rounded-2xl overflow-hidden shadow-lg bg-white flex items-center justify-center p-0 image-wrapper">
            <img
              v-if="images && images.length"
              :src="`http://localhost:3000/uploads/company/${images[0]}`"
              alt="公司形象图主图"
              class="w-full h-full object-cover transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  profile: {
    type: Array,
    required: true
  },
  images: {
    type: Array,
    required: true
  }
});

</script>
<style scoped>
.profile-title {
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
.contact-divider {
  height: 3px;
  background: linear-gradient(90deg, transparent, #2c5e2e, transparent);
  width: 100px;
  margin: 0 auto 1.5rem;
}
</style>
<style scoped>
.company-grid{
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  align-items: stretch;
}
@media (min-width:700px){
  .company-grid{
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 1fr; /* 使两列等高 */
  }
}
.text-card{ /* 确保文字卡片填满列、高度自适应 */
  display:flex;
  flex-direction:column;
  justify-content:center;
  height:100%;
}
.image-wrapper img{
  width:100%;
  height:100%;
  object-fit:cover;
}
.profile-paragraph{
  font-size: 1.25rem; /* 18px */
  line-height: 1.9;
  text-indent: 2ch; /* 首行缩进两个空格宽度 */
  margin: 0 0 1rem;
}
</style>