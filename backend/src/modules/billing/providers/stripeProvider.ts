// src/modules/billing/providers/stripeProvider.ts
// eslint-disable-next-line @typescript-eslint/no-require-imports
const StripeLib = require('stripe');

import type { CreateCheckoutResponse, CancelResponse } from '../types/billing.type';

type StripeInstance = InstanceType<typeof StripeLib>;

const STRIPE_API_VERSION = '2026-05-27.dahlia';

function getStripe(): StripeInstance {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY não configurada');
  }
  return new StripeLib(key, { apiVersion: STRIPE_API_VERSION });
}

/**
 * Mapeia planId interno → Price ID do Stripe via env
 */
function getPriceId(planId: string): string {
  if (planId === 'starter') {
    const p = process.env.STRIPE_PRICE_STARTER;
    if (!p) throw new Error('STRIPE_PRICE_STARTER não configurada');
    return p;
  }
  if (planId === 'professional') {
    const p = process.env.STRIPE_PRICE_PROFESSIONAL;
    if (!p) throw new Error('STRIPE_PRICE_PROFESSIONAL não configurada');
    return p;
  }
  throw new Error(`planId inválido: ${planId}`);
}

export const stripeProvider = {
  /**
   * Cria Stripe Checkout Session e retorna URL de pagamento.
   */
  async createCheckout(
    salonId: string,
    planId: string,
    _callbackUrl: string,
  ): Promise<CreateCheckoutResponse> {
    const stripe = getStripe();
    const priceId = getPriceId(planId);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const trialDays = Number(process.env.TRIAL_DAYS ?? 7);

    if (Number.isInteger(trialDays) === false || trialDays < 1) {
      throw new Error('TRIAL_DAYS deve ser um número inteiro maior que zero');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${frontendUrl}/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/billing?checkout=cancelled`,
      metadata: { salonId, planId },
      subscription_data: {
        trial_period_days: trialDays,
        metadata: { salonId, planId },
      },
    });

    return {
      checkoutUrl: session.url as string,
      providerSubscriptionId: undefined,
      providerCustomerId: session.customer as string | undefined,
    };
  },

  /**
   * Cancela assinatura no Stripe.
   */
  async cancelSubscription(providerSubscriptionId: string): Promise<CancelResponse> {
    const stripe = getStripe();
    await stripe.subscriptions.update(providerSubscriptionId, {
      cancel_at_period_end: true,
    });
    return { success: true };
  },

  /**
   * Constrói e valida evento do webhook Stripe.
   * Em NODE_ENV=test, parse direto sem validar assinatura.
   */
  constructWebhookEvent(rawBody: Buffer, signature: string): any {
    if (process.env.NODE_ENV === 'test') {
      return JSON.parse(rawBody.toString());
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET não configurada');
    }

    const stripe = getStripe();
    return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  },
};
