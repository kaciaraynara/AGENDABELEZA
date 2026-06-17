import axios from 'axios';
import crypto from 'crypto';

import type {
  CancelResponse,
  CreateCheckoutResponse,
  WebhookEventDto,
} from '../types/billing.type';

const ASAAS_BASE_URL =
  process.env.ASAAS_ENV === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/api/v3';

function getAsaasApiKey(): string {
  const key = process.env.ASAAS_API_KEY;

  if (!key) {
    throw new Error('ASAAS_API_KEY não configurada');
  }

  return key;
}

function getAsaasWebhookSecret(): string {
  return process.env.ASAAS_WEBHOOK_SECRET || '';
}

export const asaasProvider = {
  async createCheckout(
    salonId: string,
    planId: string,
    callbackUrl: string,
  ): Promise<CreateCheckoutResponse> {
    const value = planId === 'starter' ? 19.9 : 39.9;

    const payload = {
      customer: {
        name: `Salon ${salonId}`,
        email: `${salonId}@agendabeleza.local`,
        phone: '85999999999',
      },
      billingType: 'CREDIT_CARD',
      value,
      cycle: 'MONTHLY',
      description: `Assinatura ${planId} - AgendaBeleza`,
      externalReference: salonId,
      callback: {
        successUrl: callbackUrl,
        autoRedirect: true,
      },
    };

    const response = await axios.post(
      `${ASAAS_BASE_URL}/subscriptions`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          access_token: getAsaasApiKey(),
        },
      },
    );

    return {
      checkoutUrl:
        response.data?.invoiceUrl ||
        response.data?.paymentLink ||
        response.data?.bankSlipUrl ||
        callbackUrl,
      providerSubscriptionId: response.data?.id,
      providerCustomerId: response.data?.customer,
    };
  },

  async cancelSubscription(
    providerSubscriptionId: string,
  ): Promise<CancelResponse> {
    const response = await axios.delete(
      `${ASAAS_BASE_URL}/subscriptions/${providerSubscriptionId}`,
      {
        headers: {
          access_token: getAsaasApiKey(),
        },
      },
    );

    return {
      success: response.status >= 200 && response.status < 300,
    };
  },

  verifyWebhookSignature(
    rawBody: string,
    signatureHeader?: string,
  ): boolean {
    const secret = getAsaasWebhookSecret();

    if (!secret) {
      return process.env.NODE_ENV === 'development';
    }

    if (!signatureHeader) {
      return false;
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    return expected === signatureHeader;
  },

  parseWebhook(payload: unknown): WebhookEventDto {
    return payload as WebhookEventDto;
  },
};