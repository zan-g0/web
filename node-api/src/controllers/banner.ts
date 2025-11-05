import { Request, Response } from 'express';
import pool from '../config/db';
import path from 'path';
import fs from 'fs';

// 获取轮播图列表（带分页）
export const getBanners = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const offset = (page - 1) * size;

    const [rows] = await pool.query<any[]>(
      'SELECT id, image_name FROM banners ORDER BY id DESC LIMIT ? OFFSET ?',
      [size, offset]
    );
    const [countRows] = await pool.query<any[]>(
      'SELECT COUNT(*) as total FROM banners'
    );
    res.json({
      data: rows,
      total: countRows[0].total
    });
  } catch (error) {
    console.error('getBanners error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 创建轮播图
export const createBanner = async (req: Request, res: Response) => {
  try {
    const { image_name } = req.body;
    if (!image_name) {
      return res.status(400).json({ error: 'image_name必填' });
    }
    const [result]: any = await pool.query(
      'INSERT INTO banners (image_name) VALUES (?)',
      [image_name]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('createBanner error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 更新轮播图
export const updateBanner = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { image_name } = req.body;

    // 查询原文件名
    const [rows]: any = await pool.query('SELECT image_name FROM banners WHERE id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: '未找到该轮播图' });
    }
    const oldImageName = rows[0].image_name;

    // 如果文件名有变化，重命名文件
    if (oldImageName !== image_name) {
      const uploadDir = path.join(__dirname, '../../uploads/banners');
      const oldPath = path.join(uploadDir, oldImageName);
      const newPath = path.join(uploadDir, image_name);

      // 如果原文件存在且新文件名不冲突，则重命名
      if (fs.existsSync(oldPath)) {
        // 如果新文件已存在，先删除
        if (fs.existsSync(newPath)) {
          fs.unlinkSync(newPath);
        }
        fs.renameSync(oldPath, newPath);
      }
    }

    // 更新数据库
    await pool.query('UPDATE banners SET image_name = ? WHERE id = ?', [image_name, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新失败', error });
  }
};

// 删除轮播图
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'id必填' });
    }
    
    // 先查询要删除的轮播图信息
    const [rows]: any = await pool.query('SELECT image_name FROM banners WHERE id = ?', [id]);
    if (rows.length > 0) {
      // 删除对应的文件
      const imageName = rows[0].image_name;
      const uploadDir = path.join(__dirname, '../../uploads/banners');
      const filePath = path.join(uploadDir, imageName);
      
      // 如果文件存在则删除
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // 删除数据库记录
    await pool.query('DELETE FROM banners WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('deleteBanner error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};