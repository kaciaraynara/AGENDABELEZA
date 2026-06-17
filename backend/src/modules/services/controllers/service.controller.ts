import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { UnauthorizedError, ValidationError } from '../../../shared/errors/AppError';
import { ServiceService } from '../services/service.service';
import {
  createServiceSchema,
  formatZodError,
  updateServiceSchema,
} from '../validations/service.validation';

const serviceService = new ServiceService();

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

export class ServiceController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createServiceSchema.parse(req.body);
      const service = await serviceService.create(getUser(req), data);

      return res.status(201).json({ service });
    } catch (error) {
      return handleValidationError(error, next);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await serviceService.list(getUser(req));

      return res.status(200).json({ services });
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await serviceService.getById(getUser(req), req.params.id);

      return res.status(200).json({ service });
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateServiceSchema.parse(req.body);
      const service = await serviceService.update(getUser(req), req.params.id, data);

      return res.status(200).json({ service });
    } catch (error) {
      return handleValidationError(error, next);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await serviceService.softDelete(getUser(req), req.params.id);

      return res.status(200).json({ service });
    } catch (error) {
      return next(error);
    }
  }
}
