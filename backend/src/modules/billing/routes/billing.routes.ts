// src/modules/billing/routes/billing.routes.ts

import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { auth, authorize } from '../../../middlewares/auth';
import {
  getPlans,
  getStatus,
  createCheckout,
  cancelSubscription,
} from '../controllers/billing.controller';

const router = Router();

// ─── Público ────────────────────────────────────────────────────────────────
// GET /billing/plans — sem autenticação
router.get('/plans', getPlans);


// ─── Protegidos (apenas OWNER) ───────────────────────────────────────────────
router.get('/status', auth, authorize([UserRole.OWNER]), getStatus);
router.post('/create-checkout', auth, authorize([UserRole.OWNER]), createCheckout);
router.post('/cancel', auth, authorize([UserRole.OWNER]), cancelSubscription);

export default router;
