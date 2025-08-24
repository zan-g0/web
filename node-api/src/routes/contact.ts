import express from 'express';
import { getContactInfo } from '../controllers/contact';

const router = express.Router();

router.get('/', getContactInfo);

export default router;