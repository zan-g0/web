import { Router } from "express";
import { getContact} from '../controllers/contact';

const router = Router();

router.get('/', getContact);
export default router;