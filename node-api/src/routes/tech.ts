// 在 routes/tech.ts 中更新导入的方法名
import express from 'express';
import { getTechIntroductions, getTechAchievements, getTechCooperations } from '../controllers/tech';

const router = express.Router();

router.get('/introductions', getTechIntroductions);
router.get('/achievements', getTechAchievements);
router.get('/cooperations', getTechCooperations);

export default router;