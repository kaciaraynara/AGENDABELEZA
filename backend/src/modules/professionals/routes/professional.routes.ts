import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { auth, authorize } from '../../../middlewares/auth';
import { ProfessionalController } from '../controllers/professional.controller';
import { ProfessionalServicesController } from '../controllers/professional-services.controller';

const professionalRoutes = Router();
const canReadProfessionals = [UserRole.OWNER, UserRole.PROFESSIONAL, UserRole.SUPER_ADMIN];
const canWriteProfessionals = [UserRole.OWNER, UserRole.SUPER_ADMIN];

professionalRoutes.post('/', auth, authorize(canWriteProfessionals), ProfessionalController.create);
professionalRoutes.get('/', auth, authorize(canReadProfessionals), ProfessionalController.list);
professionalRoutes.post(
  '/:professionalId/services',
  auth,
  authorize(canWriteProfessionals),
  ProfessionalServicesController.link
);
professionalRoutes.get(
  '/:professionalId/services',
  auth,
  authorize(canReadProfessionals),
  ProfessionalServicesController.list
);
professionalRoutes.delete(
  '/:professionalId/services/:serviceId',
  auth,
  authorize(canWriteProfessionals),
  ProfessionalServicesController.unlink
);
professionalRoutes.get('/:id', auth, authorize(canReadProfessionals), ProfessionalController.getById);
professionalRoutes.put('/:id', auth, authorize(canWriteProfessionals), ProfessionalController.update);
professionalRoutes.delete('/:id', auth, authorize(canWriteProfessionals), ProfessionalController.delete);

export default professionalRoutes;
