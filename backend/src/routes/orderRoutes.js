import { Router } from 'express';
import { checkout } from '../controllers/orderController.js';
import { validateBody } from '../middleware/validate.js';
import { checkoutSchema } from '../validators/schemas.js';

const router = Router();

router.post('/checkout', validateBody(checkoutSchema), checkout);

export default router;