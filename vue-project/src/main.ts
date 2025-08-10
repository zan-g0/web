import { createApp } from 'vue'
import App from './App.vue'
import {createRouter,createWebHistory} from 'vue-router'
import about from "@/pages/about.vue"
import contact from "@/pages/contact.vue"
import job from "@/pages/job.vue"
import news from "@/pages/news.vue"
import product from "@/pages/product.vue"
import tech from "@/pages/tech.vue"
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap'

// 1.配置路由规则
const routes=[
    {path:"/", redirect:"/about"}, 
    {path:"/about", component: about},
    {path:"/news", component: news},
    {path:"/tech", component: tech},
    {path:"/product",component:product},
    {path:"/job",component:job},
    {path:"/contact",component:contact}
]
//2.创建路由器
const router = createRouter({
    history:createWebHistory(),
    routes
})
//3.加载路由器
const app = createApp(App)
app.use(router)

app.mount('#app')

