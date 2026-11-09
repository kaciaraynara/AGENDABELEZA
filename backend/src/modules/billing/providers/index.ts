// src/modules/billing/providers/index.ts

import { PaymentProvider } from '@prisma/client';
import { asaasProvider } from './asaasProvider';
import { mercadoPagoProvider } from './mercadoPagoProvider';

const configuredProvider =
  process.env.PAYMENT_PROVIDER?.toUpperCase();

/**
 * Provider usado na criação de novas assinaturas.
 *
 * PAYMENT_PROVIDER=ASAAS  → Asaas
 * PAYMENT_PROVIDER=MERCADOPAGO → Mercado Pago
 * Default                 → Mercado Pago
 */
export const billingProvider =
  configuredProvider === 'ASAAS'
    ? asaasProvider
    : mercadoPagoProvider;

/**
 * Retorna o provider responsável por uma assinatura existente.
 *
 * Isso evita tentar cancelar no Mercado Pago uma assinatura criada no Asaas, etc.
 */
export function getBillingProvider(
  paymentProvider?: PaymentProvider | null,
) {
  if (paymentProvider === PaymentProvider.ASAAS) {
    return asaasProvider;
  }

  // Compatibilidade com assinaturas antigas sem provider salvo (agora forçado para MP).
  return mercadoPagoProvider;
}

export { asaasProvider, mercadoPagoProvider };
