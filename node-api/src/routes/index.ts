import { Router } from 'express';
import bannerRouter from './banner';
import uploadRouter from './upload';
import companyProfileRouter from './companyProfile'; 
import aboutProfileImgRouter from './aboutProfileImg'; 
import companyInfoRouter from './companyInfo';
import newsRoutes from './news';
import productRoutes from './product';
import jobRoutes from './job'; 
import contactRoutes from './contact';
import honnorRouter from "./honnor";

const router = Router();

router.use('/banners', bannerRouter);
router.use('/upload', uploadRouter);
router.use('/companyProfile', companyProfileRouter);
router.use('/about-images', aboutProfileImgRouter);
router.use('/company-info', companyInfoRouter);
router.use('/news', newsRoutes);
router.use('/products', productRoutes); 
router.use('/jobs', jobRoutes); 
router.use('/contact', contactRoutes); 
router.use("/companyHonnors", honnorRouter);

export default router;