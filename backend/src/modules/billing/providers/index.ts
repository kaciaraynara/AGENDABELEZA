// src/modules/billing/providers/index.ts

import { asaasProvider } from './asaasProvider';
import { stripeProvider } from './stripeProvider';

const provider = process.env.PAYMENT_PROVIDER?.toUpperCase();

/**
 * Provider de pagamento ativo.
 * PAYMENT_PROVIDER=STRIPE → Stripe (ativo, produção)
 * PAYMENT_PROVIDER=ASAAS  → Asaas (futuro/stub)
 * Default                 → Stripe
 */
export const billingProvider = provider === 'ASAAS' ? asaasProvider : stripeProvider;

// Re-export do stripeProvider para uso direto no webhook controller
export { stripeProvider };
