// src/modules/billing/types/billing.type.ts

export interface BillingStatusDto {
  subscriptionStatus: string;
  trialEndsAt: string | null;
  subscriptionEndsAt: string | null;
  isBlocked: boolean;
  currentPlan: string | null;
  daysRemainingInTrial?: number;
}

export interface PlanDto {
  id: string;           // 'starter' | 'professional'
  name: string;
  priceCents: number;   // em centavos BRL
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
  providerSubscriptionId?: string;
  providerCustomerId?: string;
}

export interface CancelResponse {
  success: boolean;
}

export interface WebhookEventDto {
  event: string;
  data: any;
}
