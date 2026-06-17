// src/modules/billing/controllers/billing.controller.ts

import { Request, Response, NextFunction } from 'express';
import { billingService } from '../services/billing.service';
import { stripeProvider } from '../providers';
import { AppError } from '../../../shared/errors/AppError';

export const getPlans = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    const plans = billingService.getPlans();
    res.json(plans);
  } catch (err) {
    next(err);
  }
};

export const getStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) throw new AppError('AUTH_TOKEN_MISSING', 401);
    const status = await billingService.getStatus(user.salonId);
    res.json(status);
  } catch (err) {
    next(err);
  }
};

export const createCheckout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) throw new AppError('AUTH_TOKEN_MISSING', 401);
    const { planId } = req.body;
    const callbackUrl = `${process.env.BASE_URL ?? 'http://localhost:3333'}/billing/webhook`;
    const result = await billingService.createCheckout(user.salonId, planId, callbackUrl);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const cancelSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) throw new AppError('AUTH_TOKEN_MISSING', 401);
    const result = await billingService.cancelSubscription(user.salonId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /billing/webhook
 * Recebe eventos do Stripe e atualiza o status da assinatura.
 * Requer raw body (buffer) para validação da assinatura.
 */
export const stripeWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    // rawBody precisa ser Buffer (configurado no router com express.raw)
    const rawBody = req.body as Buffer;

    const event = stripeProvider.constructWebhookEvent(rawBody, sig);
    await billingService.handleWebhook(event);

    res.sendStatus(200);
  } catch (err: any) {
    // Retorna 400 se assinatura inválida
    next(new AppError(err.message ?? 'WEBHOOK_ERROR', 400));
  }
};
