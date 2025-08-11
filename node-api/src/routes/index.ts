import { Router } from 'express';
import bannerRouter from './banner';
import companyProfileRouter from './companyProfile'; 
import aboutProfileImgRouter from './aboutProfileImg'; 
import companyInfoRouter from './companyInfo';

const router = Router();

router.use('/banners', bannerRouter);
router.use('/company-profile', companyProfileRouter);
router.use('/about-images', aboutProfileImgRouter);
router.use('/company-info', companyInfoRouter);
export default router;