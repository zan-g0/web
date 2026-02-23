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
                    <Phone />
                  </div>
                  <div class="contact-content">
                    <span class="contact-label">公司电话</span>
                    <span class="contact-value">{{ contactInfo.company_phone }}</span>
                  </div>
                </div>
                
                <div class="contact-item" v-if="contactInfo.service_phone">
                  <div class="contact-icon">
                    <Headset />
                  </div>
                  <div class="contact-content">
                    <span class="contact-label">销售热线</span>
                    <span class="contact-value">{{ contactInfo.service_phone }}</span>
                  </div>
                </div>
                
                <div class="contact-item" v-if="contactInfo.fax">
                  <div class="contact-icon">
                    <Printer />
                  </div>
                  <div class="contact-content">
                    <span class="contact-label">传真</span>
                    <span class="contact-value">{{ contactInfo.fax }}</span>
                  </div>
                </div>
                
                <div class="contact-item" v-if="contactInfo.email">
                  <div class="contact-icon">
                    <Message />
                  </div>
                  <div class="contact-content">
                    <span class="contact-label">邮箱</span>
                    <span class="contact-value">{{ contactInfo.email}}</span>
                  </div>
                </div>
                
                <div class="contact-item" v-if="contactInfo.postal_code">
                  <div class="contact-icon">
                    <House />
                  </div>
                  <div class="contact-content">
                    <span class="contact-label">邮编</span>
                    <span class="contact-value">{{ contactInfo.postal_code }}</span>
                  </div>
                </div>
                
                <div class="contact-item" v-if="contactInfo.address">
                  <div class="contact-icon">
                    <Location />
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
                <h3 class="contact-title">公司位置</h3>
                <div class="contact-divider"></div>
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
import { Phone, Headset, Printer, Message, House, Location } from '@element-plus/icons-vue';

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
    
    const response = await fetch('/api/contact/admin?page=1&size=1');
    
    if (!response.ok) {
      throw new Error(`获取联系信息失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    contactInfo.value = data.data?.[0] || {};
    
    // 初始化地图
    initMap();
    
  } catch (err) {
    console.error('获取联系信息失败:', err);
    error.value = err instanceof Error ? err.message : '未知错误';
  } finally {
    loading.value = false;
  }
};

// 异步加载 AMap 并初始化地图（防止重复注入脚本与在 API 未就绪时实例化）
const loadAMap = (): Promise<any> => {
  const win = window as any;
  // 如果已经加载并且 Map 构造函数可用，直接返回
  if (win.AMap && typeof win.AMap.Map === 'function') {
    return Promise.resolve(win.AMap);
  }

  // 若已有加载中的 promise，复用它
  if (win.__amapPromise) return win.__amapPromise;

  const key = 'e07ffdf58c8e8672037bef0d6cae7d4a';
  const src = `https://webapi.amap.com/maps?v=1.3&key=${key}`;

  const p = new Promise<any>((resolve, reject) => {
    let script = document.querySelector('script[data-amap]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-amap', '1');
      script.onerror = () => reject(new Error('AMap script load error'));
      document.head.appendChild(script);
    }

    const start = Date.now();
    const timeout = 10000; // 10s 超时

    const checkReady = () => {
      if (win.AMap && typeof win.AMap.Map === 'function') {
        resolve(win.AMap);
      } else if (Date.now() - start > timeout) {
        reject(new Error('AMap 加载超时'));
      } else {
        setTimeout(checkReady, 200);
      }
    };

    // 当脚本已经存在且可能已加载，立即开始轮询检测
    script.onload = () => {
      checkReady();
    };

    // 如果脚本已经加载（比如从缓存），也开始检测
    checkReady();
  });

  win.__amapPromise = p;
  return p;
};

// 初始化地图：等待容器准备好并在构造失败时重试，适应 SPA 路由切换场景
const initMap = async () => {
  const MAX_RETRIES = 6;
  const RETRY_DELAY = 300; // ms

  const waitForContainer = async (): Promise<HTMLElement> => {
    let attempts = 0;
    while (attempts < MAX_RETRIES) {
      const el = document.getElementById('mapContainer');
      if (el && el.clientWidth > 10 && el.clientHeight > 10) return el;
      // 如果元素存在但为 0 高度或隐藏，等待并重试
      await new Promise(res => setTimeout(res, RETRY_DELAY));
      attempts++;
    }
    // 最后返回 whatever exists (可能为 null)，让调用方处理失败
    const fallback = document.getElementById('mapContainer');
    if (!fallback) throw new Error('mapContainer not found');
    return fallback;
  };

  try {
    const AMap = await loadAMap();
    await waitForContainer();

    const center = { lng: 120.56871, lat: 27.994735 };
    const address = contactInfo.value.address || '浙江省温州市瓯海区郭溪街道西陶路12号4幢';

    let lastErr: any = null;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const map = new AMap.Map('mapContainer', {
          center: [center.lng, center.lat],
          level: 17,
          keyboardEnable: true,
          dragEnable: true,
          scrollWheel: true,
          doubleClickZoom: true,
          zoom: 16,
        });

        // 添加标记
        const marker = new AMap.Marker({
          map,
          position: [center.lng, center.lat],
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          offset: new AMap.Pixel(-13, -30),
        });

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
          offset: new AMap.Pixel(0, -40),
        });

        setTimeout(() => {
          try { infoWindow.open(map, [center.lng, center.lat]); } catch (e) {}
        }, 500);

        marker.on('click', () => { infoWindow.open(map, [center.lng, center.lat]); });

        // 若容器尺寸变化导致地图未正确渲染，调用窗口 resize 逻辑
        setTimeout(() => {
          try { map && typeof map.setStatus === 'function' && map.setStatus(); } catch (e) {}
        }, 600);

        // 成功则返回
        return;
      } catch (err) {
        lastErr = err;
        // 如果是内部库因为某些未就绪状态抛出的类型错误，等待再重试
        await new Promise(res => setTimeout(res, RETRY_DELAY));
      }
    }

    // 所有重试失败，记录错误
    console.error('初始化地图失败（重试后）:', lastErr);
  } catch (err) {
    console.error('初始化地图失败:', err);
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchContactInfo();
});
</script>

<style scoped>
.contact-card {
  background: linear-gradient(180deg, #f6fbf5 0%, #eef7ea 100%);
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

.contact-icon svg {
  color: white;
  width: 24px;
  height: 24px;
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
  background: linear-gradient(180deg, #f6fbf5 0%, #eef7ea 100%);
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

/* 确保两个容器高度一致并在宽屏时左右并列 */
.row.align-items-stretch {
  min-height: 500px;
  display: flex;
  align-items: stretch;
  justify-content: space-between; /* 左右两列固定宽度，中间留出剩余空间 */
  gap: 0;
  flex-wrap: nowrap;
  box-sizing: border-box;
  width: 100%;
}

/* 指定左右列在中大屏幕的宽度比 (left: ~41.7%, right: ~58.3%) */
@media (min-width: 768px) {
  /* 左侧约 30%，右侧约 60%，中间剩余 ~10% 作为间隙 */
  .row.align-items-stretch > .col-lg-5 {
    flex: 0 0 35%;
    max-width: 35%;
  }

  .row.align-items-stretch > .col-lg-7 {
    flex: 0 0 64%;
    max-width: 64%;
  }
}

/* 小屏幕强制垂直堆叠，移除行内间距 */
@media (max-width: 767.98px) {
  .row.align-items-stretch {
    display: block;
  }

  .row.align-items-stretch > [class*="col-"] {
    max-width: 100% !important;
    flex: 0 0 100% !important;
  }
}
</style>