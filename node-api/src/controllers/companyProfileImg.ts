import { Request, Response } from "express";
import pool from "../config/db";
import path from "path";
import fs from "fs";

export const getCompanyProfileImg = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT id, img_name, `order`, is_active FROM about_profile_img WHERE is_active = 1 ORDER BY `order` ASC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Query failed" });
  }
};

export const getCompanyProfileImgList = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const size = parseInt((req.query.size as string) || "10");
    const offset = (page - 1) * size;

    const [[{ total }]]: any = await pool.query("SELECT COUNT(*) as total FROM about_profile_img");
    const [rows]: any = await pool.query(
      "SELECT id, img_name, `order`, is_active FROM about_profile_img ORDER BY `order` ASC LIMIT ?, ?",
      [offset, size]
    );

    res.json({ data: rows, total });
  } catch (error) {
    res.status(500).json({ error: "Query failed" });
  }
};

export const createCompanyProfileImg = async (req: Request, res: Response) => {
  try {
    const { img_name, order = 0, is_active = 1 } = req.body;
    if (!img_name || typeof img_name !== "string") {
      return res.status(400).json({ error: "img_name required" });
    }
    const [result]: any = await pool.query(
      "INSERT INTO about_profile_img (img_name, `order`, is_active) VALUES (?, ?, ?)",
      [img_name, order, is_active]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Create failed" });
  }
};

export const updateCompanyProfileImg = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { img_name, order, is_active } = req.body;

    const sets: string[] = [];
    const params: any[] = [];

    if ("img_name" in req.body) {
      sets.push("img_name = ?");
      params.push(img_name);
    }
    if ("order" in req.body) {
      sets.push("`order` = ?");
      params.push(Number(order) || 0);
    }
    if ("is_active" in req.body) {
      params.push(Number(is_active) === 1 ? 1 : 0);
      sets.push("is_active = ?");
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: "no fields to update" });
    }

    const sql = `UPDATE about_profile_img SET ${sets.join(", ")} WHERE id = ?`;
    params.push(id);

    const [result]: any = await pool.query(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "not found" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};

export const deleteCompanyProfileImg = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // 先查出图片名
    const [rows]: any = await pool.query("SELECT img_name FROM about_profile_img WHERE id = ?", [id]);
    if (!rows.length) {
      return res.status(404).json({ error: "not found" });
    }
    const imgName = rows[0].img_name;

    // 删除数据库记录
    const [result]: any = await pool.query("DELETE FROM about_profile_img WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "not found" });
    }

    // 删除图片文件
    if (imgName) {
      const imgPath = path.join(__dirname, "../../uploads/company", imgName);
      fs.unlink(imgPath, err => {
        // 不影响主流程，失败只记录日志
        if (err && err.code !== "ENOENT") {
          console.error("删除图片文件失败:", imgPath, err);
        }
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};