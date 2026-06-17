import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ValidationError } from '../../../shared/errors/AppError';
import { PublicService } from '../services/public.service';
import {
  createPublicAppointmentSchema,
  formatZodError,
} from '../validations/public-appointment.validation';

const publicService = new PublicService();

function handleValidationError(error: unknown, next: NextFunction) {
  if (error instanceof ZodError) {
    return next(new ValidationError(formatZodError(error)));
  }

  return next(error);
}

export class PublicController {
  static async getSalon(req: Request, res: Response, next: NextFunction) {
    try {
      const salon = await publicService.getSalon(req.params.slug);

      return res.status(200).json({ salon });
    } catch (error) {
      return next(error);
    }
  }

  static async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await publicService.getServices(req.params.slug);

      return res.status(200).json({ services });
    } catch (error) {
      return next(error);
    }
  }

  static async getProfessionals(req: Request, res: Response, next: NextFunction) {
    try {
      const professionals = await publicService.getProfessionals(req.params.slug);

      return res.status(200).json({ professionals });
    } catch (error) {
      return next(error);
    }
  }

  static async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createPublicAppointmentSchema.parse(req.body);
      const result = await publicService.createAppointment(req.params.slug, data);

      return res.status(201).json(result);
    } catch (error) {
      return handleValidationError(error, next);
    }
  }
}
