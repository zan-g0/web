import { Request, Response } from 'express';
import pool from '../../config/db';
import path from "path";
import fs from "fs";

// 数据库返回的原始类型
interface DBCultureItem {
  id: number;
  title: string;
  content: string; // 注意这里是string（存储JSON字符串）
  icon_img: string;
  order: number;
  is_active: number;
}

interface HonorItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

// 获取企业文化列表
export const getCompanyCulture = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<DBCultureItem[]>(`
      SELECT id, title, content, icon_img, \`order\`, is_active
      FROM company_culture 
      WHERE is_active = 1 
      ORDER BY \`order\` ASC
    `);
    
    // 解析JSON格式的content
    const result = rows.map(row => ({
      ...row,
      content: JSON.parse(row.content) as string[]
    }));
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get culture error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database query failed' 
    });
  }
};

// 获取单个文化条目（用于编辑）
export const getCultureById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query<DBCultureItem[]>(
      'SELECT id, title, content, icon_img, `order`, is_active FROM company_culture WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '文化条目不存在'
      });
    }
    
    const row = rows[0];
    const result = {
      ...row,
      content: JSON.parse(row.content) as string[]
    };
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get culture by id error:', error);
    res.status(500).json({
      success: false,
      message: '获取文化详情失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 创建文化条目
export const createCulture = async (req: Request, res: Response) => {
  try {
    const { title, content, icon_img, order = 0 } = req.body;
    
    // 验证必填字段
    if (!title || !content || !icon_img) {
      return res.status(400).json({
        success: false,
        message: '标题、内容和图标为必填项'
      });
    }
    
    // 验证content是否为数组
    let contentArray: string[];
    if (Array.isArray(content)) {
      contentArray = content;
    } else if (typeof content === 'string') {
      // 如果是字符串，尝试解析
      try {
        contentArray = JSON.parse(content);
      } catch {
        contentArray = [content];
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'content必须是数组或JSON字符串'
      });
    }
    
    // 插入数据库
    const [result]: any = await pool.query(
      'INSERT INTO company_culture (title, content, icon_img, `order`, is_active) VALUES (?, ?, ?, ?, 1)',
      [title, JSON.stringify(contentArray), icon_img, order]
    );
    
    const newId = result.insertId;
    
    res.status(201).json({
      success: true,
      message: '创建成功',
      data: {
        id: newId,
        title,
        content: contentArray,
        icon_img,
        order,
        is_active: 1
      }
    });
  } catch (error) {
    console.error('Create culture error:', error);
    res.status(500).json({
      success: false,
      message: '创建文化条目失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 更新文化条目
export const updateCulture = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, icon_img, order, is_active } = req.body;
    
    // 检查条目是否存在
    const [existing]: any = await pool.query(
      'SELECT id FROM company_culture WHERE id = ?',
      [id]
    );
    
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: '文化条目不存在'
      });
    }
    
    // 构建更新字段
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    
    if (content !== undefined) {
      // 处理content数组
      let contentArray: string[];
      if (Array.isArray(content)) {
        contentArray = content;
      } else if (typeof content === 'string') {
        try {
          contentArray = JSON.parse(content);
        } catch {
          contentArray = [content];
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'content必须是数组或JSON字符串'
        });
      }
      updateFields.push('content = ?');
      updateValues.push(JSON.stringify(contentArray));
    }
    
    if (icon_img !== undefined) {
      updateFields.push('icon_img = ?');
      updateValues.push(icon_img);
    }
    
    if (order !== undefined) {
      updateFields.push('`order` = ?');
      updateValues.push(order);
    }
    
    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(is_active);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有提供要更新的字段'
      });
    }
    
    // 添加id到values末尾
    updateValues.push(id);
    
    // 执行更新
    await pool.query(
      `UPDATE company_culture SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // 获取更新后的数据
    const [updated]: any = await pool.query(
      'SELECT id, title, content, icon_img, `order`, is_active FROM company_culture WHERE id = ?',
      [id]
    );
    
    const result = {
      ...updated[0],
      content: JSON.parse(updated[0].content) as string[]
    };
    
    res.json({
      success: true,
      message: '更新成功',
      data: result
    });
  } catch (error) {
    console.error('Update culture error:', error);
    res.status(500).json({
      success: false,
      message: '更新文化条目失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 删除文化条目
export const deleteCulture = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);
    if (!id) {
      return res.status(400).json({ error: "id必填" });
    }

    // 先查询要删除的文化条目信息
    const [rows]: any = await pool.query(
      "SELECT icon_img FROM company_culture WHERE id = ?",
      [id]
    );
    
    if (rows.length > 0) {
      // 删除对应的文件
      const imageName = rows[0].icon_img;
      const uploadDir = path.join(__dirname, "../../../uploads/culture");
      const filePath = path.join(uploadDir, imageName);

      // 如果文件存在则删除
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 删除数据库记录
    await pool.query("DELETE FROM company_culture WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("deleteCulture error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
