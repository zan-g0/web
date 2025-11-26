"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompanyProfile = exports.updateCompanyProfile = exports.createCompanyProfile = exports.getCompanyProfileAdminList = exports.getCompanyProfile = void 0;
const db_1 = __importDefault(require("../config/db"));
// 公共接口：只返回启用项（前端展示用）
const getCompanyProfile = async (req, res) => {
    try {
        const [rows] = await db_1.default.query('SELECT id, txt, `order`, is_active FROM about_profile WHERE is_active = 1 ORDER BY `order` ASC');
        res.json(rows);
    }
    catch (error) {
        console.error('[CompanyProfile Error]', error);
        res.status(500).json({ error: 'Database query failed' });
    }
};
exports.getCompanyProfile = getCompanyProfile;
// 管理端：分页查询全部项
const getCompanyProfileAdminList = async (req, res) => {
    try {
        const page = parseInt(req.query.page || '1');
        const size = parseInt(req.query.size || '10');
        const offset = (page - 1) * size;
        const [[{ total }]] = await db_1.default.query('SELECT COUNT(*) as total FROM about_profile');
        const [rows] = await db_1.default.query('SELECT id, txt, `order`, is_active FROM about_profile ORDER BY `order` ASC LIMIT ?, ?', [offset, size]);
        res.json({ data: rows, total });
    }
    catch (error) {
        console.error('[CompanyProfile Admin List Error]', error);
        res.status(500).json({ error: 'Database query failed' });
    }
};
exports.getCompanyProfileAdminList = getCompanyProfileAdminList;
// 管理端：新增
const createCompanyProfile = async (req, res) => {
    try {
        const { txt, order = 0, is_active = 1 } = req.body;
        const [result] = await db_1.default.query('INSERT INTO about_profile (txt, `order`, is_active) VALUES (?, ?, ?)', [
            txt,
            order,
            is_active,
        ]);
        res.json({ success: true, id: result.insertId });
    }
    catch (error) {
        console.error('[CompanyProfile Create Error]', error);
        res.status(500).json({ error: 'Create failed' });
    }
};
exports.createCompanyProfile = createCompanyProfile;
// 管理端：更新
const updateCompanyProfile = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        console.log('[updateCompanyProfile] raw body:', req.body);
        const body = req.body || {};
        const sets = [];
        const params = [];
        if ('txt' in body) {
            const txt = String(body.txt ?? '').trim();
            // 如果前端传空字符串也可以允许，视业务决定；这里允许但会保存空字符串
            sets.push('txt = ?');
            params.push(txt);
        }
        if ('order' in body) {
            const orderNum = Number(body.order) || 0;
            sets.push('`order` = ?');
            params.push(orderNum);
        }
        if ('is_active' in body) {
            const isActiveNum = Number(body.is_active) === 1 ? 1 : 0;
            sets.push('is_active = ?');
            params.push(isActiveNum);
        }
        if (sets.length === 0) {
            return res.status(400).json({ success: false, message: '没有可更新的字段' });
        }
        // 拼接 SQL
        const sql = `UPDATE about_profile SET ${sets.join(', ')} WHERE id = ?`;
        params.push(id);
        console.log('[updateCompanyProfile] SQL:', sql, 'params:', params);
        const [result] = await db_1.default.query(sql, params);
        if (result && result.affectedRows !== undefined && result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: '未找到要更新的记录' });
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('[CompanyProfile Update Error]', error);
        res.status(500).json({ success: false, message: 'Update failed', error: error.message });
    }
};
exports.updateCompanyProfile = updateCompanyProfile;
// 管理端：删除
const deleteCompanyProfile = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await db_1.default.query('DELETE FROM about_profile WHERE id = ?', [id]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('[CompanyProfile Delete Error]', error);
        res.status(500).json({ error: 'Delete failed' });
    }
};
exports.deleteCompanyProfile = deleteCompanyProfile;
