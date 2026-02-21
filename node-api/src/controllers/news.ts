import { Request, Response } from 'express';
import pool from '../config/db';

// 定义新闻项接口
interface NewsItem {
	id: number;
	title: string;
	summary: string;
	cover_image?: string | null;
	category?: string | null;
	author?: string | null;
	publish_date?: string | null;
	views?: number;
}

// GET /news  列表查询，支持分页、分类、关键词搜索、排序
export const getNews = async (req: Request, res: Response) => {
	try {
		const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
		const pageSize = Math.min(100, Math.max(1, parseInt((req.query.pageSize as string) || '10', 10)));
		const category = (req.query.category as string) || '';
		const search = (req.query.search as string) || '';
		const sort = (req.query.sort as string) || 'publish_date';
		const order = (req.query.order as string) === 'asc' ? 'ASC' : 'DESC';

		const where: string[] = [`status = 'published'`];
		const params: any[] = [];

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
		const [countRows]: any = await pool.query(countSql, params);
		const total = (countRows && countRows[0] && countRows[0].total) ? Number(countRows[0].total) : 0;

		// 列表查询（只返回前端所需字段）
		const listSql = `SELECT id, title, summary, cover_image, category, author, publish_date, views
			FROM news ${whereSql}
			ORDER BY ${sort} ${order}
			LIMIT ? OFFSET ?`;

		const listParams = params.concat([pageSize, offset]);
		const [rows]: any = await pool.query(listSql, listParams);

		const items: NewsItem[] = (rows || []).map((r: any) => ({
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
	} catch (err) {
		console.error('getNews error', err);
		res.status(500).json({ code: -1, message: '查询新闻失败' });
	}
};

export default getNews;

// GET /news/:id  获取单条详情并增加浏览量
export const getNewsDetail = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id)) return res.status(400).json({ code: -1, message: '无效的 id' });

		// 先查询详情
		const sql = 'SELECT id, title, summary, content, cover_image, category, author, publish_date, views FROM news WHERE id = ? AND status = \"published\" LIMIT 1';
		const [rows]: any = await pool.query(sql, [id]);
		const item = rows && rows[0];
		if (!item) return res.status(404).json({ code: -1, message: '新闻未找到' });

		// 异步增加 views（不阻塞返回）
		pool.query('UPDATE news SET views = views + 1 WHERE id = ?', [id]).catch((e: any) => console.error('inc views error', e));

		res.json({ code: 0, data: item });
	} catch (err) {
		console.error('getNewsDetail error', err);
		res.status(500).json({ code: -1, message: '查询新闻详情失败' });
	}
};