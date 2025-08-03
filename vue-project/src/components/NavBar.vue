<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top" style="background:#218a4a;">
    <div class="container-fluid">
      <h1 class="navbar-brand mb-0" style="font-size:22px;">浙江科原种业科学研究有限公司</h1>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="切换导航"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item" v-for="item in navs" :key="item.to">
            <RouterLink class="nav-link" :to="item.to" @click="closeMenu">{{ item.text }}</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="content">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
const navs = [
  { to: "/about", text: "公司介绍" },
  { to: "/news", text: "新闻中心" },
  { to: "/tech", text: "科技创新" },
  { to: "/product", text: "产品中心" },
  { to: "/job", text: "人才招聘" },
  { to: "/contact", text: "联系我们" }
]
function closeMenu() {
  const nav = document.getElementById('mainNav')
  // 关键：类型断言
  const win = window as any
  if (nav && nav.classList.contains('show')) {
    win.bootstrap && win.bootstrap.Collapse
      ? new win.bootstrap.Collapse(nav, { toggle: true })
      : nav.classList.remove('show')
  }
}
  </script>

<style scoped>
.navbar h1 {
  font-size: 25px;
  margin: 0;
  color: #fff;
  white-space: nowrap;
}
.navbar p {
  margin: 0;
  display: flex;
  gap: 18px;
}
a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.2s;
}
.content {
  padding-top: 50px;
}
</style>