"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyProfile_1 = require("../controllers/companyProfile");
const router = (0, express_1.Router)();
// 公共：获取启用的公司简介
router.get("/", companyProfile_1.getCompanyProfile);
// 管理：分页 / 增 / 改 / 删
router.get("/admin", companyProfile_1.getCompanyProfileAdminList);
router.post("/admin", companyProfile_1.createCompanyProfile);
router.put("/admin/:id", companyProfile_1.updateCompanyProfile);
router.delete("/admin/:id", companyProfile_1.deleteCompanyProfile);
exports.default = router;
