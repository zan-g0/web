export default {
  path: "/gsjs",
  meta: {
    title: "公司介绍",
    rank:1
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
      path: "/gsjs/profile_img",
      name: "公司简介图",
      component: () => import("@/views/gsjs/profile_img.vue"),
      meta: {
        title: "公司简介图"
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
      path: "/gsjs/honnors",
      name: "荣誉资质",
      component: () => import("@/views/gsjs/honnors.vue"),
      meta: {
        title: "荣誉资质"
      }
    }
  ]
};
