export default {
  path: "/gsjs",
  meta: {
    title: "公司介绍"
  },
  children: [
    {
      path: "/gsjs/banners",
      name: "轮播图",
      component: () => import("@/views/gsjs/banners.vue"),
      meta: {
        title: "轮播图"
      }
    },
    {
      path: "/gsjs/profile",
      name: "公司简介",
      component: () => import("@/views/gsjs/profile.vue"),
      meta: {
        title: "公司简介"
      }
    },
    {
      path: "/gsjs/culture",
      name: "公司文化",
      component: () => import("@/views/gsjs/culture.vue"),
      meta: {
        title: "公司文化"
      }
    },
    {
      path: "/gsjs/honnor",
      name: "荣誉资质",
      component: () => import("@/views/gsjs/honnor.vue"),
      meta: {
        title: "荣誉资质"
      }
    }
  ]
};
