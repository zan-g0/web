import { Request, Response } from 'express';
import pool from '../config/db';

// 定义科技介绍接口
interface TechIntroduction {
  id: number;
  title: string;
  content: string;
  image_url: string;
  display_order: number;
}

// 定义科技成果接口
interface TechAchievement {
  id: number;
  variety_name: string;
  lodging_resistance: string;
  blast_resistance: string;
  yield_performance: string;
  display_order: number;
}

// 定义技术合作接口
interface TechCooperation {
  id: number;
  title: string;
  description: string;
  image_urls: string[];
  display_order: number;
}

export const getTechIntroductions = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<TechIntroduction[]>(`
      SELECT id, title, content, image_url, display_order
      FROM tech_introductions 
      WHERE is_active = 1 
      ORDER BY display_order ASC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('[科技介绍查询错误]', error);
    res.status(500).json({ 
      error: 'Database query failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getTechAchievements = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<TechAchievement[]>(`
      SELECT id, variety_name, lodging_resistance, blast_resistance, yield_performance, display_order
      FROM tech_achievements 
      WHERE is_active = 1 
      ORDER BY display_order ASC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('[科技成果查询错误]', error);
    res.status(500).json({ 
      error: 'Database query failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getTechCooperations = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<any[]>(`
      SELECT id, title, description, image_urls, display_order
      FROM tech_cooperations 
      WHERE is_active = 1 
      ORDER BY display_order ASC
    `);
    
    // 安全地解析JSON字符串
    const result: TechCooperation[] = rows.map(row => {
      try {
        return {
          ...row,
          image_urls: row.image_urls ? JSON.parse(row.image_urls) : []
        };
      } catch (e) {
        console.error(`解析image_urls失败 (ID: ${row.id}):`, e);
        return {
          ...row,
          image_urls: [] // 解析失败时返回空数组
        };
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('[技术合作查询错误]', error);
    res.status(500).json({ 
      error: 'Database query failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};