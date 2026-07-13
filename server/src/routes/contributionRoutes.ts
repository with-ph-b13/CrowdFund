import { Router } from 'express';
import { makeContribution, getMyContributions, getContributionsToReview, reviewContribution } from '../controllers/contributionController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Supporter routes
router.post('/', protect, authorize('Supporter'), makeContribution);
router.get('/my', protect, authorize('Supporter'), getMyContributions);

// Creator routes
router.get('/review', protect, authorize('Creator'), getContributionsToReview);
router.put('/:id/review', protect, authorize('Creator'), reviewContribution);

export default router;
