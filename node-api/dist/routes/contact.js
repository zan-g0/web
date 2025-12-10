"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_1 = require("../controllers/contact");
const router = express_1.default.Router();
// 获取联系信息列表（分页）
router.get('/admin', contact_1.getContactInfoList);
// 创建联系信息
router.post('/admin', contact_1.createContactInfo);
// 更新联系信息
router.put('/admin/:id', contact_1.updateContactInfo);
// 删除联系信息
router.delete('/admin/:id', contact_1.deleteContactInfo);
exports.default = router;
