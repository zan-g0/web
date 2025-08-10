import { Request, Response } from 'express';
import pool from '../config/db';

interface CompanyProfile {
  id: number;
  txt: string;
  order: number;
}

export const getCompanyProfile = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<CompanyProfile[]>(`
      SELECT id, txt 
      FROM about_profile 
      WHERE is_active = 1 
      ORDER BY \`order\` ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('[CompanyProfile Error]', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};