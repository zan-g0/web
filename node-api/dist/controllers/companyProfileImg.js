"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompanyProfileImg = exports.updateCompanyProfileImg = exports.createCompanyProfileImg = exports.getCompanyProfileImgList = exports.getCompanyProfileImg = void 0;
const db_1 = __importDefault(require("../config/db"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getCompanyProfileImg = async (req, res) => {
    try {
        const [rows] = await db_1.default.query("SELECT id, img_name, `order`, is_active FROM about_profile_img WHERE is_active = 1 ORDER BY `order` ASC");
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: "Query failed" });
    }
};
exports.getCompanyProfileImg = getCompanyProfileImg;
const getCompanyProfileImgList = async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1");
        const size = parseInt(req.query.size || "10");
        const offset = (page - 1) * size;
        const [[{ total }]] = await db_1.default.query("SELECT COUNT(*) as total FROM about_profile_img");
        const [rows] = await db_1.default.query("SELECT id, img_name, `order`, is_active FROM about_profile_img ORDER BY `order` ASC LIMIT ?, ?", [offset, size]);
        res.json({ data: rows, total });
    }
    catch (error) {
        res.status(500).json({ error: "Query failed" });
    }
};
exports.getCompanyProfileImgList = getCompanyProfileImgList;
const createCompanyProfileImg = async (req, res) => {
    try {
        const { img_name, order = 0, is_active = 1 } = req.body;
        if (!img_name || typeof img_name !== "string") {
            return res.status(400).json({ error: "img_name required" });
        }
        const [result] = await db_1.default.query("INSERT INTO about_profile_img (img_name, `order`, is_active) VALUES (?, ?, ?)", [img_name, order, is_active]);
        res.json({ success: true, id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: "Create failed" });
    }
};
exports.createCompanyProfileImg = createCompanyProfileImg;
const updateCompanyProfileImg = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { img_name, order, is_active } = req.body;
        const sets = [];
        const params = [];
        if ("img_name" in req.body) {
            sets.push("img_name = ?");
            params.push(img_name);
        }
        if ("order" in req.body) {
            sets.push("`order` = ?");
            params.push(Number(order) || 0);
        }
        if ("is_active" in req.body) {
            params.push(Number(is_active) === 1 ? 1 : 0);
            sets.push("is_active = ?");
        }
        if (sets.length === 0) {
            return res.status(400).json({ error: "no fields to update" });
        }
        const sql = `UPDATE about_profile_img SET ${sets.join(", ")} WHERE id = ?`;
        params.push(id);
        const [result] = await db_1.default.query(sql, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "not found" });
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
};
exports.updateCompanyProfileImg = updateCompanyProfileImg;
const deleteCompanyProfileImg = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // 先查出图片名
        const [rows] = await db_1.default.query("SELECT img_name FROM about_profile_img WHERE id = ?", [id]);
        if (!rows.length) {
            return res.status(404).json({ error: "not found" });
        }
        const imgName = rows[0].img_name;
        // 删除数据库记录
        const [result] = await db_1.default.query("DELETE FROM about_profile_img WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "not found" });
        }
        // 删除图片文件
        if (imgName) {
            const imgPath = path_1.default.join(__dirname, "../../uploads/about_profile_img", imgName);
            fs_1.default.unlink(imgPath, err => {
                // 不影响主流程，失败只记录日志
                if (err && err.code !== "ENOENT") {
                    console.error("删除图片文件失败:", imgPath, err);
                }
            });
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
};
exports.deleteCompanyProfileImg = deleteCompanyProfileImg;
