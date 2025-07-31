<template>
  <swiper
    :modules="[Pagination, Autoplay]"
    :pagination="{ clickable: true }"
    :autoplay="{ delay: 3000, disableOnInteraction: false }"
  >
    <swiper-slide v-for="(slide, idx) in slides" :key="idx">
      <img :src="slide.image" :alt="slide.title" />
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const slides = [
  { image: new URL('@/assets/images/banner/banner1.jpg', import.meta.url).href, title: '轮播1' },
  { image: new URL('@/assets/images/banner/banner2.jpg', import.meta.url).href, title: '轮播2' }
]
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