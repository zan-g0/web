<template>
  <NavBar />
  <Footer />
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<style>
/* 全局浅绿色背景，覆盖 body padding-bottom 等区域，保证页面空白区和 .page-bg 一致 */
html,
body,
#app {
  height: 100%;
}

body {
  background: linear-gradient(180deg, #f6fbf5 0%, #eef7ea 100%);
}

/* 保证 RouterView 容器至少占据剩余高度，避免过短时 footer 遮挡内容 */
.content {
  min-height: calc(100vh - 120px);
  /* 预留头部+底部空间，防止内容太短 */
}
</style>