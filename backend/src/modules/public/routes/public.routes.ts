import { Router } from 'express';
import { PublicController } from '../controllers/public.controller';

const publicRoutes = Router();

publicRoutes.post('/:slug/appointments', PublicController.createAppointment);
publicRoutes.get('/:slug/services', PublicController.getServices);
publicRoutes.get('/:slug/professionals', PublicController.getProfessionals);
publicRoutes.get('/:slug', PublicController.getSalon);

export default publicRoutes;
