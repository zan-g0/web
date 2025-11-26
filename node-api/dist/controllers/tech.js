"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTechCooperations = exports.getTechAchievements = exports.getTechIntroductions = void 0;
const db_1 = __importDefault(require("../config/db"));
const getTechIntroductions = async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
      SELECT id, title, content, image_url, display_order
      FROM tech_introductions 
      WHERE is_active = 1 
      ORDER BY display_order ASC
    `);
        res.json(rows);
    }
    catch (error) {
        console.error('[科技介绍查询错误]', error);
        res.status(500).json({
            error: 'Database query failed',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getTechIntroductions = getTechIntroductions;
const getTechAchievements = async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
      SELECT id, variety_name, lodging_resistance, blast_resistance, yield_performance, display_order
      FROM tech_achievements 
      WHERE is_active = 1 
      ORDER BY display_order ASC
    `);
        res.json(rows);
    }
    catch (error) {
        console.error('[科技成果查询错误]', error);
        res.status(500).json({
            error: 'Database query failed',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getTechAchievements = getTechAchievements;
const getTechCooperations = async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
      SELECT id, title, description, image_urls, display_order
      FROM tech_cooperations 
      WHERE is_active = 1 
      ORDER BY display_order ASC
    `);
        // 安全地解析JSON字符串
        const result = rows.map(row => {
            try {
                return {
                    ...row,
                    image_urls: row.image_urls ? JSON.parse(row.image_urls) : []
                };
            }
            catch (e) {
                console.error(`解析image_urls失败 (ID: ${row.id}):`, e);
                return {
                    ...row,
                    image_urls: [] // 解析失败时返回空数组
                };
            }
        });
        res.json(result);
    }
    catch (error) {
        console.error('[技术合作查询错误]', error);
        res.status(500).json({
            error: 'Database query failed',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getTechCooperations = getTechCooperations;
