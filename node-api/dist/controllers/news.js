"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNews = void 0;
const db_1 = __importDefault(require("../config/db"));
const getNews = async (req, res) => {
    try {
        // 查询新闻数据，按是否置顶和排序编号排序
        const [rows] = await db_1.default.query(`
      SELECT id, class_name, title, content, view_count, is_top, created_at
      FROM news 
      WHERE is_active = 1 
      ORDER BY is_top DESC, view_count ASC, created_at DESC
    `);
        res.json(rows);
    }
    catch (error) {
        console.error('[新闻查询错误]', error);
        res.status(500).json({
            error: 'Database query failed',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getNews = getNews;
