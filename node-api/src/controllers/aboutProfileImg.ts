import { Request, Response } from 'express';
import pool from '../config/db';

export const getProfileImage = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT img_name 
      FROM about_profile_img 
      WHERE is_active = 1 
      ORDER BY \`order\` ASC
    `);
    res.json((rows as any[]).map(row => row.img_name));
  } catch (error) {
    console.error('[ProfileImg Error]', error);
    res.status(500).json({ error: '公司图片查询失败' });
  }
};