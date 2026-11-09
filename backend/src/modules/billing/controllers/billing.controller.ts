// src/modules/billing/controllers/billing.controller.ts

import { Request, Response, NextFunction } from 'express';
import { billingService } from '../services/billing.service';
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

export const handleMercadoPagoWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Retornamos 200 rápido para o Mercado Pago não reenviar
    res.status(200).send('OK');

    const topic = req.query.topic || req.body.type;
    const id = req.query.id || req.body.data?.id;

    if (id) {
      // Processa o webhook no background (sem travar a resposta)
      await billingService.processWebhook(topic as string, id as string).catch(console.error);
    }
  } catch (err) {
    console.error('Webhook Error:', err);
  }
};

