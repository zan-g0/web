import { Request, Response } from "express";
import pool from "../config/db";

export const getHonor = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT id, title, description, image, `order`, is_active FROM company_honors WHERE is_active = 1 ORDER BY `order` ASC"
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: "荣誉查询失败" });
  }
};