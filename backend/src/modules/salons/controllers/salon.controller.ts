import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { UnauthorizedError, ValidationError } from '../../../shared/errors/AppError';
import { SalonService } from '../services/salon.service';
import { formatZodError, updateSalonSchema } from '../validations/salon.validation';

const salonService = new SalonService();

function handleValidationError(error: unknown, next: NextFunction) {
  if (error instanceof ZodError) {
    return next(new ValidationError(formatZodError(error)));
  }

  return next(error);
}

export class SalonController {
  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuário não autenticado', 'AUTH_USER_MISSING');
      }

      const salon = await salonService.getMySalon(req.user);

      return res.status(200).json({ salon });
    } catch (error) {
      return next(error);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuário não autenticado', 'AUTH_USER_MISSING');
      }

      const data = updateSalonSchema.parse(req.body);
      const salon = await salonService.updateMySalon(req.user, data);

      return res.status(200).json({ salon });
    } catch (error) {
      return handleValidationError(error, next);
    }
  }
}
