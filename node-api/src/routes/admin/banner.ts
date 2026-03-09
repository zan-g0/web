import { Router } from "express";
import {
  getBanners,
  createBanners,
  deleteBanners
} from "../../controllers/admin/banner";
const router = Router();

// 获取轮播图列表
router.get("/", getBanners);
// 新增轮播图
router.post("/", createBanners);
// 删除轮播图
router.delete("/:id", deleteBanners);

export default router;
