"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactInfo = exports.updateContactInfo = exports.createContactInfo = exports.getContactInfoList = void 0;
const db_1 = __importDefault(require("../config/db"));
// 获取联系信息（单条记录）
const getContactInfoList = async (req, res) => {
    console.log('[联系信息] 接收到请求');
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const offset = (page - 1) * size;
        // Get total count
        const countResult = await db_1.default.query('SELECT COUNT(*) as total FROM contact_info');
        const total = countResult[0][0].total;
        const result = await db_1.default.query(`SELECT
        id, company_phone, service_phone, fax, email,
        postal_code, address, is_active
      FROM contact_info
      ORDER BY id DESC
      LIMIT ? OFFSET ?`, [size, offset]);
        // MySQL2 query returns [rows, fields]
        const rows = result[0];
        console.log('[联系信息] 查询结果行数:', rows.length);
        // 始终返回数组格式以保持前端兼容
        res.json({
            data: rows,
            total: rows.length,
            page: 1,
            size: 1
        });
    }
    catch (error) {
        console.error('[联系信息查询错误]', error);
        res.status(500).json({
            error: 'Database query failed',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getContactInfoList = getContactInfoList;
// 创建联系信息
const createContactInfo = async (req, res) => {
    console.log('[联系信息] 接收到创建请求: ', req.body);
    try {
        const { company_phone, service_phone, fax, email, postal_code, address, is_active } = req.body;
        console.log('[联系信息] 准备插入数据:', { company_phone, service_phone, fax, email, postal_code, address, is_active });
        const result = await db_1.default.query('INSERT INTO contact_info (company_phone, service_phone, fax, email, postal_code, address, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())', [company_phone, service_phone, fax, email, postal_code, address, is_active || 1]);
        // MySQL2 insert returns [result, fields]
        // result is a ResultSetHeader object
        const insertResult = result[0];
        console.log('[联系信息] 插入成功, 新ID:', insertResult.insertId);
        const newId = insertResult.insertId;
        // 返回创建的记录
        const createdResult = await db_1.default.query('SELECT id, company_phone, service_phone, fax, email, postal_code, address, is_active FROM contact_info WHERE id = ?', [newId]);
        // createdResult[0] is an array of ContactInfo objects
        const createdRow = createdResult[0];
        console.log('[联系信息] 创建记录:', createdRow[0]);
        res.status(201).json(createdRow[0]);
    }
    catch (error) {
        console.error('[创建联系信息错误]', error);
        res.status(500).json({
            error: 'Failed to create contact info',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.createContactInfo = createContactInfo;
// 更新联系信息
const updateContactInfo = async (req, res) => {
    console.log('[联系信息] 接收到更新请求: ', req.params, req.body);
    try {
        const { id } = req.params;
        const { company_phone, service_phone, fax, email, postal_code, address, is_active } = req.body;
        // 验证ID
        if (!id) {
            console.log('[联系信息] 验证失败: id参数缺失');
            return res.status(400).json({
                error: '联系信息ID是必需的'
            });
        }
        console.log('[联系信息] 更新ID:', id);
        // 验证联系信息是否存在
        const existingResult = await db_1.default.query('SELECT id FROM contact_info WHERE id = ?', [id]);
        // existingResult[0] is an array of ContactInfo objects
        const existing = existingResult[0];
        if (existing.length === 0) {
            console.log('[联系信息] 查找失败: 联系信息不存在, ID:', id);
            return res.status(404).json({
                error: '联系信息不存在'
            });
        }
        console.log('[联系信息] 找到联系信息, 准备更新:', existing[0]);
        // 更新联系信息
        const updateResult = await db_1.default.query('UPDATE contact_info SET company_phone = ?, service_phone = ?, fax = ?, email = ?, postal_code = ?, address = ?, is_active = ?, updated_at = NOW() WHERE id = ?', [company_phone, service_phone, fax, email, postal_code, address, is_active, id]);
        // updateResult[0] is a ResultSetHeader object
        const updateInfo = updateResult[0];
        console.log('[联系信息] 更新影响行数:', updateInfo.affectedRows);
        if (updateInfo.affectedRows === 0) {
            console.log('[联系信息] 更新失败: 没有影响任何行, ID:', id);
            return res.status(404).json({
                error: '联系信息不存在'
            });
        }
        // 返回更新后的记录
        const updatedResult = await db_1.default.query('SELECT id, company_phone, service_phone, fax, email, postal_code, address, is_active FROM contact_info WHERE id = ?', [id]);
        // updatedResult[0] is an array of ContactInfo objects
        const updatedRow = updatedResult[0];
        console.log('[联系信息] 更新后记录:', updatedRow[0]);
        res.json(updatedRow[0]);
    }
    catch (error) {
        console.error('[更新联系信息错误]', error);
        res.status(500).json({
            error: 'Failed to update contact info',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.updateContactInfo = updateContactInfo;
// 删除联系信息（软删除）
const deleteContactInfo = async (req, res) => {
    console.log('[联系信息] 接收到删除请求: ', req.params);
    try {
        const { id } = req.params;
        if (!id) {
            console.log('[联系信息] 验证失败: id参数缺失');
            return res.status(400).json({
                error: '联系信息ID是必需的'
            });
        }
        console.log('[联系信息] 删除ID:', id);
        // 软删除，设置is_active为0
        const deleteResult = await db_1.default.query('UPDATE contact_info SET is_active = 0, updated_at = NOW() WHERE id = ?', [id]);
        // deleteResult[0] is a ResultSetHeader object
        const deleteInfo = deleteResult[0];
        console.log('[联系信息] 删除影响行数:', deleteInfo.affectedRows);
        if (deleteInfo.affectedRows === 0) {
            console.log('[联系信息] 删除失败: 没有影响任何行, ID:', id);
            return res.status(404).json({
                error: '联系信息不存在'
            });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('[删除联系信息错误]', error);
        res.status(500).json({
            error: 'Failed to delete contact info',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.deleteContactInfo = deleteContactInfo;
