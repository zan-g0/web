"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHonnor = exports.updateHonnor = exports.createHonnor = exports.getHonnorsAdminList = exports.getHonnors = void 0;
const db_1 = __importDefault(require("../config/db"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getHonnors = async (req, res) => {
    try {
        const [rows] = await db_1.default.query("SELECT id, title, description, image, `order`, is_active FROM company_honors WHERE is_active = 1 ORDER BY `order` ASC");
        res.json(rows);
    }
    catch {
        res.status(500).json({ error: "Query failed" });
    }
};
exports.getHonnors = getHonnors;
const getHonnorsAdminList = async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1");
        const size = parseInt(req.query.size || "10");
        const offset = (page - 1) * size;
        const [[{ total }]] = await db_1.default.query("SELECT COUNT(*) as total FROM company_honors");
        const [rows] = await db_1.default.query("SELECT id, title, description, image, `order`, is_active FROM company_honors ORDER BY `order` ASC LIMIT ?, ?", [offset, size]);
        res.json({ data: rows, total });
    }
    catch {
        res.status(500).json({ error: "Query failed" });
    }
};
exports.getHonnorsAdminList = getHonnorsAdminList;
const createHonnor = async (req, res) => {
    try {
        const { title, description = "", image = "", order = 0, is_active = 1 } = req.body;
        if (!title || typeof title !== "string") {
            return res.status(400).json({ error: "title required" });
        }
        const [result] = await db_1.default.query("INSERT INTO company_honors (title, description, image, `order`, is_active) VALUES (?, ?, ?, ?, ?)", [title, description, image, order, is_active]);
        res.json({ success: true, id: result.insertId });
    }
    catch {
        res.status(500).json({ error: "Create failed" });
    }
};
exports.createHonnor = createHonnor;
const updateHonnor = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const body = req.body || {};
        const sets = [];
        const params = [];
        if ("title" in body) {
            sets.push("title = ?");
            params.push(body.title);
        }
        if ("description" in body) {
            sets.push("description = ?");
            params.push(body.description);
        }
        if ("image" in body) {
            sets.push("image = ?");
            params.push(body.image);
        }
        if ("order" in body) {
            sets.push("`order` = ?");
            params.push(Number(body.order) || 0);
        }
        if ("is_active" in body) {
            sets.push("is_active = ?");
            params.push(Number(body.is_active) === 1 ? 1 : 0);
        }
        if (!sets.length) {
            return res.status(400).json({ error: "no fields to update" });
        }
        const sql = `UPDATE company_honors SET ${sets.join(", ")} WHERE id = ?`;
        params.push(id);
        const [result] = await db_1.default.query(sql, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "not found" });
        }
        res.json({ success: true });
    }
    catch {
        res.status(500).json({ error: "Update failed" });
    }
};
exports.updateHonnor = updateHonnor;
const deleteHonnor = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [rows] = await db_1.default.query("SELECT image FROM company_honors WHERE id = ?", [id]);
        if (!rows.length) {
            return res.status(404).json({ error: "not found" });
        }
        const image = rows[0].image;
        const [result] = await db_1.default.query("DELETE FROM company_honors WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "not found" });
        }
        if (image) {
            const imgPath = path_1.default.join(__dirname, "../../uploads/honnor", image);
            fs_1.default.unlink(imgPath, (err) => {
                // 忽略文件不存在错误?
                if (err && err.code !== "ENOENT") {
                    // 记录但不返回错误
                    console.error("failed to delete file:", imgPath, err);
                }
            });
        }
        res.json({ success: true });
    }
    catch {
        res.status(500).json({ error: "Delete failed" });
    }
};
exports.deleteHonnor = deleteHonnor;
