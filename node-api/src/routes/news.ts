import express from 'express';
import { getNews, getNewsDetail } from '../controllers/news';

const router = express.Router();

router.get('/', getNews);
router.get('/:id', getNewsDetail);

export default router;