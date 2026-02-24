import { Request, Response } from "express";
import pool from "../config/db";

export const getContact = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, company_phone, service_phone, email, postal_code, address FROM contact_info'
    );
    // 确保返回的数据格式为 { data: rows }
    res.json({ data: rows });
  } catch (error) {
    console.error('[Contact Error]', error);
    res.status(500).json({ error: '联系方式获取失败' });
  }
};