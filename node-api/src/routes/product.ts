import express from 'express';
import { getProducts } from '../controllers/product'; 

const router = express.Router();

router.get('/', getProducts);
// 移除分类路由

export default router;