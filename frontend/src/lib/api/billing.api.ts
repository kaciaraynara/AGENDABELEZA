/**
 * Billing API — Stripe / Assinatura
 * Consome os endpoints de billing do backend.
 */

import api from '@/lib/axios';
import type {
  BillingPlan,
  BillingStatus,
  CreateCheckoutPayload,
  CreateCheckoutResponse,
} from '@/types/billing.types';

export const billingApi = {
  /** GET /billing/plans — público */
  getPlans: () =>
    api.get<BillingPlan[]>('/billing/plans').then((r) => r.data),

  /** GET /billing/status — requer autenticação OWNER */
  getStatus: () =>
    api.get<BillingStatus>('/billing/status').then((r) => r.data),

  /** POST /billing/create-checkout — requer autenticação OWNER */
  createCheckout: (payload: CreateCheckoutPayload) =>
    api
      .post<CreateCheckoutResponse>('/billing/create-checkout', payload)
      .then((r) => r.data),

  /** POST /billing/cancel — requer autenticação OWNER */
  cancel: () =>
    api.post<{ success: boolean }>('/billing/cancel').then((r) => r.data),
};
