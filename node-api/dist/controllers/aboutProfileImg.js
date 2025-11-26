"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileImage = void 0;
const db_1 = __importDefault(require("../config/db"));
const getProfileImage = async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
      SELECT img_name 
      FROM about_profile_img 
      WHERE is_active = 1 
      ORDER BY \`order\` ASC
    `);
        res.json(rows.map(row => row.img_name));
    }
    catch (error) {
        console.error('[ProfileImg Error]', error);
        res.status(500).json({ error: 'Database query failed' });
    }
};
exports.getProfileImage = getProfileImage;
