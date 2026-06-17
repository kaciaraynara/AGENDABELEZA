import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/AppError';
import { getOnboardingStatus } from '../services/onboarding.service';

export const getStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) throw new AppError('AUTH_TOKEN_MISSING', 401);
    if (user.role !== 'OWNER') throw new AppError('ROLE_FORBIDDEN', 403);
    const status = await getOnboardingStatus(user.salonId);
    res.json(status);
  } catch (err) {
    next(err);
  }
};
