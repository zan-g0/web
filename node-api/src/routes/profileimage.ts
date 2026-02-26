import { Router } from 'express';
import { getprofileimage } from '../controllers/profileimg';

const router = Router();
router.get('/', getprofileimage);
export default router;