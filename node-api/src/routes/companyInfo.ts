import { Router } from 'express';
import { getCompanyCulture, getCompanyHonors } from '../controllers/companyInfo';

const router = Router();

router.get('/culture', getCompanyCulture);
router.get('/honors', getCompanyHonors);

export default router;