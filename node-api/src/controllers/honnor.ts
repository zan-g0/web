import { Request, Response } from "express";
import pool from "../config/db";
import path from "path";
import fs from "fs";

export const getHonnors = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT id, title, description, image, `order`, is_active FROM company_honors WHERE is_active = 1 ORDER BY `order` ASC"
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Query failed" });
  }
};

export const getHonnorsAdminList = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const size = parseInt((req.query.size as string) || "10");
    const offset = (page - 1) * size;

    const [[{ total }]]: any = await pool.query("SELECT COUNT(*) as total FROM company_honors");
    const [rows]: any = await pool.query(
      "SELECT id, title, description, image, `order`, is_active FROM company_honors ORDER BY `order` ASC LIMIT ?, ?",
      [offset, size]
    );

    res.json({ data: rows, total });
  } catch {
    res.status(500).json({ error: "Query failed" });
  }
};

export const createHonnor = async (req: Request, res: Response) => {
  try {
    const { title, description = "", image = "", order = 0, is_active = 1 } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title required" });
    }
    const [result]: any = await pool.query(
      "INSERT INTO company_honors (title, description, image, `order`, is_active) VALUES (?, ?, ?, ?, ?)",
      [title, description, image, order, is_active]
    );
    res.json({ success: true, id: result.insertId });
  } catch {
    res.status(500).json({ error: "Create failed" });
  }
};

export const updateHonnor = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const body: any = req.body || {};
    const sets: string[] = [];
    const params: any[] = [];

    if ("title" in body) {
      sets.push("title = ?");
      params.push(body.title);
    }
    if ("description" in body) {
      sets.push("description = ?");
      params.push(body.description);
    }
    if ("image" in body) {
      sets.push("image = ?");
      params.push(body.image);
    }
    if ("order" in body) {
      sets.push("`order` = ?");
      params.push(Number(body.order) || 0);
    }
    if ("is_active" in body) {
      sets.push("is_active = ?");
      params.push(Number(body.is_active) === 1 ? 1 : 0);
    }

    if (!sets.length) {
      return res.status(400).json({ error: "no fields to update" });
    }

    const sql = `UPDATE company_honors SET ${sets.join(", ")} WHERE id = ?`;
    params.push(id);

    const [result]: any = await pool.query(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "not found" });
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
};

export const deleteHonnor = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [rows]: any = await pool.query("SELECT image FROM company_honors WHERE id = ?", [id]);
    if (!rows.length) {
      return res.status(404).json({ error: "not found" });
    }
    const image = rows[0].image;

    const [result]: any = await pool.query("DELETE FROM company_honors WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "not found" });
    }

    if (image) {
      const imgPath = path.join(__dirname, "../../uploads/honnor", image);
      fs.unlink(imgPath, (err) => {
        // 忽略文件不存在错误?
        if (err && err.code !== "ENOENT") {
          // 记录但不返回错误
          console.error("failed to delete file:", imgPath, err);
        }
      });
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
};
