"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJobPosition = exports.updateJobPosition = exports.createJobPosition = exports.getJobPositions = void 0;
const db_1 = __importDefault(require("../config/db"));
const getJobPositions = async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
      SELECT id, category, title, requirements, salary_range, vacancy_count, display_order, is_active, created_at
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
const createJobPosition = async (req, res) => {
    try {
        const { category, title, requirements, salary_range, vacancy_count, display_order, is_active } = req.body;
        // Validate required fields
        if (!category || !title || !requirements || !salary_range) {
            return res.status(400).json({
                error: 'Missing required fields: category, title, requirements, salary_range'
            });
        }
        const result = await db_1.default.query('INSERT INTO job_positions (category, title, requirements, salary_range, vacancy_count, display_order, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())', [category, title, requirements, salary_range, vacancy_count, display_order, is_active || 1]);
        const newId = result[0].insertId;
        // Return the created record
        const [createdRow] = await db_1.default.query('SELECT id, category, title, requirements, salary_range, vacancy_count, display_order, is_active, created_at FROM job_positions WHERE id = ?', [newId]);
        res.status(201).json(createdRow[0]);
    }
    catch (error) {
        console.error('[创建招聘岗位错误]', error);
        res.status(500).json({
            error: 'Failed to create job position',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.createJobPosition = createJobPosition;
const updateJobPosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, title, requirements, salary_range, vacancy_count, display_order, is_active } = req.body;
        // Validate required fields
        if (!id) {
            return res.status(400).json({
                error: 'Job position ID is required'
            });
        }
        // Validate that the job position exists
        const [existing] = await db_1.default.query('SELECT id FROM job_positions WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                error: 'Job position not found'
            });
        }
        // Update the job position
        const result = await db_1.default.query('UPDATE job_positions SET category = ?, title = ?, requirements = ?, salary_range = ?, vacancy_count = ?, display_order = ?, is_active = ? WHERE id = ?', [category, title, requirements, salary_range, vacancy_count, display_order, is_active, id]);
        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                error: 'Job position not found'
            });
        }
        // Return the updated record
        const [updatedRow] = await db_1.default.query('SELECT id, category, title, requirements, salary_range, vacancy_count, display_order, is_active, created_at FROM job_positions WHERE id = ?', [id]);
        res.json(updatedRow[0]);
    }
    catch (error) {
        console.error('[更新招聘岗位错误]', error);
        res.status(500).json({
            error: 'Failed to update job position',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.updateJobPosition = updateJobPosition;
const deleteJobPosition = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                error: 'Job position ID is required'
            });
        }
        // Soft delete by setting is_active to 0
        const result = await db_1.default.query('UPDATE job_positions SET is_active = 0 WHERE id = ?', [id]);
        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                error: 'Job position not found'
            });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('[删除招聘岗位错误]', error);
        res.status(500).json({
            error: 'Failed to delete job position',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.deleteJobPosition = deleteJobPosition;
