<template>
  <swiper
    :modules="[Pagination, Autoplay]"
    :pagination="{ clickable: true }"
    :autoplay="{ delay: 3000, disableOnInteraction: false }"
  >
    <swiper-slide v-for="(slide, idx) in slides" :key="idx">
      <img :src="slide.image" :alt="'轮播'+(idx+1)" />
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const slides = ref<{ image: string }[]>([])

onMounted(async () => {
  try {
    const res = await axios.get('/api/banner.php'); 
    slides.value = res.data.map(filename => ({
      image: `/images/banner/${filename}` 
    }));
  } catch (error) {
    console.error('加载轮播图失败:', error);
  }
});
</script>

<style scoped>
.swiper-slide img {
  width: 100%;
  height: 500px;      /* 可根据需要调整高度 */
  object-fit: cover;  /* 保证图片不变形，铺满容器 */
  display: block;
}
@media (max-width: 768px) {
  .swiper-slide img {
    height: 180px;    /* 移动端高度可适当减小 */
  }
}
</style>