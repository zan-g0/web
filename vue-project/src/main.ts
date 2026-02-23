import { createApp } from 'vue'
import App from './App.vue'
import {createRouter,createWebHistory} from 'vue-router'
import 'element-plus/dist/index.css'
import './assets/css/tailwind.css'
import { ElButton, ElCard, ElContainer, ElHeader, ElMain, ElAside, ElFooter, ElMenu, ElMenuItem, ElSubMenu, ElDropdown, ElDropdownMenu, ElDropdownItem, ElInput, ElSelect, ElOption, ElTable, ElTableColumn, ElPagination, ElMessage, ElMessageBox, ElNotification, ElAvatar, ElIcon, ElBadge, ElTabs, ElTabPane, ElDatePicker, ElTimePicker, ElUpload, ElProgress, ElTag, ElAlert, ElCarousel, ElCarouselItem, ElCollapse, ElCollapseItem, ElDivider, ElDialog, ElDrawer, ElEmpty, ElPopconfirm, ElTooltip, ElPopover, ElSkeleton, ElSkeletonItem, ElSwitch, ElSlider, ElRate, ElCascader, ElCheckbox, ElRadio, ElForm, ElFormItem, ElCol, ElRow, ElLink, ElBreadcrumb, ElBreadcrumbItem, ElImage, ElScrollbar, ElBacktop, ElInfiniteScroll, ElLoading } from 'element-plus'
import scrollAnimation from './plugins/scrollAnimation'

const app = createApp(App)

// 注册 Element Plus 组件
app.use(ElButton)
app.use(ElCard)
app.use(ElContainer)
app.use(ElHeader)
app.use(ElMain)
app.use(ElAside)
app.use(ElFooter)
app.use(ElMenu)
app.use(ElMenuItem)
app.use(ElSubMenu)
app.use(ElDropdown)
app.use(ElDropdownMenu)
app.use(ElDropdownItem)
app.use(ElInput)
app.use(ElSelect)
app.use(ElOption)
app.use(ElTable)
app.use(ElTableColumn)
app.use(ElPagination)
app.use(ElMessage)
app.use(ElMessageBox)
app.use(ElNotification)
app.use(ElAvatar)
app.use(ElIcon)
app.use(ElBadge)
app.use(ElTabs)
app.use(ElTabPane)
app.use(ElDatePicker)
app.use(ElTimePicker)
app.use(ElUpload)
app.use(ElProgress)
app.use(ElTag)
app.use(ElAlert)
app.use(ElCarousel)
app.use(ElCarouselItem)
app.use(ElCollapse)
app.use(ElCollapseItem)
app.use(ElDivider)
app.use(ElDialog)
app.use(ElDrawer)
app.use(ElEmpty)
app.use(ElPopconfirm)
app.use(ElTooltip)
app.use(ElPopover)
app.use(ElSkeleton)
app.use(ElSkeletonItem)
app.use(ElSwitch)
app.use(ElSlider)
app.use(ElRate)
app.use(ElCascader)
app.use(ElCheckbox)
app.use(ElRadio)
app.use(ElForm)
app.use(ElFormItem)
app.use(ElCol)
app.use(ElRow)
app.use(ElLink)
app.use(ElBreadcrumb)
app.use(ElBreadcrumbItem)
app.use(ElImage)
app.use(ElScrollbar)
app.use(ElBacktop)
app.use(ElInfiniteScroll)
app.use(ElLoading)
app.use(scrollAnimation as any)
import about from "@/pages/about.vue"
import contact from "@/pages/contact.vue"
import job from "@/pages/job.vue"
import news from "@/pages/news.vue"
import product from "@/pages/product.vue"

// 1.配置路由规则
const routes=[
    {path:"/", redirect:"/about"},
    {path:"/about", component: about},
    {path:"/news", component: news},
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
app.use(router)

app.mount('#app')

