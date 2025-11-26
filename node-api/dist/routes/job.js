"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/job.ts
const express_1 = __importDefault(require("express"));
const job_1 = require("../controllers/job");
const router = express_1.default.Router();
router.get('/talent-concept', job_1.getTalentConcept);
router.get('/positions', job_1.getJobPositions);
exports.default = router;
