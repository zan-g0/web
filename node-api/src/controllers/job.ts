import { Request, Response } from 'express';
import pool from '../config/db';

// 定义人才理念接口
interface TalentConcept {
  id: number;
  title: string;
  content: string;
  display_order: number;
}

// 定义招聘岗位接口
interface JobPosition {
  id: number;
  category: string;
  title: string;
  requirements: string;
  salary_range: string;
  vacancy_count: number;
  display_order: number;
}

export const getTalentConcept = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<TalentConcept[]>(`
      SELECT id, title, content, display_order
      FROM talent_concept 
      WHERE is_active = 1 
      ORDER BY display_order ASC
      LIMIT 1
    `);
    
    res.json(rows.length > 0 ? rows[0] : null);
  } catch (error) {
    console.error('[人才理念查询错误]', error);
    res.status(500).json({ 
      error: 'Database query failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getJobPositions = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<JobPosition[]>(`
      SELECT id, category, title, requirements, salary_range, vacancy_count, display_order
      FROM job_positions 
      WHERE is_active = 1 
      ORDER BY display_order ASC, created_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('[招聘岗位查询错误]', error);
    res.status(500).json({ 
      error: 'Database query failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};