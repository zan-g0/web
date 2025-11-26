// 最简代码，也就是这些字段必须有
export default {
  path: "/tech",
  meta: {
    title: "科技创新",
    rank: 3
  },
  children: [
    {
      path: "/tech/index",
      name: "tech",
      component: () => import("@/views/tech/index.vue"),
      meta: {
        title: "加油"
      }
    },
    {
      path: "/tech/introductions",
      name: "introductions",
      component: () => import("@/views/tech/introductions.vue"),
      meta: {
        title: "introductions"
      }
    }
  ]
};
