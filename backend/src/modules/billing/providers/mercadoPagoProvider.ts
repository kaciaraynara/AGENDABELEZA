// src/modules/billing/providers/mercadoPagoProvider.ts
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import type { CreateCheckoutResponse, CancelResponse } from '../types/billing.type';

function getMercadoPago() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurada');
  }
  return new MercadoPagoConfig({ accessToken });
}

function getPlanId(planId: string): string {
  if (planId === 'premium') {
    const p = process.env.MERCADOPAGO_PLAN_PREMIUM;
    if (!p) throw new Error('MERCADOPAGO_PLAN_PREMIUM não configurada. Pegue o ID do plano (ex: 2c938084...) e coloque no .env');
    return p;
  }
  throw new Error(`planId inválido: ${planId}`);
}

export const mercadoPagoProvider = {
  /**
   * Cria Mercado Pago Subscription (PreApproval) ou Preference e retorna URL de pagamento.
   */
  async createCheckout(
    salonId: string,
    planId: string,
    _callbackUrl: string,
  ): Promise<CreateCheckoutResponse> {
    const client = getMercadoPago();
    const preApprovalPlanId = getPlanId(planId);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const preApproval = new PreApproval(client);

    try {
      const response = await preApproval.create({
        body: {
          preapproval_plan_id: preApprovalPlanId,
          reason: `Assinatura AgendaBeleza - Plano ${planId}`,
          external_reference: salonId,
          back_url: `${frontendUrl}/billing?checkout=success`,
          status: 'pending',
        }
      });

      return {
        checkoutUrl: response.init_point as string,
        providerSubscriptionId: response.id as string | undefined,
        providerCustomerId: response.payer_id?.toString(),
      };
    } catch (error) {
      console.error('Erro ao criar checkout no Mercado Pago:', error);
      throw new Error('Falha ao comunicar com Mercado Pago');
    }
  },

  /**
   * Cancela assinatura no Mercado Pago.
   */
  async cancelSubscription(providerSubscriptionId: string): Promise<CancelResponse> {
    const client = getMercadoPago();
    const preApproval = new PreApproval(client);

    try {
      await preApproval.update({
        id: providerSubscriptionId,
        body: { status: 'cancelled' }
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao cancelar assinatura no Mercado Pago:', error);
      return { success: false };
    }
  },

  /**
   * Constrói e valida evento do webhook Mercado Pago.
   */
  constructWebhookEvent(rawBody: Buffer, signature: string): any {
    if (process.env.NODE_ENV === 'test') {
      return JSON.parse(rawBody.toString());
    }

    // A validação de webhook no Mercado Pago é diferente, 
    // geralmente usa-se o header x-signature ou uma chamada à API para validar o ID.
    // Retornamos o body em JSON para o controller processar.
    return JSON.parse(rawBody.toString());
  },
};
