import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  batchDeleteProducts,
  updateProductStatus,
} from '../../controllers/admin/product';

const router = Router();

// 产品管理路由
router.get('/', getProducts);                    // 获取产品列表
router.get('/:id', getProductById);             // 获取单个产品
router.post('/', createProduct);                  // 创建产品
router.put('/:id', updateProduct);               // 更新产品
router.put('/:id/status', updateProductStatus);  // 更新产品状态
router.delete('/:id', deleteProduct);            // 删除产品
router.post('/batch/delete', batchDeleteProducts); // 批量删除产品

export default router;