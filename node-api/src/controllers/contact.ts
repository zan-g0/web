// controllers/contact.ts
import { Request, Response } from 'express';
import pool from '../config/db';

// 简化的联系信息接口
interface ContactInfo {
  id: number;
  company_phone: string;
  service_phone: string;
  fax: string;
  email: string;
  postal_code: string;
  address: string;
}

export const getContactInfo = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<ContactInfo[]>(`
      SELECT 
        id, company_phone, service_phone, fax, email, 
        postal_code, address
      FROM contact_info 
      WHERE is_active = 1 
      ORDER BY id DESC 
      LIMIT 1
    `);
    
    res.json(rows.length > 0 ? rows[0] : null);
  } catch (error) {
    console.error('[联系信息查询错误]', error);
    res.status(500).json({ 
      error: 'Database query failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};