import { Request, Response } from "express";
import pool from "../config/db";

export const getBanners = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT id, image_name FROM banners");

    res.json(rows);
  } catch (error) {
    console.error("getBanners error:", error);
    res.status(500).json({ message: "获取轮播图失败" });
  }
};