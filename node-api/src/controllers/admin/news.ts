import { Request, Response } from "express";
import pool from "../../config/db";
import path from "path";
import fs from "fs";

// 获取新闻列表（分页）
export const getNews = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const size = parseInt((req.query.size as string) || "10");
    const offset = (page - 1) * size;
    
    // 获取总数
    const [[{ total }]]: any = await pool.query("SELECT COUNT(*) as total FROM news");
    
    // 获取分页数据
    const [rows]: any = await pool.query(
      `SELECT id, title, summary, cover_image, category, author, status, views, 
              publish_date, created_at, updated_at 
       FROM news 
       ORDER BY publish_date DESC, id DESC 
       LIMIT ?, ?`,
      [offset, size]
    );

    res.json({ data: rows, total });
  } catch (error) {
    console.error("getNews error:", error);
    res.status(500).json({ error: "Query failed" });
  }
};

// 获取单个新闻详情
export const getNewsById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);
    
    const [rows]: any = await pool.query(
      `SELECT id, title, summary, content, cover_image, category, author, status, 
              views, publish_date, created_at, updated_at 
       FROM news 
       WHERE id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "News not found" });
    }

    // 更新浏览量
    await pool.query("UPDATE news SET views = views + 1 WHERE id = ?", [id]);

    res.json({ data: rows[0] });
  } catch (error) {
    console.error("getNewsById error:", error);
    res.status(500).json({ error: "Query failed" });
  }
};

// 创建新闻
export const createNews = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      summary = "", 
      content = "", 
      cover_image = "", 
      category = "", 
      author = "", 
      status = "draft",
      publish_date 
    } = req.body;

    // 验证必填字段
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required" });
    }

    // 处理发布日期
    const publishDate = publish_date || new Date();

    const [result]: any = await pool.query(
      `INSERT INTO news (title, summary, content, cover_image, category, author, status, publish_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, summary, content, cover_image, category, author, status, publishDate]
    );

    res.json({ 
      success: true, 
      id: result.insertId,
      message: "新闻创建成功"
    });
  } catch (error) {
    console.error("createNews error:", error);
    res.status(500).json({ error: "Create failed" });
  }
};

// 更新新闻
export const updateNews = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);
    const body: any = req.body || {};
    const sets: string[] = [];
    const params: any[] = [];

    // 动态构建更新字段
    if ("title" in body) {
      sets.push("title = ?");
      params.push(body.title);
    }
    if ("summary" in body) {
      sets.push("summary = ?");
      params.push(body.summary);
    }
    if ("content" in body) {
      sets.push("content = ?");
      params.push(body.content);
    }
    if ("cover_image" in body) {
      // 如果更新封面图片，可能需要删除旧图片
      if (body.cover_image) {
        // 可以在这里添加删除旧图片的逻辑
        sets.push("cover_image = ?");
        params.push(body.cover_image);
      }
    }
    if ("category" in body) {
      sets.push("category = ?");
      params.push(body.category);
    }
    if ("author" in body) {
      sets.push("author = ?");
      params.push(body.author);
    }
    if ("status" in body) {
      sets.push("status = ?");
      params.push(body.status);
    }
    if ("publish_date" in body) {
      sets.push("publish_date = ?");
      params.push(body.publish_date);
    }

    if (!sets.length) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // 添加 updated_at 自动更新，不需要手动设置
    const sql = `UPDATE news SET ${sets.join(", ")} WHERE id = ?`;
    params.push(id);

    const [result]: any = await pool.query(sql, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    res.json({ 
      success: true,
      message: "新闻更新成功" 
    });
  } catch (error) {
    console.error("updateNews error:", error);
    res.status(500).json({ error: "Update failed" });
  }
};

// 删除新闻
export const deleteNews = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);

    // 先查询新闻信息，获取封面图片路径
    const [rows]: any = await pool.query(
      "SELECT cover_image FROM news WHERE id = ?", 
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "News not found" });
    }

    const coverImage = rows[0].cover_image;

    // 删除数据库记录
    const [result]: any = await pool.query("DELETE FROM news WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    // 如果存在封面图片，删除对应的文件
    if (coverImage) {
      const imgPath = path.join(__dirname, "../../../uploads/news", coverImage);
      fs.unlink(imgPath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete cover image:", imgPath, err);
        }
      });
    }

    res.json({ 
      success: true,
      message: "新闻删除成功" 
    });
  } catch (error) {
    console.error("deleteNews error:", error);
    res.status(500).json({ error: "Delete failed" });
  }
};

// 批量删除新闻
export const batchDeleteNews = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid or empty ids array" });
    }

    // 先查询所有要删除的新闻的封面图片
    const [rows]: any = await pool.query(
      "SELECT cover_image FROM news WHERE id IN (?)", 
      [ids]
    );

    // 删除数据库记录
    const [result]: any = await pool.query("DELETE FROM news WHERE id IN (?)", [ids]);

    // 删除对应的图片文件
    rows.forEach((row: any) => {
      if (row.cover_image) {
        const imgPath = path.join(__dirname, "../../../uploads/news", row.cover_image);
        fs.unlink(imgPath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Failed to delete cover image:", imgPath, err);
          }
        });
      }
    });

    res.json({ 
      success: true,
      message: `成功删除 ${result.affectedRows} 条新闻` 
    });
  } catch (error) {
    console.error("batchDeleteNews error:", error);
    res.status(500).json({ error: "Batch delete failed" });
  }
};

// 更新新闻状态（发布/草稿）
export const updateNewsStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);
    const { status } = req.body;

    if (!status || !['draft', 'published'].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const [result]: any = await pool.query(
      "UPDATE news SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    res.json({ 
      success: true,
      message: `新闻已${status === 'published' ? '发布' : '转为草稿'}` 
    });
  } catch (error) {
    console.error("updateNewsStatus error:", error);
    res.status(500).json({ error: "Update failed" });
  }
};

// 按分类获取新闻
export const getNewsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const page = parseInt((req.query.page as string) || "1");
    const size = parseInt((req.query.size as string) || "10");
    const offset = (page - 1) * size;

    const [[{ total }]]: any = await pool.query(
      "SELECT COUNT(*) as total FROM news WHERE category = ?",
      [category]
    );

    const [rows]: any = await pool.query(
      `SELECT id, title, summary, cover_image, author, status, views, publish_date 
       FROM news 
       WHERE category = ? 
       ORDER BY publish_date DESC, id DESC 
       LIMIT ?, ?`,
      [category, offset, size]
    );

    res.json({ data: rows, total });
  } catch (error) {
    console.error("getNewsByCategory error:", error);
    res.status(500).json({ error: "Query failed" });
  }
};

// 搜索新闻
export const searchNews = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;
    const page = parseInt((req.query.page as string) || "1");
    const size = parseInt((req.query.size as string) || "10");
    const offset = (page - 1) * size;

    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required" });
    }

    const searchTerm = `%${keyword}%`;

    const [[{ total }]]: any = await pool.query(
      `SELECT COUNT(*) as total FROM news 
       WHERE title LIKE ? OR summary LIKE ? OR content LIKE ?`,
      [searchTerm, searchTerm, searchTerm]
    );

    const [rows]: any = await pool.query(
      `SELECT id, title, summary, cover_image, category, author, status, views, publish_date 
       FROM news 
       WHERE title LIKE ? OR summary LIKE ? OR content LIKE ?
       ORDER BY publish_date DESC, id DESC 
       LIMIT ?, ?`,
      [searchTerm, searchTerm, searchTerm, offset, size]
    );

    res.json({ data: rows, total });
  } catch (error) {
    console.error("searchNews error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};