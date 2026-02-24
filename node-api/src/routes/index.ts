import { Router } from 'express';
import bannerRouter from './banner';
import CultureRouter from './culture'; 
import aboutProfileImgRouter from './aboutProfileImg'; 
import companyInfoRouter from './companyprofile';
import newsRoutes from './news';
import productRoutes from './product';
import jobRoutes from './job'; 
import contactRoutes from './contact';
import honnorRouter from "./honor";
import uploadRouter from './upload';

const router = Router();

router.use('/banners', bannerRouter);
router.use('/Culture', CultureRouter);
router.use('/about-images', aboutProfileImgRouter);
router.use('/companyprofile', companyInfoRouter);
router.use('/news', newsRoutes);
router.use('/products', productRoutes); 
router.use('/jobs', jobRoutes); 
router.use('/contact', contactRoutes); 
router.use("/honor", honnorRouter);
router.use('/upload', uploadRouter);
export default router;