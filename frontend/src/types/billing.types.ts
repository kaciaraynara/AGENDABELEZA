// src/types/billing.types.ts

export type SubscriptionStatus =
  | 'TRIAL'
  | 'ACTIVE'
  | 'CANCELED'
  | 'PAST_DUE'
  | 'EXPIRED';

export interface BillingPlan {
  id: 'starter' | 'professional';
  name: string;
  priceCents: number;       // em centavos BRL
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface BillingStatus {
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: string | null;
  subscriptionEndsAt: string | null;
  isBlocked: boolean;
  currentPlan: string | null;
  daysRemainingInTrial?: number;
}

export interface CreateCheckoutPayload {
  planId: 'starter' | 'professional';
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
}
