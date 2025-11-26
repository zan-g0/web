"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyHonors = exports.getCompanyCulture = void 0;
const db_1 = __importDefault(require("../config/db"));
const getCompanyCulture = async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
      SELECT id, title, content, icon_img 
      FROM company_culture 
      WHERE is_active = 1 
      ORDER BY \`order\` ASC
    `);
        // 解析JSON格式的content
        const result = rows.map(row => ({
            ...row,
            content: JSON.parse(row.content)
        }));
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Database query failed' });
    }
};
exports.getCompanyCulture = getCompanyCulture;
const getCompanyHonors = async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
      SELECT id, title, description, image 
      FROM company_honors 
      WHERE is_active = 1 
      ORDER BY \`order\` ASC
    `);
        res.json(rows);
    }
    catch (error) {
        console.error('[企业荣誉查询错误]', error);
        res.status(500).json({
            error: 'Database query failed',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getCompanyHonors = getCompanyHonors;
