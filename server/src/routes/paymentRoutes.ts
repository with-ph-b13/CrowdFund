import { Router } from 'express';
import { createCheckoutSession } from '../controllers/paymentController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-checkout-session', protect, authorize('Supporter'), createCheckoutSession);

export default router;
