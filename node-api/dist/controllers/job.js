"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobPositions = void 0;
const db_1 = __importDefault(require("../config/db"));
const getJobPositions = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize || '10', 10)));
        const search = req.query.search || '';
        const where = ['is_active = 1'];
        const params = [];
        if (search) {
            where.push('(title LIKE ? OR requirements LIKE ? OR category LIKE ?)');
            const like = `%${search}%`;
            params.push(like, like, like);
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const offset = (page - 1) * pageSize;
        const countSql = `SELECT COUNT(*) as total FROM job_positions ${whereSql}`;
        const [countRows] = await db_1.default.query(countSql, params);
        const total = (countRows && countRows[0] && countRows[0].total) ? Number(countRows[0].total) : 0;
        const listSql = `SELECT id, category, title, requirements, salary_range, vacancy_count, display_order, created_at
      FROM job_positions
      ${whereSql}
      ORDER BY display_order ASC, created_at DESC
      LIMIT ? OFFSET ?`;
        const listParams = params.concat([pageSize, offset]);
        const [rows] = await db_1.default.query(listSql, listParams);
        const items = (rows || []).map((r) => ({
            id: r.id,
            category: r.category,
            title: r.title,
            requirements: r.requirements,
            salary_range: r.salary_range,
            vacancy_count: r.vacancy_count,
            display_order: r.display_order,
            created_at: r.created_at
        }));
        res.json({ code: 0, data: { items, total, page, pageSize } });
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
