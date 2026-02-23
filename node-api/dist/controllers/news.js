"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsDetail = exports.getNews = void 0;
const db_1 = __importDefault(require("../config/db"));
// GET /news  列表查询，支持分页、分类、关键词搜索、排序
const getNews = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize || '10', 10)));
        const category = req.query.category || '';
        const search = req.query.search || '';
        const sort = req.query.sort || 'publish_date';
        const order = req.query.order === 'asc' ? 'ASC' : 'DESC';
        const where = [`status = 'published'`];
        const params = [];
        if (category) {
            where.push('category = ?');
            params.push(category);
        }
        if (search) {
            // 简单的模糊匹配：title / summary / content
            where.push('(title LIKE ? OR summary LIKE ? OR content LIKE ?)');
            const like = `%${search}%`;
            params.push(like, like, like);
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const offset = (page - 1) * pageSize;
        // 总数查询
        const countSql = `SELECT COUNT(*) as total FROM news ${whereSql}`;
        const [countRows] = await db_1.default.query(countSql, params);
        const total = (countRows && countRows[0] && countRows[0].total) ? Number(countRows[0].total) : 0;
        // 列表查询（只返回前端所需字段）
        const listSql = `SELECT id, title, summary, cover_image, category, author, publish_date, views
			FROM news ${whereSql}
			ORDER BY ${sort} ${order}
			LIMIT ? OFFSET ?`;
        const listParams = params.concat([pageSize, offset]);
        const [rows] = await db_1.default.query(listSql, listParams);
        const items = (rows || []).map((r) => ({
            id: r.id,
            title: r.title,
            summary: r.summary,
            cover_image: r.cover_image,
            category: r.category,
            author: r.author,
            publish_date: r.publish_date,
            views: r.views || 0
        }));
        res.json({ code: 0, data: { items, total, page, pageSize } });
    }
    catch (err) {
        console.error('getNews error', err);
        res.status(500).json({ code: -1, message: '查询新闻失败' });
    }
};
exports.getNews = getNews;
exports.default = exports.getNews;
// GET /news/:id  获取单条详情并增加浏览量
const getNewsDetail = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id))
            return res.status(400).json({ code: -1, message: '无效的 id' });
        // 先查询详情
        const sql = 'SELECT id, title, summary, content, cover_image, category, author, publish_date, views FROM news WHERE id = ? AND status = \"published\" LIMIT 1';
        const [rows] = await db_1.default.query(sql, [id]);
        const item = rows && rows[0];
        if (!item)
            return res.status(404).json({ code: -1, message: '新闻未找到' });
        // 异步增加 views（不阻塞返回）
        db_1.default.query('UPDATE news SET views = views + 1 WHERE id = ?', [id]).catch((e) => console.error('inc views error', e));
        res.json({ code: 0, data: item });
    }
    catch (err) {
        console.error('getNewsDetail error', err);
        res.status(500).json({ code: -1, message: '查询新闻详情失败' });
    }
};
exports.getNewsDetail = getNewsDetail;
