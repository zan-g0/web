
import { Router } from "express";
import { getBanners, createBanner, updateBanner, deleteBanner } from "../controllers/banner";
const router = Router();

// 获取轮播图列表
router.get("/", getBanners);
// 新增轮播图
router.post("/", createBanner);
// 编辑轮播图
router.put("/:id", updateBanner);
// 删除轮播图
router.delete("/:id", deleteBanner);

export default router;
