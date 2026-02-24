import { Request, Response } from 'express';
import pool from '../config/db';

// 数据库返回的原始类型
interface DBCultureItem {
  id: number;
  title: string;
  content: string;
  icon_img: string;
}

export const getCulture = async (req: Request, res: Response) => {
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
    res.status(500).json({ error: '公司文化查询失败' });
  }
};