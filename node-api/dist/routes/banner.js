"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const banner_1 = require("../controllers/banner");
const router = (0, express_1.Router)();
router.get("/", banner_1.getBanners);
exports.default = router;
