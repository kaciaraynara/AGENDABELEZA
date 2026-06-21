// src/modules/billing/providers/index.ts

import { PaymentProvider } from '@prisma/client';
import { asaasProvider } from './asaasProvider';
import { stripeProvider } from './stripeProvider';

const configuredProvider =
  process.env.PAYMENT_PROVIDER?.toUpperCase();

/**
 * Provider usado na criação de novas assinaturas.
 *
 * PAYMENT_PROVIDER=ASAAS  → Asaas
 * PAYMENT_PROVIDER=STRIPE → Stripe
 * Default                 → Stripe
 */
export const billingProvider =
  configuredProvider === 'ASAAS'
    ? asaasProvider
    : stripeProvider;

/**
 * Retorna o provider responsável por uma assinatura existente.
 *
 * Isso evita tentar cancelar no Stripe uma assinatura criada no Asaas,
 * ou tentar cancelar no Asaas uma assinatura criada no Stripe.
 */
export function getBillingProvider(
  paymentProvider?: PaymentProvider | null,
) {
  if (paymentProvider === PaymentProvider.ASAAS) {
    return asaasProvider;
  }

  if (paymentProvider === PaymentProvider.STRIPE) {
    return stripeProvider;
  }

  // Compatibilidade com assinaturas antigas sem provider salvo.
  return billingProvider;
}

export { asaasProvider, stripeProvider };
