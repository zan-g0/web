import { Request, Response } from 'express';
import pool from '../config/db';

interface BannerRow {
  image_name: string;
}

export const getBanners = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<BannerRow[]>(
      `SELECT image_name FROM banners `
    );
    res.json(rows.map(row => row.image_name));
  } catch (error) {
    console.error('完整错误堆栈:', error); 
    res.status(500).json({ 
      error: 'Internal Server Error',
    });
  }
};