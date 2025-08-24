<template>
  <section class="p-5">
    <div class="container">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
        <p class="mt-2">正在加载联系信息...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="alert alert-danger text-center">
        {{ error }}
        <button @click="fetchContactInfo" class="btn btn-sm btn-outline-danger ms-2">重试</button>
      </div>
      
      <!-- 正常状态 -->
      <template v-else>
        <div class="row align-items-stretch justify-content-between">
          <!-- 左边：联系卡片 -->
          <div class="col-lg-5 col-md-6 mb-4 mb-md-0">
            <div class="contact-card h-100">
              <div class="contact-header">
                <h1 class="contact-title">联系我们</h1>
                <div class="contact-divider"></div>
              </div>
              
              <!-- 联系信息 -->
              <div class="contact-list">
                <div class="contact-item" v-if="contactInfo.company_phone">
                  <div class="contact-icon">
                    <i class="bi bi-telephone"></i>
                  </div>
                  <div class="contact-content">
                    <span class="contact-label">公司电话</span>
                    <span class="contact-value">{{ contactInfo.company_phone }}</span>
                  </div>
                </div>
                
                <div class="contact-item" v-if="contactInfo.service_phone">
                  <div class="contact-icon">
                    <i class="bi bi-headset"></i>
                  </div>
                  <div class="contact-content">
                    <span class="contact-label">销售热线</span>
                    <span class="contact-value">{{ contactInfo.service_phone }}</span>
                  </div>
                </div>
                
                <div class="contact-item" v-if="contactInfo.fax">
                  <div class="contact-icon">
                    <i class="bi bi-printer"></i>
                  </div>
                  <div class="contact-content">
                    <span class="contact-label">传真</span>
                    <span class="contact-value">{{ contactInfo.fax }}</span>
                  </div>
                </div>
                
                <div class="contact-item" v-if="contactInfo.email">
                  <div class="contact-icon">
                    <i class="bi bi-envelope"></i>
                  </div>
                  <div class="contact-content">
                    <span class="contact-label">邮箱</span>
                    <a :href="`mailto:${contactInfo.email}`" class="contact-value contact-link">
                      {{ contactInfo.email }}
                    </a>
                  </div>
                </div>
                
                <div class="contact-item" v-if="contactInfo.postal_code">
                  <div class="contact-icon">
                    <i class="bi bi-mailbox"></i>
                  </div>
                  <div class="contact-content">
                    <span class="contact-label">邮编</span>
                    <span class="contact-value">{{ contactInfo.postal_code }}</span>
                  </div>
                </div>
                
                <div class="contact-item" v-if="contactInfo.address">
                  <div class="contact-icon">
                    <i class="bi bi-geo-alt"></i>
                  </div>
                  <div class="contact-content">
                    <span class="contact-label">地址</span>
                    <span class="contact-value">{{ contactInfo.address }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右边：地图 -->
          <div class="col-lg-7 col-md-6">
            <div class="map-container h-100">
              <div class="map-header">
                <h3 class="map-title">公司位置</h3>
                <p class="map-subtitle">欢迎前来参观洽谈</p>
              </div>
              <div id="mapContainer" class="map-content"></div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface ContactInfo {
  id: number;
  company_phone: string;
  service_phone: string;
  fax: string;
  email: string;
  postal_code: string;
  address: string;
}

// 响应式数据
const contactInfo = ref<Partial<ContactInfo>>({});
const loading = ref(true);
const error = ref('');

// 获取联系信息
const fetchContactInfo = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const response = await fetch('/api/contact');
    
    if (!response.ok) {
      throw new Error(`获取联系信息失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    contactInfo.value = data || {};
    
    // 初始化地图
    initMap();
    
  } catch (err) {
    console.error('获取联系信息失败:', err);
    error.value = err instanceof Error ? err.message : '未知错误';
  } finally {
    loading.value = false;
  }
};

// 初始化地图
const initMap = () => {
  const script = document.createElement('script');
  script.src = 'https://webapi.amap.com/maps?v=1.3&key=e07ffdf58c8e8672037bef0d6cae7d4a';
  script.onload = () => {
    // @ts-ignore
    const AMap = window.AMap;
    if (!AMap) return;

    const center = { lng: 120.56871, lat: 27.994735 };
    const address = contactInfo.value.address || '浙江省温州市瓯海区郭溪街道西陶路12号4幢';

    const map = new AMap.Map("mapContainer", {
      center: [center.lng, center.lat],
      level: 17,
      keyboardEnable: true,
      dragEnable: true,
      scrollWheel: true,
      doubleClickZoom: true,
      zoom: 16
    });

    // 添加标记
    const marker = new AMap.Marker({
      map,
      position: [center.lng, center.lat],
      icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
      offset: new AMap.Pixel(-13, -30),
    });

    // 信息窗口
    const infoWindow = new AMap.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 250px;">
          <div style="font-size: 16px; font-weight: bold; color: #2c5e2e; margin-bottom: 8px;">
            <i class="bi bi-building"></i> 浙江科原种业有限公司
          </div>
          <div style="font-size: 14px; color: #666; line-height: 1.4;">
            ${address}
          </div>
        </div>
      `,
      offset: new AMap.Pixel(0, -40)
    });
    
    // 自动打开信息窗口
    setTimeout(() => {
      infoWindow.open(map, [center.lng, center.lat]);
    }, 1000);

    marker.on('click', () => {
      infoWindow.open(map, [center.lng, center.lat]);
    });
  };
  
  document.body.appendChild(script);
};

// 组件挂载时获取数据
onMounted(() => {
  fetchContactInfo();
});
</script>

<style scoped>
.contact-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  border: 1px solid rgba(44, 94, 46, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.contact-header {
  text-align: center;
  margin-bottom: 2rem;
}

.contact-title {
  color: #2c5e2e;
  font-weight: 700;
  font-size: 2.2rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #2c5e2e 0%, #4caf50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-divider {
  height: 3px;
  background: linear-gradient(90deg, transparent, #2c5e2e, transparent);
  width: 80px;
  margin: 0 auto;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  flex-grow: 1;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border-left: 4px solid #2c5e2e;
}

.contact-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  border-left-color: #4caf50;
}

.contact-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #2c5e2e, #4caf50);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.contact-icon i {
  color: white;
  font-size: 1.2rem;
}

.contact-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.contact-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
  margin-bottom: 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-value {
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.contact-link {
  color: #2c5e2e !important;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #4caf50 !important;
  text-decoration: underline;
}

/* 地图样式 */
.map-container {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.map-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.map-title {
  color: #2c5e2e;
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.map-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.map-content {
  height: 400px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  flex-grow: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .contact-card {
    padding: 1.5rem;
  }
  
  .contact-title {
    font-size: 1.8rem;
  }
  
  .contact-item {
    padding: 0.8rem;
  }
  
  .contact-icon {
    width: 40px;
    height: 40px;
    margin-right: 0.8rem;
  }
  
  .map-container {
    padding: 1.5rem;
    margin-top: 2rem;
  }
  
  .map-content {
    height: 300px;
  }
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
  .contact-card {
    padding: 3rem;
  }
  
  .map-container {
    padding: 2.5rem;
  }
}

/* 确保两个容器高度一致 */
.row.align-items-stretch {
  min-height: 500px;
}
</style>