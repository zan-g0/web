import { Request, Response } from 'express';
import pool from '../../config/db';

// 联系信息接口
interface ContactInfo {
  id: number;
  company_phone: string;
  service_phone: string;
  email: string;
  postal_code: string;
  address: string;
}

// 获取联系信息
export const getContactInfoList = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        id, 
        company_phone, 
        service_phone, 
        email,
        postal_code, 
        address 
      FROM contact_info 
      LIMIT 1`
    );

    // 如果没有数据，返回空对象或默认值
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.json(null); // 或返回一个默认对象
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      error: '数据库查询失败',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

// 更新联系信息
export const updateContactInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      company_phone,
      service_phone,
      email,
      postal_code,
      address,
    } = req.body;

    // 验证ID
    if (!id) {
      return res.status(400).json({
        error: '联系信息ID是必需的'
      });
    }

    // 验证联系信息是否存在
    const [existingRows] = await pool.query(
      'SELECT id FROM contact_info WHERE id = ?',
      [id]
    );

    const existing = existingRows as any[];
    if (existing.length === 0) {
      return res.status(404).json({
        error: '联系信息不存在'
      });
    }

    // 更新联系信息
    const [updateResult] = await pool.query(
      `UPDATE contact_info 
       SET company_phone = ?, 
           service_phone = ?, 
           email = ?, 
           postal_code = ?, 
           address = ?, 
           updated_at = NOW() 
       WHERE id = ?`,
      [company_phone, service_phone, email, postal_code, address, id]
    );

    const updateInfo = updateResult as any;
    if (updateInfo.affectedRows === 0) {
      return res.status(404).json({
        error: '更新失败，联系信息不存在'
      });
    }

    // 返回更新后的记录
    const [updatedRows] = await pool.query(
      `SELECT id, 
              company_phone, 
              service_phone, 
              email, 
              postal_code, 
              address 
       FROM contact_info 
       WHERE id = ?`,
      [id]
    );

    const updatedRow = (updatedRows as any[])[0];
    res.json(updatedRow);
  } catch (error) {
    res.status(500).json({
      error: '更新联系信息失败',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};