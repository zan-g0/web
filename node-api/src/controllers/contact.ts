import { Request, Response } from "express";
import pool from "../config/db";

export const getContact = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, company_phone, service_phone, email, postal_code, address FROM contact_info'
    );
    res.json(rows);
   } catch (error) {
      console.error('[Contact Error]', error);
      res.status(500).json({ error: '联系方式获取失败' });
    }
};