"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getBanners = void 0;
const db_1 = __importDefault(require("../config/db"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// 获取轮播图列表（带分页）
const getBanners = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const offset = (page - 1) * size;
        const [rows] = await db_1.default.query('SELECT id, image_name FROM banners ORDER BY id DESC LIMIT ? OFFSET ?', [size, offset]);
        const [countRows] = await db_1.default.query('SELECT COUNT(*) as total FROM banners');
        res.json({
            data: rows,
            total: countRows[0].total
        });
    }
    catch (error) {
        console.error('getBanners error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getBanners = getBanners;
// 创建轮播图
const createBanner = async (req, res) => {
    try {
        const { image_name } = req.body;
        if (!image_name) {
            return res.status(400).json({ error: 'image_name必填' });
        }
        const [result] = await db_1.default.query('INSERT INTO banners (image_name) VALUES (?)', [image_name]);
        res.json({ success: true, id: result.insertId });
    }
    catch (error) {
        console.error('createBanner error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.createBanner = createBanner;
// 更新轮播图
const updateBanner = async (req, res) => {
    try {
        const id = req.params.id;
        const { image_name } = req.body;
        // 查询原文件名
        const [rows] = await db_1.default.query('SELECT image_name FROM banners WHERE id = ?', [id]);
        if (!rows.length) {
            return res.status(404).json({ success: false, message: '未找到该轮播图' });
        }
        const oldImageName = rows[0].image_name;
        // 如果文件名有变化，重命名文件
        if (oldImageName !== image_name) {
            const uploadDir = path_1.default.join(__dirname, '../../uploads/banners');
            const oldPath = path_1.default.join(uploadDir, oldImageName);
            const newPath = path_1.default.join(uploadDir, image_name);
            // 如果原文件存在且新文件名不冲突，则重命名
            if (fs_1.default.existsSync(oldPath)) {
                // 如果新文件已存在，先删除
                if (fs_1.default.existsSync(newPath)) {
                    fs_1.default.unlinkSync(newPath);
                }
                fs_1.default.renameSync(oldPath, newPath);
            }
        }
        // 更新数据库
        await db_1.default.query('UPDATE banners SET image_name = ? WHERE id = ?', [image_name, id]);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: '更新失败', error });
    }
};
exports.updateBanner = updateBanner;
// 删除轮播图
const deleteBanner = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).json({ error: 'id必填' });
        }
        // 先查询要删除的轮播图信息
        const [rows] = await db_1.default.query('SELECT image_name FROM banners WHERE id = ?', [id]);
        if (rows.length > 0) {
            // 删除对应的文件
            const imageName = rows[0].image_name;
            const uploadDir = path_1.default.join(__dirname, '../../uploads/banners');
            const filePath = path_1.default.join(uploadDir, imageName);
            // 如果文件存在则删除
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        // 删除数据库记录
        await db_1.default.query('DELETE FROM banners WHERE id = ?', [id]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('deleteBanner error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deleteBanner = deleteBanner;
