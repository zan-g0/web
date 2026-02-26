import { Router } from "express";
import bannerRouter from "./banner";
import CultureRouter from "./culture";
import profileimageRouter from "./profileimage";
import profileRouter from "./profile";
import newsRoutes from "./news";
import productRoutes from "./product";
import jobRoutes from "./job";
import contactRoutes from "./contact";
import honnorRouter from "./honor";
import adminRoutes from "./admin";

const router = Router();

router.use("/banners", bannerRouter);
router.use("/Culture", CultureRouter);
router.use("/profileimage", profileimageRouter);
router.use("/profile", profileRouter);
router.use("/news", newsRoutes);
router.use("/products", productRoutes);
router.use("/job", jobRoutes);
router.use("/contact", contactRoutes);
router.use("/honor", honnorRouter);
router.use("/admin", adminRoutes);
export default router;
