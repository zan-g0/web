import { Router } from 'express';
import bannerRouter from './banner';
import uploadRouter from './upload';
import profileRouter from './profile'; 
import profileimgRouter from './profileimg';
import culture from './culture';
import newsRoutes from './news';
import productRoutes from './product';
import jobRoutes from './job'; 
import contactRoutes from './contact';
import honorRouter from "./honor";

const router = Router();

router.use('/banners', bannerRouter);
router.use('/upload', uploadRouter);
router.use('/profile', profileRouter);
router.use('/profileimg', profileimgRouter); 
router.use('/culture', culture);
router.use('/news', newsRoutes);
router.use('/products', productRoutes); 
router.use('/job', jobRoutes); 
router.use('/contact', contactRoutes); 
router.use("/Honor", honorRouter);
export default router;