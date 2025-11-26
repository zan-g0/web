// 最简代码，也就是这些字段必须有
export default {
  path: "/job",
  meta: {
    title: "招聘",
    rank:5

  },
  children: [
    {
      path: "/job/index",
      name: "job",
      component: () => import("@/views/job/index.vue"),
      meta: {
        title: "招聘",
        // 通过设置showParent为true，显示父级
        showParent: true
      }
    }
  ]
};
