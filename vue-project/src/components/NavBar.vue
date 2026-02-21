<template>
  <nav class="navbar" :class="{ 'navbar-open': isMenuOpen }">
    <div class="container">
      <div class="navbar-brand">
        <h1>浙江科原种业有限公司</h1>
      </div>

      <button
        class="navbar-toggler"
        @click="toggleMenu"
        :aria-expanded="isMenuOpen"
        aria-label="切换导航"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="navbar-collapse" :class="{ 'show': isMenuOpen }">
        <ul class="navbar-nav">
          <li class="nav-item" v-for="item in navs" :key="item.to">
            <RouterLink
              class="nav-link"
              :to="item.to"
              @click="closeMenu"
            >
              {{ item.text }}
            </RouterLink>
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
import { ref, onMounted } from 'vue'

const isMenuOpen = ref(false)

const navs = [
  { to: "/about", text: "公司介绍" },
  { to: "/news", text: "新闻中心" },
  { to: "/product", text: "产品中心" },
  { to: "/job", text: "人才招聘" },
  { to: "/contact", text: "联系我们" }
]

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

// 监听窗口大小变化，当屏幕变宽时自动关闭菜单
onMounted(() => {
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      isMenuOpen.value = false
    }
  })
})
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #218a4a 0%, #1e7a40 100%);
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  max-width: 1600px;
  margin: 0 auto;
}

.navbar-brand h1 {
  font-size: 2rem;
  margin: 0;
  color: #fff;
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: 2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.navbar-toggler {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
}

.navbar-toggler-icon {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #fff;
  transition: all 0.3s ease;
  position: relative;
}

.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #fff;
  transition: all 0.3s ease;
}

.navbar-toggler-icon::before {
  top: -8px;
}

.navbar-toggler-icon::after {
  bottom: -8px;
}

/* 当菜单打开时，汉堡图标变为X形 */
.navbar-open .navbar-toggler-icon {
  background-color: transparent;
}

.navbar-open .navbar-toggler-icon::before {
  transform: rotate(45deg) translate(5px, 5px);
  top: 0;
}

.navbar-open .navbar-toggler-icon::after {
  transform: rotate(-45deg) translate(5px, -5px);
  bottom: 0;
}

.navbar-collapse {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #218a4a;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-collapse.show {
  max-height: 300px;
}

.navbar-nav {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.nav-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-item:last-child {
  border-bottom: none;
}

.nav-link {
  display: block;
  padding: 1rem;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  text-align: left;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #ffd700;
  border-radius: 3px 3px 0 0;
}

.content {
  padding-top: 40px;
}

/* 桌面端样式 */
@media (min-width: 768px) {
  .container {
    padding: 0.5rem 2rem;
  }

  .navbar-brand h1 {
    font-size: 2.5rem;
  }

  .navbar-toggler {
    display: none;
  }

  .navbar-collapse {
    position: static;
    max-height: none;
    background: transparent;
    box-shadow: none;
    margin-left: auto;
    display: flex;
    align-items: center;
    width: auto;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }

  .navbar-collapse::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }

  .navbar-collapse.show {
    max-height: none;
  }

  .navbar-nav {
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    width: auto;
  }

  .nav-item {
    border-bottom: none;
    margin-left: 1rem;
    flex-shrink: 0;
  }

  .nav-link {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    white-space: nowrap;
  }

  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  .content {
    padding-top: 50px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0.5rem 3rem;
  }

  .navbar-brand h1 {
    font-size: 2.5rem;
  }

  .nav-item {
    margin-left: 1.5rem;
  }

  .nav-link {
    font-size: 1.2rem;
    padding: 0.5rem 1.2rem;
  }
}

@media (min-width: 1200px) {
  .container {
    padding: 0.5rem 4rem;
  }

  .navbar-brand h1 {
    font-size: 2.7rem;
  }

  .nav-item {
    margin-left: 2rem;
  }

  .nav-link {
    font-size: 1.5rem;
    padding: 0.6rem 1.5rem;
  }
}

/* 处理非常窄的桌面屏幕 */
@media (min-width: 768px) and (max-width: 991px) {
  .nav-item {
    margin-left: 0.5rem;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
  }
}
</style>