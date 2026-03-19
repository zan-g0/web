import express from "express";
import { getProducts, getProductDetail} from "../controllers/product";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductDetail);

export default router;