"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const banner_1 = require("../controllers/banner");
const router = (0, express_1.Router)();
// 获取轮播图列表
router.get("/", banner_1.getBanners);
// 新增轮播图
router.post("/", banner_1.createBanner);
// 编辑轮播图
router.put("/:id", banner_1.updateBanner);
// 删除轮播图
router.delete("/:id", banner_1.deleteBanner);
exports.default = router;
