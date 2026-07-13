import { Router } from 'express';
import { requestWithdrawal, getMyWithdrawals } from '../controllers/withdrawalController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, authorize('Creator'), requestWithdrawal);
router.get('/my', protect, authorize('Creator'), getMyWithdrawals);

export default router;
