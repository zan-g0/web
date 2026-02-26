import { Router } from 'express';
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  batchDeleteNews,
  updateNewsStatus,
  getNewsByCategory,
  searchNews
} from '../../controllers/admin/news';

const router = Router();

// 新闻管理路由
router.get('', getNews);                          // 获取新闻列表
router.get('/search', searchNews);                 // 搜索新闻
router.get('/category/:category', getNewsByCategory); // 按分类获取
router.get('/:id', getNewsById);                   // 获取单条新闻
router.post('', createNews);                       // 创建新闻
router.put('/:id', updateNews);                    // 更新新闻
router.put('/:id/status', updateNewsStatus);       // 更新新闻状态
router.delete('/:id', deleteNews);                  // 删除新闻
router.post('/batch/delete', batchDeleteNews);     // 批量删除新闻

export default router;