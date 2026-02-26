import { Router } from 'express';
import { getprofile } from '../controllers/profile';

const router = Router();
router.get('/', getprofile);
export default router;