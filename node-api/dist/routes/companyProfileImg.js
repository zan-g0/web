"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyProfileImg_1 = require("../controllers/companyProfileImg");
const router = (0, express_1.Router)();
// 公共：已启用图片
router.get("/", companyProfileImg_1.getCompanyProfileImg);
// 管理：分页 / 增 / 改 / 删
router.get("/admin", companyProfileImg_1.getCompanyProfileImgList);
router.post("/admin", companyProfileImg_1.createCompanyProfileImg);
router.put("/admin/:id", companyProfileImg_1.updateCompanyProfileImg);
router.delete("/admin/:id", companyProfileImg_1.deleteCompanyProfileImg);
exports.default = router;
