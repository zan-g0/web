import { Router } from 'express';
import express from "express";
import bannerRouter from './banner';
import companyProfileRouter from './companyProfile'; 
import aboutProfileImgRouter from './aboutProfileImg'; 
import companyInfoRouter from './companyInfo';
import newsRoutes from './news';
import techRoutes from './tech'; 
import productRoutes from './product';
import jobRoutes from './job'; 
import contactRoutes from './contact';
import uploadRouter from './upload';

const router = Router();

router.use('/banners', bannerRouter);
router.use('/company-profile', companyProfileRouter);
router.use('/about-images', aboutProfileImgRouter);
router.use('/company-info', companyInfoRouter);
router.use('/news', newsRoutes);
router.use('/tech', techRoutes);
router.use('/products', productRoutes); 
router.use('/jobs', jobRoutes); 
router.use('/contact', contactRoutes); 
router.use('/upload', uploadRouter);
export default router;