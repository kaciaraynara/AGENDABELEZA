import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { UnauthorizedError, ValidationError } from '../../../shared/errors/AppError';
import { ProfessionalServicesService } from '../services/professional-services.service';
import {
  formatZodError,
  linkProfessionalServicesSchema,
} from '../validations/professional-services.validation';

const professionalServicesService = new ProfessionalServicesService();

function handleValidationError(error: unknown, next: NextFunction) {
  if (error instanceof ZodError) {
    return next(new ValidationError(formatZodError(error)));
  }

  return next(error);
}

function getUser(req: Request) {
  if (!req.user) {
    throw new UnauthorizedError('Usuário não autenticado', 'AUTH_USER_MISSING');
  }

  return req.user;
}

export class ProfessionalServicesController {
  static async link(req: Request, res: Response, next: NextFunction) {
    try {
      const data = linkProfessionalServicesSchema.parse(req.body);
      const services = await professionalServicesService.linkServices(
        getUser(req),
        req.params.professionalId,
        data
      );

      return res.status(200).json({ services });
    } catch (error) {
      return handleValidationError(error, next);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await professionalServicesService.listServices(getUser(req), req.params.professionalId);

      return res.status(200).json({ services });
    } catch (error) {
      return next(error);
    }
  }

  static async unlink(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await professionalServicesService.unlinkService(
        getUser(req),
        req.params.professionalId,
        req.params.serviceId
      );

      return res.status(200).json({ services });
    } catch (error) {
      return next(error);
    }
  }
}
