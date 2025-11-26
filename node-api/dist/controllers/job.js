"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobPositions = exports.getTalentConcept = void 0;
const db_1 = __importDefault(require("../config/db"));
const getTalentConcept = async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
      SELECT id, title, content, display_order
      FROM talent_concept 
      WHERE is_active = 1 
      ORDER BY display_order ASC
      LIMIT 1
    `);
        res.json(rows.length > 0 ? rows[0] : null);
    }
    catch (error) {
        console.error('[人才理念查询错误]', error);
        res.status(500).json({
            error: 'Database query failed',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getTalentConcept = getTalentConcept;
const getJobPositions = async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
      SELECT id, category, title, requirements, salary_range, vacancy_count, display_order
      FROM job_positions 
      WHERE is_active = 1 
      ORDER BY display_order ASC, created_at DESC
    `);
        res.json(rows);
    }
    catch (error) {
        console.error('[招聘岗位查询错误]', error);
        res.status(500).json({
            error: 'Database query failed',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getJobPositions = getJobPositions;
