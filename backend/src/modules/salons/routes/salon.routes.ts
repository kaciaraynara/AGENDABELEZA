import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { auth, authorize } from '../../../middlewares/auth';
import { SalonController } from '../controllers/salon.controller';

const salonRoutes = Router();
const ownerOrAdmin = [UserRole.OWNER, UserRole.SUPER_ADMIN];

salonRoutes.get('/me', auth, authorize(ownerOrAdmin), SalonController.me);
salonRoutes.put('/me', auth, authorize(ownerOrAdmin), SalonController.updateMe);

export default salonRoutes;
