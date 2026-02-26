import { Request, Response } from "express";
import pool from "../../config/db";
import path from "path";
import fs from "fs";

// 获取所有启用的简介图片
export const getprofileimage = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const offset = (page - 1) * size;

    const [rows] = await pool.query<any[]>(
      `
      SELECT id, image_name, \`order\`, is_active
      FROM profileimage 
      WHERE is_active = 1 
      ORDER BY \`order\` ASC
    `,
      [size, offset],
    );
    const [countRows] = await pool.query<any[]>(
      "SELECT COUNT(*) as total FROM profileimage WHERE is_active = 1",
    );
    res.json({
      data: rows,
      total: countRows[0].total,
    });
  } catch (error) {
    console.error("[profileimage Error]", error);
    res.status(500).json({
      success: false,
      error: "Database query failed",
    });
  }
};
// 创建简介图
export const createprofileimage = async (req: Request, res: Response) => {
  try {
    const { image_name } = req.body;
    const [result]: any = await pool.query(
      "INSERT INTO aprofileimage (image_name) VALUES (?)",
      [image_name],
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("createprofileimage error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 删除简介图
export const deleteprofileimage = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "id必填" });
    }

    // 先查询要删除的简介图信息
    const [rows]: any = await pool.query(
      "SELECT image_name FROM profileimage WHERE id = ?",
      [id],
    );
    if (rows.length > 0) {
      // 删除对应的文件
      const imageName = rows[0].image_name;
      const uploadDir = path.join(__dirname, "../../../uploads/company");
      const filePath = path.join(uploadDir, imageName);

      // 如果文件存在则删除
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 删除数据库记录
    await pool.query("DELETE FROM profileimage WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("deleteprofileimage error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
