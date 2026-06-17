import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { UnauthorizedError, ValidationError } from '../../../shared/errors/AppError';
import { AppointmentService } from '../services/appointment.service';
import {
  formatZodError,
  listAppointmentsSchema,
  updateAppointmentStatusSchema,
} from '../validations/appointment.validation';

const appointmentService = new AppointmentService();

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

export class AppointmentController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = listAppointmentsSchema.parse(req.query);
      const appointments = await appointmentService.list(getUser(req), filters);

      return res.status(200).json({
        appointments,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
        },
      });
    } catch (error) {
      return handleValidationError(error, next);
    }
  }

  static async today(req: Request, res: Response, next: NextFunction) {
    try {
      const appointments = await appointmentService.listToday(getUser(req));

      return res.status(200).json({ appointments });
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.getById(getUser(req), req.params.id);

      return res.status(200).json({ appointment });
    } catch (error) {
      return next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateAppointmentStatusSchema.parse(req.body);
      const appointment = await appointmentService.updateStatus(getUser(req), req.params.id, data);

      return res.status(200).json({ appointment });
    } catch (error) {
      return handleValidationError(error, next);
    }
  }
}
