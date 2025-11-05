import { Router } from 'express';
import { upload, uploadImage } from '../controllers/upload';

const router = Router();

// 上传图片接口
router.post('/', upload.single('file'), uploadImage);

export default router;