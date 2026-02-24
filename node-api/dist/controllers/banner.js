"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBanners = void 0;
const db_1 = __importDefault(require("../config/db"));
const getBanners = async (req, res) => {
    try {
        const [rows] = await db_1.default.query("SELECT id, image_name FROM banners");
        res.json(rows);
    }
    catch (error) {
        console.error("getBanners error:", error);
        res.status(500).json({ message: "获取轮播图失败" });
    }
};
exports.getBanners = getBanners;
