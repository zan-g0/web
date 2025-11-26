"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyInfo_1 = require("../controllers/companyInfo");
const router = (0, express_1.Router)();
router.get('/culture', companyInfo_1.getCompanyCulture);
router.get('/honors', companyInfo_1.getCompanyHonors);
exports.default = router;
