import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { UnauthorizedError, ValidationError } from '../../../shared/errors/AppError';
import { ProfessionalService } from '../services/professional.service';
import {
  createProfessionalSchema,
  formatZodError,
  updateProfessionalSchema,
} from '../validations/professional.validation';

const professionalService = new ProfessionalService();

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

export class ProfessionalController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createProfessionalSchema.parse(req.body);
      const professional = await professionalService.create(getUser(req), data);

      return res.status(201).json({ professional });
    } catch (error) {
      return handleValidationError(error, next);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const professionals = await professionalService.list(getUser(req));

      return res.status(200).json({ professionals });
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const professional = await professionalService.getById(getUser(req), req.params.id);

      return res.status(200).json({ professional });
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateProfessionalSchema.parse(req.body);
      const professional = await professionalService.update(getUser(req), req.params.id, data);

      return res.status(200).json({ professional });
    } catch (error) {
      return handleValidationError(error, next);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const professional = await professionalService.softDelete(getUser(req), req.params.id);

      return res.status(200).json({ professional });
    } catch (error) {
      return next(error);
    }
  }
}
