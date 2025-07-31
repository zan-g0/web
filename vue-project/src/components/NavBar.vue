<template>
  <nav class="navbar">
    <h1>浙江科原种业科学研究有限公司</h1>
    <p>
      <RouterLink to="/about">公司介绍</RouterLink>
      <RouterLink to="/news">新闻中心</RouterLink>
      <RouterLink to="/tech">科技创新</RouterLink>
      <RouterLink to="/product">产品中心</RouterLink>
      <RouterLink to="/job">人才招聘</RouterLink>
      <RouterLink to="/contact">联系我们</RouterLink>
    </p>
  </nav>
  <div class="content">
    <RouterView /> <!--路由出口-->
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #218a4a;
  color: #fff;
  padding: 0 32px;
  height: 64px;
}
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
    widows: 10%;
    height: auto;
}
</style>