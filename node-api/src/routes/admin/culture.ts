import { Router } from 'express';
import { getCompanyCulture,getCultureById, createCulture, updateCulture, deleteCulture } from '../../controllers/admin/culture';

const router = Router();

router.get('/', getCompanyCulture);
router.get('/:id', getCultureById);
router.post('/', createCulture);
router.put('/:id', updateCulture);
router.delete('/:id', deleteCulture);
export default router;