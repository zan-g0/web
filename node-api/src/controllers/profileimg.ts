import { Request, Response } from 'express';
import pool from '../config/db';

export const getprofileimage = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT image_name 
      FROM profileimage
      WHERE is_active = 1 
      ORDER BY \`order\` ASC
    `);
    res.json((rows as any[]).map(row => row.image_name));
  } catch (error) {
    console.error('[profileimage Error]', error);
    res.status(500).json({ error: '公司图片查询失败' });
  }
};