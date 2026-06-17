/**
 * Agregador de rotas da aplicação
 * Centraliza todas as rotas dos módulos
 */

import { Router } from 'express';
import authRoutes from '../modules/auth/routes/auth.routes';
import salonRoutes from '../modules/salons/routes/salon.routes';
import serviceRoutes from '../modules/services/routes/service.routes';
import professionalRoutes from '../modules/professionals/routes/professional.routes';
import appointmentRoutes from '../modules/appointments/routes/appointment.routes';
import publicRoutes from '../modules/public/routes/public.routes';
import onboardingRoutes from '../modules/onboarding/routes/onboarding.routes';
import billingRoutes from '../modules/billing/routes/billing.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/salon', salonRoutes);
router.use('/services', serviceRoutes);
router.use('/professionals', professionalRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/public', publicRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/billing', billingRoutes);

export default router;
