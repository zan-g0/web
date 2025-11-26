// 最简代码，也就是这些字段必须有
export default {
  path: "/product",
  meta: {
    title: "产品管理",
    rank:4
  },
  children: [
    {
      path: "/product/index",
      name: "product",
      component: () => import("@/views/product/index.vue"),
      meta: {
        title: "产品管理",
        // 通过设置showParent为true，显示父级
        showParent: true
      }
    }
  ]
};
