import { Request, Response } from 'express';
import pool from '../config/db';

export const getprofile = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, txt, `order`, is_active FROM about_profile WHERE is_active = 1 ORDER BY `order` ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('[profile Error]', error);
    res.status(500).json({ error: '公司介绍查询失败' });
  }
};