<template>
  <swiper
    :modules="[Pagination, Autoplay]"
    :pagination="{ clickable: true }"
    :autoplay="{ delay: 3000, disableOnInteraction: false }"
  >
    <swiper-slide v-for="(s, i) in slides" :key="i">
      <img :src="getUploadUrl('banners/' + s.image_name)" :alt="s.alt || s.image_name" class="swiper-image" />
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { axiosInstance } from '@/api/index'
import { getUploadUrl } from '@/utils/urls'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

interface BannerItem {
  image_name: string
  alt?: string
  title?: string
}

const slides = ref<BannerItem[]>([])

const fetchBanners = async () => {
  try {
    const res = await axiosInstance.get('/banners')
    const payload = res.data?.data ?? res.data
    if (Array.isArray(payload)) {
      slides.value = payload.map((it: any) => ({
        image_name: it.image_name ?? it.image ?? '',
        alt: it.title || ''
      })).filter((x: BannerItem) => !!x.image_name)
    } else {
      slides.value = []
    }
  } catch (err) {
    console.error('加载轮播图失败:', err)
    slides.value = []
  }
}

onMounted(fetchBanners)
</script>

<style scoped>
.swiper-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .swiper-image {
    height: 200px;
  }
}
</style>
