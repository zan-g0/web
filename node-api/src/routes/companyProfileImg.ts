import { Router } from "express";
import {
  getCompanyProfileImg,
  getCompanyProfileImgList,
  createCompanyProfileImg,
  updateCompanyProfileImg,
  deleteCompanyProfileImg,
} from "../controllers/companyProfileImg";

const router = Router();

// 公共：已启用图片
router.get("/", getCompanyProfileImg);

// 管理：分页 / 增 / 改 / 删
router.get("/admin", getCompanyProfileImgList);
router.post("/admin", createCompanyProfileImg);
router.put("/admin/:id", updateCompanyProfileImg);
router.delete("/admin/:id", deleteCompanyProfileImg);

export default router;