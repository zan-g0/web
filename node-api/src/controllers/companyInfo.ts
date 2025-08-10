import { Request, Response } from 'express';
import pool from '../config/db';

// 数据库返回的原始类型
interface DBCultureItem {
  id: number;
  title: string;
  content: string; // 注意这里是string（存储JSON字符串）
  icon_img: string;
}

interface HonorItem {
  id: number;
  title: string;
  description: string;
  image: string;
}    
export const getCompanyCulture = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<DBCultureItem[]>(`
      SELECT id, title, content, icon_img 
      FROM company_culture 
      WHERE is_active = 1 
      ORDER BY \`order\` ASC
    `);
    
    // 解析JSON格式的content
    const result = rows.map(row => ({
      ...row,
      content: JSON.parse(row.content) as string[]
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Database query failed' });
  }
};

export const getCompanyHonors = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<HonorItem[]>(`
      SELECT id, title, description, image 
      FROM company_honors 
      WHERE is_active = 1 
      ORDER BY \`order\` ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('[企业荣誉查询错误]', error);
    res.status(500).json({ 
      error: 'Database query failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};