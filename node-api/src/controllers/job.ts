import { Request, Response } from 'express';
import pool from '../config/db';

// 定义招聘岗位接口
interface JobPosition {
  id: number;
  category: string;
  title: string;
  requirements: string;
  salary_range: string;
  vacancy_count: number;
  display_order: number;
}

export const getJobPositions = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt((req.query.pageSize as string) || '10', 10)));
    const search = (req.query.search as string) || '';

    const where: string[] = ['is_active = 1'];
    const params: any[] = [];
    if (search) {
      where.push('(title LIKE ? OR requirements LIKE ? OR category LIKE ?)');
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const offset = (page - 1) * pageSize;

    const countSql = `SELECT COUNT(*) as total FROM job_positions ${whereSql}`;
    const [countRows]: any = await pool.query(countSql, params);
    const total = (countRows && countRows[0] && countRows[0].total) ? Number(countRows[0].total) : 0;

    const listSql = `SELECT id, category, title, requirements, salary_range, vacancy_count, display_order, created_at
      FROM job_positions
      ${whereSql}
      ORDER BY display_order ASC, created_at DESC
      LIMIT ? OFFSET ?`;
    const listParams = params.concat([pageSize, offset]);
    const [rows]: any = await pool.query(listSql, listParams);

    const items: JobPosition[] = (rows || []).map((r: any) => ({
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
  } catch (error) {
    console.error('[招聘岗位查询错误]', error);
    res.status(500).json({
      error: 'Database query failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};