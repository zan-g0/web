"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 在 routes/tech.ts 中更新导入的方法名
const express_1 = __importDefault(require("express"));
const tech_1 = require("../controllers/tech");
const router = express_1.default.Router();
router.get('/introductions', tech_1.getTechIntroductions);
router.get('/achievements', tech_1.getTechAchievements);
router.get('/cooperations', tech_1.getTechCooperations);
exports.default = router;
