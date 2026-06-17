import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { auth, authorize } from '../../../middlewares/auth';
import { AppointmentController } from '../controllers/appointment.controller';

const appointmentRoutes = Router();
const canManageAppointments = [UserRole.OWNER, UserRole.SUPER_ADMIN];

appointmentRoutes.get('/', auth, authorize(canManageAppointments), AppointmentController.list);
appointmentRoutes.get('/today', auth, authorize(canManageAppointments), AppointmentController.today);
appointmentRoutes.get('/:id', auth, authorize(canManageAppointments), AppointmentController.getById);
appointmentRoutes.patch(
  '/:id/status',
  auth,
  authorize(canManageAppointments),
  AppointmentController.updateStatus
);

export default appointmentRoutes;
