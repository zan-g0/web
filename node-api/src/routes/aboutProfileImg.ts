import { Router } from 'express';
import { getProfileImage } from '../controllers/aboutProfileImg';

const router = Router();
router.get('/', getProfileImage);
export default router;