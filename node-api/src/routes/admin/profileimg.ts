import { Router } from "express";
import {
  getprofileimage,
  createprofileimage,
  deleteprofileimage,
} from "../../controllers/admin/profileimg";

const router = Router();

// 获取所有启用的简介图片
router.get("/", getprofileimage);
// 创建新的简介图片
router.post("/", createprofileimage);
// 删除简介图片
router.delete("/:id", deleteprofileimage);

export default router;
