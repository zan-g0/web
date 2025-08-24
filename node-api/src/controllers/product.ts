import { Request, Response } from 'express';
import pool from '../config/db';

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  display_order: number;
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<Product[]>(`
      SELECT id, name, description, image_url, display_order
      FROM products 
      WHERE is_active = 1 
      ORDER BY display_order ASC, created_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('[产品查询错误]', error);
    res.status(500).json({ 
      error: 'Database query failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};
