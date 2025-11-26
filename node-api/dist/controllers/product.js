"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const db_1 = __importDefault(require("../config/db"));
const getProducts = async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
      SELECT id, name, description, image_url, display_order
      FROM products 
      WHERE is_active = 1 
      ORDER BY display_order ASC, created_at DESC
    `);
        res.json(rows);
    }
    catch (error) {
        console.error('[产品查询错误]', error);
        res.status(500).json({
            error: 'Database query failed',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getProducts = getProducts;
