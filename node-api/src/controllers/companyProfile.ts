import { Request, Response } from 'express';
import pool from '../config/db';

interface CompanyProfile {
  id: number;
  txt: string;
  order: number;
  is_active: number;
}

// 公共接口：只返回启用项（前端展示用）
export const getCompanyProfile = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, txt, `order`, is_active FROM about_profile WHERE is_active = 1 ORDER BY `order` ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('[CompanyProfile Error]', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

// 管理端：分页查询全部项
export const getCompanyProfileAdminList = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || '1');
    const size = parseInt((req.query.size as string) || '10');
    const offset = (page - 1) * size;

    const [[{ total }]]: any = await pool.query('SELECT COUNT(*) as total FROM about_profile');
    const [rows]: any = await pool.query(
      'SELECT id, txt, `order`, is_active FROM about_profile ORDER BY `order` ASC LIMIT ?, ?',
      [offset, size]
    );

    res.json({ data: rows, total });
  } catch (error) {
    console.error('[CompanyProfile Admin List Error]', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

// 管理端：新增
export const createCompanyProfile = async (req: Request, res: Response) => {
  try {
    const { txt, order = 0, is_active = 1 } = req.body;
    const [result]: any = await pool.query('INSERT INTO about_profile (txt, `order`, is_active) VALUES (?, ?, ?)', [
      txt,
      order,
      is_active,
    ]);
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('[CompanyProfile Create Error]', error);
    res.status(500).json({ error: 'Create failed' });
  }
};

// 管理端：更新
export const updateCompanyProfile = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    console.log('[updateCompanyProfile] raw body:', req.body);

    const body: any = req.body || {};
    const sets: string[] = [];
    const params: any[] = [];

    if ('txt' in body) {
      const txt = String(body.txt ?? '').trim();
      // 如果前端传空字符串也可以允许，视业务决定；这里允许但会保存空字符串
      sets.push('txt = ?');
      params.push(txt);
    }
    if ('order' in body) {
      const orderNum = Number(body.order) || 0;
      sets.push('`order` = ?');
      params.push(orderNum);
    }
    if ('is_active' in body) {
      const isActiveNum = Number(body.is_active) === 1 ? 1 : 0;
      sets.push('is_active = ?');
      params.push(isActiveNum);
    }

    if (sets.length === 0) {
      return res.status(400).json({ success: false, message: '没有可更新的字段' });
    }

    // 拼接 SQL
    const sql = `UPDATE about_profile SET ${sets.join(', ')} WHERE id = ?`;
    params.push(id);

    console.log('[updateCompanyProfile] SQL:', sql, 'params:', params);
    const [result]: any = await pool.query(sql, params);

    if (result && result.affectedRows !== undefined && result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '未找到要更新的记录' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[CompanyProfile Update Error]', error);
    res.status(500).json({ success: false, message: 'Update failed', error: (error as Error).message });
  }
};

// 管理端：删除
export const deleteCompanyProfile = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await pool.query('DELETE FROM about_profile WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('[CompanyProfile Delete Error]', error);
    res.status(500).json({ error: 'Delete failed' });
  }
};