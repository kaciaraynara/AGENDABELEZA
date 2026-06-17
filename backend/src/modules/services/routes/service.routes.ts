import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { auth, authorize } from '../../../middlewares/auth';
import { ServiceController } from '../controllers/service.controller';

const serviceRoutes = Router();
const canReadServices = [UserRole.OWNER, UserRole.PROFESSIONAL, UserRole.SUPER_ADMIN];
const canWriteServices = [UserRole.OWNER, UserRole.SUPER_ADMIN];

serviceRoutes.post('/', auth, authorize(canWriteServices), ServiceController.create);
serviceRoutes.get('/', auth, authorize(canReadServices), ServiceController.list);
serviceRoutes.get('/:id', auth, authorize(canReadServices), ServiceController.getById);
serviceRoutes.put('/:id', auth, authorize(canWriteServices), ServiceController.update);
serviceRoutes.delete('/:id', auth, authorize(canWriteServices), ServiceController.delete);

export default serviceRoutes;
