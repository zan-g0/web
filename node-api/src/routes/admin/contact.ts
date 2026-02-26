import {Router} from 'express';
import { getContactInfoList, updateContactInfo } from '../../controllers/admin/contact';

const router = Router();

// 获取联系信息列表
router.get('/', getContactInfoList);

// 更新联系信息
router.put('/:id', updateContactInfo);

export default router;