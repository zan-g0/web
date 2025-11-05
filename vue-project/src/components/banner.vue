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

// 使用后端静态地址，优先读取 VITE_API_BASE 环境变量
const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000';
const getImageUrl = (filename: string) => {
  if (!filename) return '';
  // filename 可能已包含路径或是仅文件名，这里以文件名为主
  return `${API_BASE.replace(/\/$/, '')}/uploads/banners/${filename}`;
};

// 从API获取数据，兼容返回多种结构
const fetchBanners = async () => {
  try {
    const response = await axios.get('/api/banners');
    // 支持后端返回 { data: [...] } 或直接返回 [...]
    const payload = response.data?.data ?? response.data;
    if (Array.isArray(payload)) {
      slides.value = payload.map((item: any) => {
        const filename = typeof item === 'string' ? item : (item.image_name ?? item.image ?? '');
        return {
          image: filename,
          alt: `轮播图-${filename.replace(/\.[^/.]+$/, '')}`
        };
      });
    } else {
      slides.value = [];
    }
  } catch (error) {
    console.error('加载轮播图失败:', error);
    slides.value = [];
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