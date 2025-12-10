"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const honnor_1 = require("../controllers/honnor");
const router = (0, express_1.Router)();
// 公共：启用的荣誉
router.get("/", honnor_1.getHonnors);
// 管理：分页 / 增 / 改 / 删
router.get("/admin", honnor_1.getHonnorsAdminList);
router.post("/admin", honnor_1.createHonnor);
router.put("/admin/:id", honnor_1.updateHonnor);
router.delete("/admin/:id", honnor_1.deleteHonnor);
exports.default = router;
