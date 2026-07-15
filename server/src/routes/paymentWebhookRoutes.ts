import { Router } from 'express';
import express from 'express';
import { handleWebhook } from '../controllers/paymentController';

const router = Router();

// We must use express.raw to get the raw body for signature validation
router.post('/', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
