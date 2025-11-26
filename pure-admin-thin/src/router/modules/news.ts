// 最简代码，也就是这些字段必须有
export default {
  path: "/news",
  meta: {
    title: "新闻中心管理",
    rank:2
  },
  children: [
    {
      path: "/news/index",
      name: "news",
      component: () => import("@/views/news/index.vue"),
      meta: {
        title: "新闻中心管理",
        // 通过设置showParent为true，显示父级
        showParent: true
      }
    }
  ]
};
