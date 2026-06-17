import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { UnauthorizedError, ValidationError } from '../../../shared/errors/AppError';
import { AuthService } from '../services/auth.service';
import {
  formatZodError,
  loginSchema,
  registerSchema,
} from '../validations/auth.validation';

const authService = new AuthService();

function handleValidationError(error: unknown, next: NextFunction) {
  if (error instanceof ZodError) {
    return next(new ValidationError(formatZodError(error)));
  }

  return next(error);
}

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);

      return res.status(201).json(result);
    } catch (error) {
      return handleValidationError(error, next);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);

      return res.status(200).json(result);
    } catch (error) {
      return handleValidationError(error, next);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuário não autenticado', 'AUTH_USER_MISSING');
      }

      const result = await authService.me(req.user.userId);

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}
