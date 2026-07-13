import { Router } from 'express';
import { 
  getPendingCampaigns, updateCampaignStatus, 
  getWithdrawals, updateWithdrawalStatus, 
  getUsers, updateUserRole, deleteUser 
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// All routes here are strictly for Admin
router.use(protect, authorize('Admin'));

router.get('/campaigns', getPendingCampaigns);
router.put('/campaigns/:id/status', updateCampaignStatus);

router.get('/withdrawals', getWithdrawals);
router.put('/withdrawals/:id/status', updateWithdrawalStatus);

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
