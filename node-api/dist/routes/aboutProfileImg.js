"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aboutProfileImg_1 = require("../controllers/aboutProfileImg");
const router = (0, express_1.Router)();
router.get('/', aboutProfileImg_1.getProfileImage);
exports.default = router;
