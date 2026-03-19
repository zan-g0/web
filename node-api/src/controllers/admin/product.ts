import { Request, Response } from "express";
import pool from "../../config/db";
import path from "path";
import fs from "fs";

// 获取产品列表（分页）
export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const size = parseInt((req.query.size as string) || "10");
    const offset = (page - 1) * size;

    // 获取总数
    const [[{ total }]]: any = await pool.query("SELECT COUNT(*) as total FROM products");

    // 获取分页数据
    const [rows]: any = await pool.query(
      `SELECT id, name, description, image_name, txt, display_order, is_active, created_at, updated_at
       FROM products
       ORDER BY display_order ASC, id DESC
       LIMIT ?, ?`,
      [offset, size]
    );

    res.json({ 
      success: true,
      data: rows, 
      total 
    });
  } catch (error) {
    console.error("getProducts error:", error);
    res.status(500).json({ 
      success: false,
      error: "Query failed" 
    });
  }
};

// 获取单个产品详情
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);

    const [rows]: any = await pool.query(
      `SELECT id, name, description, image_name, txt, display_order, is_active, created_at, updated_at
       FROM products
       WHERE id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ 
        success: false,
        error: "Product not found" 
      });
    }

    res.json({ 
      success: true,
      data: rows[0] 
    });
  } catch (error) {
    console.error("getProductById error:", error);
    res.status(500).json({ 
      success: false,
      error: "Query failed" 
    });
  }
};

// 创建产品
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description = "",
      image_name = "",
      txt = "",
      display_order = 0,
      is_active = 1
    } = req.body;

    // 验证必填字段
    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        error: "Product name is required"
      });
    }

    const [result]: any = await pool.query(
      `INSERT INTO products (name, description, image_name, txt, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, image_name, txt, display_order, is_active]
    );

    res.json({ 
      success: true, 
      id: result.insertId,
      message: "产品创建成功"
    });
  } catch (error) {
    console.error("createProduct error:", error);
    res.status(500).json({ 
      success: false,
      error: "Create failed" 
    });
  }
};

// 更新产品
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);
    const body: any = req.body || {};
    const sets: string[] = [];
    const params: any[] = [];

    // 动态构建更新字段
    if ("name" in body) {
      sets.push("name = ?");
      params.push(body.name);
    }
    if ("description" in body) {
      sets.push("description = ?");
      params.push(body.description);
    }
    if ("image_name" in body) {
      // 如果更新图片，可能需要删除旧图片
      if (body.image_name) {
        sets.push("image_name = ?");
        params.push(body.image_name);
      }
    }
    if ("txt" in body) {
      sets.push("txt = ?");
      params.push(body.txt);
    }
    if ("display_order" in body) {
      sets.push("display_order = ?");
      params.push(Number(body.display_order) || 0);
    }
    if ("is_active" in body) {
      sets.push("is_active = ?");
      params.push(Number(body.is_active) === 1 ? 1 : 0);
    }

    if (!sets.length) {
      return res.status(400).json({ 
        success: false,
        error: "No fields to update" 
      });
    }

    // updated_at 会自动更新，不需要手动设置
    const sql = `UPDATE products SET ${sets.join(", ")} WHERE id = ?`;
    params.push(id);

    const [result]: any = await pool.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Product not found" 
      });
    }

    res.json({ 
      success: true,
      message: "产品更新成功" 
    });
  } catch (error) {
    console.error("updateProduct error:", error);
    res.status(500).json({ 
      success: false,
      error: "Update failed" 
    });
  }
};

// 删除产品
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);

    // 先查询产品信息，获取图片名称
    const [rows]: any = await pool.query(
      "SELECT image_name FROM products WHERE id = ?", 
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ 
        success: false,
        error: "Product not found" 
      });
    }

    const imageName = rows[0].image_name;

    // 删除数据库记录
    const [result]: any = await pool.query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Product not found" 
      });
    }

    // 如果存在图片，删除对应的文件
    if (imageName) {
      const imgPath = path.join(__dirname, "../../../uploads/product", imageName);
      fs.unlink(imgPath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete product image:", imgPath, err);
        }
      });
    }

    res.json({ 
      success: true,
      message: "产品删除成功" 
    });
  } catch (error) {
    console.error("deleteProduct error:", error);
    res.status(500).json({ 
      success: false,
      error: "Delete failed" 
    });
  }
};

// 批量删除产品
export const batchDeleteProducts = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid or empty ids array" 
      });
    }

    // 先查询所有要删除的产品的图片
    const [rows]: any = await pool.query(
      "SELECT image_name FROM products WHERE id IN (?)", 
      [ids]
    );

    // 删除数据库记录
    const [result]: any = await pool.query("DELETE FROM products WHERE id IN (?)", [ids]);

    // 删除对应的图片文件
    rows.forEach((row: any) => {
      if (row.image_name) {
        const imgPath = path.join(__dirname, "../../../uploads/product", row.image_name);
        fs.unlink(imgPath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Failed to delete product image:", imgPath, err);
          }
        });
      }
    });

    res.json({ 
      success: true,
      message: `成功删除 ${result.affectedRows} 个产品` 
    });
  } catch (error) {
    console.error("batchDeleteProducts error:", error);
    res.status(500).json({ 
      success: false,
      error: "Batch delete failed" 
    });
  }
};

// 更新产品状态（激活/禁用）
export const updateProductStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);
    const { is_active } = req.body;

    if (is_active === undefined || is_active === null) {
      return res.status(400).json({ 
        success: false,
        error: "is_active is required" 
      });
    }

    const newStatus = Number(is_active) === 1 ? 1 : 0;

    const [result]: any = await pool.query(
      "UPDATE products SET is_active = ? WHERE id = ?",
      [newStatus, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Product not found" 
      });
    }

    res.json({ 
      success: true,
      message: `产品已${newStatus === 1 ? '激活' : '禁用'}` 
    });
  } catch (error) {
    console.error("updateProductStatus error:", error);
    res.status(500).json({ 
      success: false,
      error: "Update failed" 
    });
  }
};
