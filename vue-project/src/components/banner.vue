<template>
  <swiper
    :modules="[Pagination, Autoplay]"
    :pagination="{ clickable: true }"
    :autoplay="{ delay: 3000, disableOnInteraction: false }"
  >
    <swiper-slide v-for="(slide, idx) in slides" :key="idx">
      <img 
        :src="getImageUrl(slide.image)" 
        :alt="slide.alt || '轮播图'"
        class="swiper-image"
      />
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface BannerItem {
  image: string;
  alt?: string;
  title?: string;
}

const slides = ref<BannerItem[]>([]);

// 动态生成图片URL（核心修正）
const getImageUrl = (filename: string) => {
  try {
    // 开发环境：直接使用文件系统路径
    if (import.meta.env.DEV) {
      return new URL(`/src/assets/images/banner/${filename}`, import.meta.url).href;
    }
    // 生产环境：使用打包后的路径
    return `/assets/images/banner/${filename}`;
  } catch (e) {
    console.warn('图片路径生成失败:', e);
  }
};

// 从API获取数据
const fetchBanners = async () => {
  try {
    const response = await axios.get('/api/banners');
        slides.value = response.data.map((filename: string) => ({
      image: filename, // 只存储文件名
      alt: `轮播图-${filename.replace(/\.[^/.]+$/, "")}` // 移除扩展名
    }));
    
  } catch (error) {
    console.error('加载轮播图失败:', error);
  }
};


onMounted(fetchBanners);
</script>

<style scoped>
.swiper-slide img {
  width: 100%;
  height: 500px;
  object-fit: cover;  /* 保持比例填充容器 */
  display: block;
  background-color: #f5f5f5; /* 加载中的背景色 */
}

@media (max-width: 768px) {
  .swiper-slide img {
    height: 180px;
  }
}
</style>