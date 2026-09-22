import { Router } from 'express';
import { getBrands, getBrandById, createBrand } from '../controllers/brandController.js';
import { validateBody } from '../middleware/validate.js';
import { brandSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', getBrands);
router.get('/:id', getBrandById);
router.post('/', validateBody(brandSchema), createBrand);

export default router;