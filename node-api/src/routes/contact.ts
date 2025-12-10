import express from 'express';
import { getContactInfoList, createContactInfo, updateContactInfo, deleteContactInfo } from '../controllers/contact';

const router = express.Router();

// 获取联系信息列表（分页）
router.get('/admin', getContactInfoList);

// 创建联系信息
router.post('/admin', createContactInfo);

// 更新联系信息
router.put('/admin/:id', updateContactInfo);

// 删除联系信息
router.delete('/admin/:id', deleteContactInfo);

export default router;