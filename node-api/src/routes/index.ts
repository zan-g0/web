import { Router } from 'express';
import bannerRouter from './banner';
import uploadRouter from './upload';
import companyProfileRouter from './companyProfile'; 
import aboutProfileImgRouter from './aboutProfileImg'; 
import companyInfoRouter from './companyInfo';
import newsRoutes from './news';
import techRoutes from './tech'; 
import productRoutes from './product';
import jobRoutes from './job'; 
import contactRoutes from './contact';
import companyProfileImgRouter from "./companyProfileImg";
import honnorRouter from "./honnor";

const router = Router();

router.use('/banners', bannerRouter);
router.use('/upload', uploadRouter);
router.use('/companyProfile', companyProfileRouter);
router.use('/about-images', aboutProfileImgRouter);
router.use('/company-info', companyInfoRouter);
router.use('/news', newsRoutes);
router.use('/tech', techRoutes);
router.use('/products', productRoutes); 
router.use('/jobs', jobRoutes); 
router.use('/contact', contactRoutes); 
router.use("/companyProfileImg", companyProfileImgRouter);
router.use("/company-profile-img", companyProfileImgRouter); // 兼容 kebab-case 前端
router.use("/companyHonnors", honnorRouter);
router.use("/company-honnors", honnorRouter); // 兼容前端不同写法

export default router;