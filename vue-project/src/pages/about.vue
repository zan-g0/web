<template>
  <banner />
  <section class="page-bg">
  <div class="about-page">
    <div class="min-h-screen bg-white">
      <!-- Loading State -->
      <div v-if="loading" class="min-h-screen flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
        <p class="text-lg text-gray-600">加载公司信息中...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <p class="text-red-600 font-medium mb-4">{{ error }}</p>
          <button @click="retry"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
            重试加载
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <template v-else>
        
        <CompanyProfileSection :profile="data.profile" :images="data.images" />

        <CultureValuesSection :culture="data.culture" />

        <HonorGallerySection :honor="data.honor" />
      </template>
    </div>
  </div>
  </section>
</template>

<script setup lang="ts">
import { useCompanyData } from '@/composables/useCompanyData';
import banner from '@/components/banner.vue';
import CompanyProfileSection from '@/components/about/CompanyProfileSection.vue';
import CultureValuesSection from '@/components/about/CultureValuesSection.vue';
import HonorGallerySection from '@/components/about/HonorGallerySection.vue';

const { data, loading, error, retry } = useCompanyData();
</script>

<style scoped>
.about-page {
  padding: 40px;
  max-width: 1500px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}
.page-bg {
  background: linear-gradient(180deg, #f6fbf5 0%, #eef7ea 100%);
}
</style>