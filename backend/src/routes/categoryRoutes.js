import { Router } from 'express';
import { getCategories, createCategory, getCategoryProducts } from '../controllers/categoryController.js';
import { validateBody } from '../middleware/validate.js';
import { categorySchema } from '../validators/schemas.js';

const router = Router();

router.get('/', getCategories);
router.post('/', validateBody(categorySchema), createCategory);
router.get('/:slug/products', getCategoryProducts);

export default router;