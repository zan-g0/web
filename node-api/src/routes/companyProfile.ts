import { Router } from "express";
import {
  getCompanyProfile,
  getCompanyProfileAdminList,
  createCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
} from "../controllers/companyProfile";

const router = Router();

// 公共：获取启用的公司简介
router.get("/", getCompanyProfile);

// 管理：分页 / 增 / 改 / 删
router.get("/admin", getCompanyProfileAdminList);
router.post("/admin", createCompanyProfile);
router.put("/admin/:id", updateCompanyProfile);
router.delete("/admin/:id", deleteCompanyProfile);

export default router;