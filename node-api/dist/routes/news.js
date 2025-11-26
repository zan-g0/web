"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const news_1 = require("../controllers/news");
const router = express_1.default.Router();
router.get('/', news_1.getNews);
exports.default = router;
