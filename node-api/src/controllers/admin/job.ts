import { Request, Response } from 'express';
import pool from '../../config/db';

// 定义招聘岗位接口
interface JobPosition {
  id: number;
  category: string;
  title: string;
  requirements: string;
  salary_range: string;
  vacancy_count: number;
  display_order: number;
  is_active: number;
  created_at?: Date;
  updated_at?: Date;
}

// 获取招聘岗位列表（支持分页和搜索）
export const getJobPositions = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt((req.query.pageSize as string) || '10', 10)));
    const search = (req.query.search as string) || '';
    const showAll = req.query.showAll === 'true'; // 是否显示所有（包括未启用的）

    const where: string[] = [];
    const params: any[] = [];

    if (!showAll) {
      where.push('is_active = 1');
    }

    if (search) {
      where.push('(title LIKE ? OR requirements LIKE ? OR category LIKE ?)');
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const offset = (page - 1) * pageSize;

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM job_positions ${whereSql}`;
    const [countRows]: any = await pool.query(countSql, params);
    const total = (countRows && countRows[0] && countRows[0].total) ? Number(countRows[0].total) : 0;

    // 查询列表
    const listSql = `SELECT id, category, title, requirements, salary_range, vacancy_count, display_order, is_active, created_at, updated_at
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
      is_active: r.is_active,
      created_at: r.created_at,
      updated_at: r.updated_at
    }));

    // 返回统一格式
    res.json({ 
      code: 0, 
      data: { 
        items, 
        total, 
        page, 
        pageSize 
      } 
    });
  } catch (error) {
    console.error('[招聘岗位查询错误]', error);
    res.status(500).json({
      code: 500,
      error: 'Database query failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

// 创建招聘岗位
export const createJobPosition = async (req: Request, res: Response) => {
  try {
    const { category, title, requirements, salary_range, vacancy_count, display_order, is_active } = req.body;

    // 验证必填字段
    if (!category || !title || !requirements || !salary_range) {
      return res.status(400).json({
        code: 400,
        error: '缺少必填字段'
      });
    }

    const sql = `INSERT INTO job_positions 
      (category, title, requirements, salary_range, vacancy_count, display_order, is_active, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    const [result]: any = await pool.query(sql, [
      category,
      title,
      requirements,
      salary_range,
      vacancy_count || 0,
      display_order || 0,
      is_active !== undefined ? is_active : 1
    ]);

    res.json({
      code: 0,
      data: {
        id: result.insertId,
        message: '创建成功'
      }
    });
  } catch (error) {
    console.error('[创建招聘岗位错误]', error);
    res.status(500).json({
      code: 500,
      error: '创建失败',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

// 更新招聘岗位
export const updateJobPosition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category, title, requirements, salary_range, vacancy_count, display_order, is_active } = req.body;

    if (!id) {
      return res.status(400).json({
        code: 400,
        error: '缺少ID参数'
      });
    }

    // 构建动态更新语句
    const fields: string[] = [];
    const values: any[] = [];

    if (category !== undefined) {
      fields.push('category = ?');
      values.push(category);
    }
    if (title !== undefined) {
      fields.push('title = ?');
      values.push(title);
    }
    if (requirements !== undefined) {
      fields.push('requirements = ?');
      values.push(requirements);
    }
    if (salary_range !== undefined) {
      fields.push('salary_range = ?');
      values.push(salary_range);
    }
    if (vacancy_count !== undefined) {
      fields.push('vacancy_count = ?');
      values.push(vacancy_count);
    }
    if (display_order !== undefined) {
      fields.push('display_order = ?');
      values.push(display_order);
    }
    if (is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(is_active);
    }

    // 添加更新时间
    fields.push('updated_at = NOW()');

    if (fields.length === 0) {
      return res.status(400).json({
        code: 400,
        error: '没有要更新的字段'
      });
    }

    const sql = `UPDATE job_positions SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result]: any = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        code: 404,
        error: '记录不存在'
      });
    }

    res.json({
      code: 0,
      data: {
        message: '更新成功'
      }
    });
  } catch (error) {
    console.error('[更新招聘岗位错误]', error);
    res.status(500).json({
      code: 500,
      error: '更新失败',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

// 删除招聘岗位
export const deleteJobPosition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        code: 400,
        error: '缺少ID参数'
      });
    }

    // 物理删除
    const sql = 'DELETE FROM job_positions WHERE id = ?';
    const [result]: any = await pool.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        code: 404,
        error: '记录不存在'
      });
    }

    res.json({
      code: 0,
      data: {
        message: '删除成功'
      }
    });
  } catch (error) {
    console.error('[删除招聘岗位错误]', error);
    res.status(500).json({
      code: 500,
      error: '删除失败',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

// 批量更新排序 - 使用连接池自动管理
export const updateDisplayOrder = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({
        code: 400,
        error: '无效的排序数据'
      });
    }

    // 直接使用 pool，不需要手动获取连接
    // 开始事务
    await pool.query('START TRANSACTION');

    try {
      // 批量更新
      for (const item of orders) {
        await pool.query(
          'UPDATE job_positions SET display_order = ?, updated_at = NOW() WHERE id = ?',
          [item.display_order, item.id]
        );
      }

      // 提交事务
      await pool.query('COMMIT');

      res.json({
        code: 0,
        data: {
          message: '排序更新成功'
        }
      });
    } catch (error) {
      // 回滚事务
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('[更新排序错误]', error);
    res.status(500).json({
      code: 500,
      error: '更新排序失败',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};