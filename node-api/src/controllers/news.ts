import { Request, Response } from 'express';
import pool from '../config/db';

// 定义新闻项接口
interface NewsItem {
  id: number;
  class_name: string;
  title: string;
  content: string;
  view_count: number;
  is_top: boolean;
  created_at: string;
}

export const getNews = async (req: Request, res: Response) => {
  try {
    // 查询新闻数据，按是否置顶和排序编号排序
    const [rows] = await pool.query<NewsItem[]>(`
      SELECT id, class_name, title, content, view_count, is_top, created_at
      FROM news 
      WHERE is_active = 1 
      ORDER BY is_top DESC, view_count ASC, created_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('[新闻查询错误]', error);
    res.status(500).json({ 
      error: 'Database query failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};