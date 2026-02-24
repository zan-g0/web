<template>
  <footer ref="footerRef" :class="[{ 'fixed-footer': isFixed }, 'footer']">
    <div>
      <small>
        &copy; {{ year }} 浙江科原种业科学研究有限公司 版权所有
      </small>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const year = new Date().getFullYear()

// 新增：用于判断并应用固定底部
const footerRef = ref<HTMLElement | null>(null);
const isFixed = ref(false);

const applyFooterPosition = () => {
  const footerEl = footerRef.value;
  if (!footerEl) return;

  // 为避免自身对测量的影响（之前设置的 paddingBottom 会改变 scrollHeight），
  // 临时移除我们可能设置的 paddingBottom 以获得真实内容高度。
  const previousPadding = document.body.style.paddingBottom || '';
  document.body.style.paddingBottom = '';

  // 页面实际内容高度（不包含我们临时的 padding）
  const bodyHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  const viewportHeight = window.innerHeight;

  const footerHeight = Math.ceil(footerEl.getBoundingClientRect().height || 0);

  // 恢复之前的 padding（稍后会根据计算决定是否重新设置）
  document.body.style.paddingBottom = previousPadding;

  // 使用少量容差避免因像素级微小变化导致频繁切换
  const TOLERANCE = 3;

  if (bodyHeight <= viewportHeight + TOLERANCE) {
    if (!isFixed.value) {
      isFixed.value = true;
      document.body.style.paddingBottom = `${footerHeight}px`;
    }
  } else {
    if (isFixed.value) {
      isFixed.value = false;
      document.body.style.paddingBottom = '';
    }
  }
};

onMounted(() => {
  // 防抖，避免短时间内频繁计算导致抖动
  let timer: number | null = null;
  const debouncedApply = () => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      applyFooterPosition();
      timer = null;
    }, 120);
  };

  // 初始计算
  applyFooterPosition();

  window.addEventListener('resize', debouncedApply);

  // 也在 DOM 变更后再次计算（例如 SPA 路由切换后、异步内容加载或地图交互）
  const mo = new MutationObserver(() => debouncedApply());
  mo.observe(document.body, { childList: true, subtree: true });
  (window as any).__footerMutationObserver = mo;

  // 清理函数在卸载时执行
  onUnmounted(() => {
    window.removeEventListener('resize', debouncedApply);
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
    const existing = (window as any).__footerMutationObserver;
    if (existing) {
      existing.disconnect();
      (window as any).__footerMutationObserver = null;
    }
  });
});
</script>

<style scoped>
.footer {
  background: #222;
  color: #fff;
  text-align: center;
  padding: 12px;
  font-size: 20px;
  letter-spacing: 1px;
}

.fixed-footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 50;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.08);
  margin-top: 0;
}
</style>