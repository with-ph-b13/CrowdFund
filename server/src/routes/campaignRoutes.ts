import { Router } from 'express';
import { getTopCampaigns, getCampaigns, getCampaignById, getMyCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../controllers/campaignController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/top', getTopCampaigns);
router.get('/', getCampaigns);
router.get('/my', protect, authorize('Creator'), getMyCampaigns);
router.get('/:id', getCampaignById);
router.post('/', protect, authorize('Creator'), createCampaign);
router.put('/:id', protect, authorize('Creator'), updateCampaign);
router.delete('/:id', protect, authorize('Creator'), deleteCampaign);

export default router;
