import { Router } from 'express';
import { getCart, addToCart } from '../controllers/cartController.js';
import { validateBody } from '../middleware/validate.js';
import { addToCartSchema } from '../validators/schemas.js';

const router = Router();

router.get('/:userId', getCart);
router.post('/', validateBody(addToCartSchema), addToCart);

export default router;