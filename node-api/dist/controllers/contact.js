"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactInfo = void 0;
const db_1 = __importDefault(require("../config/db"));
const getContactInfo = async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
      SELECT 
        id, company_phone, service_phone, fax, email, 
        postal_code, address
      FROM contact_info 
      WHERE is_active = 1 
      ORDER BY id DESC 
      LIMIT 1
    `);
        res.json(rows.length > 0 ? rows[0] : null);
    }
    catch (error) {
        console.error('[联系信息查询错误]', error);
        res.status(500).json({
            error: 'Database query failed',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getContactInfo = getContactInfo;
