<template>
  <footer class="footer">
    <div>
      <small>
        &copy; {{ year }} 浙江科原种业科学研究有限公司 版权所有
      </small>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: #222;
  color: #fff;
  text-align: center;
  padding: 12px;
  font-size: 20px;
  letter-spacing: 1px;
  margin-top: 40px;
}
</style>