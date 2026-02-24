"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const db_1 = __importDefault(require("../config/db"));
const getProducts = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize || '10', 10)));
        const search = req.query.search || '';
        const where = ['is_active = 1'];
        const params = [];
        if (search) {
            where.push('(name LIKE ? OR description LIKE ?)');
            const like = `%${search}%`;
            params.push(like, like);
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const offset = (page - 1) * pageSize;
        // 总数查询
        const countSql = `SELECT COUNT(*) as total FROM products ${whereSql}`;
        const [countRows] = await db_1.default.query(countSql, params);
        const total = (countRows && countRows[0] && countRows[0].total) ? Number(countRows[0].total) : 0;
        // 列表查询（返回前端需要的字段）
        const listSql = `SELECT id, name, description, image_name, display_order
      FROM products ${whereSql}
      ORDER BY display_order ASC, created_at DESC
      LIMIT ? OFFSET ?`;
        const listParams = params.concat([pageSize, offset]);
        const [rows] = await db_1.default.query(listSql, listParams);
        const items = (rows || []).map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            image_name: r.image_name,
            display_order: r.display_order
        }));
        res.json({ code: 0, data: { items, total, page, pageSize } });
    }
    catch (error) {
        console.error('[产品查询错误]', error);
        res.status(500).json({
            code: -1,
            message: 'Database query failed',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getProducts = getProducts;
