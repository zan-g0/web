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

  // 页面实际内容高度
  const bodyHeight = document.body.scrollHeight;
  const viewportHeight = window.innerHeight;

  // 当内容高度不足以填满屏幕时固定 footer
  if (bodyHeight <= viewportHeight) {
    isFixed.value = true;
    const footerHeight = Math.ceil(footerEl.getBoundingClientRect().height);
    // 防止固定后遮挡内容，给 body 底部留出相同高度
    document.body.style.paddingBottom = `${footerHeight}px`;
  } else {
    isFixed.value = false;
    document.body.style.paddingBottom = '';
  }
};

onMounted(() => {
  applyFooterPosition();
  window.addEventListener('resize', applyFooterPosition);
  // 也在 DOM 变更后再次计算（例如 SPA 路由切换后）
  // 使用简单的 MutationObserver 以应对内容异步加载场景
  const mo = new MutationObserver(() => applyFooterPosition());
  mo.observe(document.body, { childList: true, subtree: true });
  // 保持引用以便卸载时断开
  ;(window as any).__footerMutationObserver = mo;
});

onUnmounted(() => {
  window.removeEventListener('resize', applyFooterPosition);
  const mo = (window as any).__footerMutationObserver;
  if (mo) {
    mo.disconnect();
    (window as any).__footerMutationObserver = null;
  }
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