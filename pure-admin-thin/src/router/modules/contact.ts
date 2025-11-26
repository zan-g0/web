// 最简代码，也就是这些字段必须有
export default {
  path: "/fighting",
  meta: {
    title: "联系我们",
    rank: 6
  },
  children: [
    {
      path: "/contact/index",
      name: "contact",
      component: () => import("@/views/contact/index.vue"),
      meta: {
        title: "联系方式管理",
        // 通过设置showParent为true，显示父级
        showParent: true
      }
    }
  ]
};
