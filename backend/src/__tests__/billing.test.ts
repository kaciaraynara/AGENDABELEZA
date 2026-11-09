/**
 * Testes de integração — Módulo de Billing (Stripe)
 *
 * Cenários obrigatórios:
 *  1. GET /billing/plans — público, sem token → 200
 *  2. GET /billing/status sem token → 401
 *  3. GET /billing/status com OWNER → 200
 *  4. POST /billing/create-checkout sem token → 401
 *  5. POST /billing/create-checkout planId inválido → 400
 *  6. POST /billing/create-checkout planId válido → 200 com checkoutUrl
 *  7. POST /billing/cancel sem token → 401
 *  8. POST /billing/cancel com OWNER → 200
 *  9. POST /billing/webhook com evento mockado → 200
 * 10. PROFESSIONAL tentando create-checkout → 403
 */

import request from 'supertest';
import app from '../app';
import { prisma } from '../config/prisma';
import { ownerToken, professionalToken } from './helpers/auth.helper';

// ─── Mock do provider de billing (Stripe) ─────────────────────────────────────
jest.mock('../modules/billing/providers', () => {
  const stripeProvider = {
    createCheckout: jest.fn().mockResolvedValue({
      checkoutUrl: 'https://checkout.stripe.com/pay/mock_session_id',
      providerSubscriptionId: undefined,
      providerCustomerId: 'cus_mock123',
    }),
    cancelSubscription: jest.fn().mockResolvedValue({ success: true }),
    constructWebhookEvent: jest.fn().mockImplementation((rawBody: Buffer) => {
      return JSON.parse(rawBody.toString());
    }),
  };

  const asaasProvider = {
    createCheckout: jest.fn().mockResolvedValue({
      checkoutUrl: 'https://asaas.com/checkout/mock_session_id',
      providerSubscriptionId: 'sub_asaas_mock',
      providerCustomerId: 'cus_asaas_mock',
    }),
    cancelSubscription: jest.fn().mockResolvedValue({ success: true }),
  };

  return {
    billingProvider: stripeProvider,
    stripeProvider,
    asaasProvider,
    getBillingProvider: jest.fn(
      (paymentProvider?: string | null) =>
        paymentProvider === 'ASAAS'
          ? asaasProvider
          : stripeProvider,
    ),
  };
});

// ─── Dados de teste ────────────────────────────────────────────────────────────
const SUFFIX = `_billing_${Date.now()}`;
let ownerUserId: string;
let salonId: string;
let ownerAuthToken: string;
let profAuthToken: string;

beforeAll(async () => {
  // Criar owner user
  const owner = await prisma.user.create({
    data: {
      email: `owner${SUFFIX}@billing.test`,
      name: 'Owner Billing Test',
      password: 'hashed-not-used',
      role: 'OWNER',
    },
  });
  ownerUserId = owner.id;

  // Criar salon vinculado ao owner
  const salon = await prisma.salon.create({
    data: {
      ownerId: owner.id,
      name: `Salão Billing Test${SUFFIX}`,
      slug: `salao-billing${SUFFIX}`,
      phone: '85999990099',
      subscriptionStatus: 'TRIAL',
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  salonId = salon.id;

  // Gerar tokens JWT de teste
  ownerAuthToken = ownerToken(ownerUserId, salonId);
  profAuthToken = professionalToken('prof-user-id-fake');
});

afterAll(async () => {
  await prisma.salon.deleteMany({ where: { id: salonId } });
  await prisma.user.deleteMany({ where: { id: ownerUserId } });
  await prisma.$disconnect();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function bearer(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('Billing — GET /billing/plans', () => {
  it('deve retornar 200 e lista de planos sem autenticação', async () => {
    const res = await request(app).get('/billing/plans');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('priceCents');
    expect(res.body[0]).toHaveProperty('features');
  });
});

describe('Billing — GET /billing/status', () => {
  it('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/billing/status');
    expect(res.status).toBe(401);
  });

  it('deve retornar 200 com dados do salão para OWNER autenticado', async () => {
    const res = await request(app)
      .get('/billing/status')
      .set(bearer(ownerAuthToken));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('subscriptionStatus');
    expect(res.body).toHaveProperty('isBlocked');
    expect(res.body).toHaveProperty('currentPlan');
  });
});

describe('Billing — POST /billing/create-checkout', () => {
  it('deve retornar 401 sem token', async () => {
    const res = await request(app)
      .post('/billing/create-checkout')
      .send({ planId: 'premium' });
    expect(res.status).toBe(401);
  });

  it('deve retornar 400 para planId inválido', async () => {
    const res = await request(app)
      .post('/billing/create-checkout')
      .set(bearer(ownerAuthToken))
      .send({ planId: 'invalid_plan' });
    expect(res.status).toBe(400);
  });

  it('deve retornar 403 para PROFESSIONAL', async () => {
    const res = await request(app)
      .post('/billing/create-checkout')
      .set(bearer(profAuthToken))
      .send({ planId: 'premium' });
    expect(res.status).toBe(403);
  });

  it('deve retornar 200 com checkoutUrl para planId=premium', async () => {
    const res = await request(app)
      .post('/billing/create-checkout')
      .set(bearer(ownerAuthToken))
      .send({ planId: 'premium' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('checkoutUrl');
  });
});

describe('Billing — proteção contra assinatura duplicada', () => {
  it('deve retornar 409 e não chamar o provider quando já existe assinatura', async () => {
    const { billingProvider } = jest.requireMock(
      '../modules/billing/providers',
    ) as {
      billingProvider: {
        createCheckout: jest.Mock;
      };
    };

    billingProvider.createCheckout.mockClear();

    await prisma.salon.update({
      where: { id: salonId },
      data: {
        subscriptionStatus: 'TRIAL',
        providerSubscriptionId: 'sub_existing_test',
      },
    });

    try {
      const res = await request(app)
        .post('/billing/create-checkout')
        .set(bearer(ownerAuthToken))
        .send({ planId: 'premium' });

      expect(res.status).toBe(409);
      expect(billingProvider.createCheckout).not.toHaveBeenCalled();
    } finally {
      await prisma.salon.update({
        where: { id: salonId },
        data: {
          subscriptionStatus: 'TRIAL',
          providerSubscriptionId: null,
        },
      });
    }
  });
});

describe('Billing — POST /billing/cancel', () => {
  it('deve retornar 401 sem token', async () => {
    const res = await request(app).post('/billing/cancel');
    expect(res.status).toBe(401);
  });

  it('deve retornar 400 sem assinatura ativa', async () => {
    // Salão ainda não tem providerSubscriptionId
    const res = await request(app)
      .post('/billing/cancel')
      .set(bearer(ownerAuthToken));
    expect(res.status).toBe(400);
  });
  it('deve manter acesso ao solicitar cancelamento no Stripe', async () => {
    const {
      stripeProvider,
      asaasProvider,
    } = jest.requireMock('../modules/billing/providers') as {
      stripeProvider: {
        cancelSubscription: jest.Mock;
      };
      asaasProvider: {
        cancelSubscription: jest.Mock;
      };
    };

    stripeProvider.cancelSubscription.mockClear();
    asaasProvider.cancelSubscription.mockClear();

    await prisma.salon.update({
      where: { id: salonId },
      data: {
        paymentProvider: 'MERCADOPAGO',
        subscriptionStatus: 'TRIAL',
        providerSubscriptionId: 'sub_mp_existing',
        isBlocked: false,
      },
    });

    try {
      const res = await request(app)
        .post('/billing/cancel')
        .set(bearer(ownerAuthToken));

      expect(res.status).toBe(200);
      expect(stripeProvider.cancelSubscription).toHaveBeenCalledWith(
        'sub_mp_existing',
      );
      expect(asaasProvider.cancelSubscription).not.toHaveBeenCalled();

      const salon = await prisma.salon.findUnique({
        where: { id: salonId },
      });

      expect(salon?.subscriptionStatus).toBe('TRIAL');
      expect(salon?.isBlocked).toBe(false);
      expect(salon?.providerSubscriptionId).toBe(
        'sub_mp_existing',
      );
    } finally {
      await prisma.salon.update({
        where: { id: salonId },
        data: {
          paymentProvider: null,
          subscriptionStatus: 'TRIAL',
          providerSubscriptionId: null,
          isBlocked: false,
        },
      });
    }
  });

  it('deve bloquear imediatamente após cancelamento no Asaas', async () => {
    const {
      stripeProvider,
      asaasProvider,
    } = jest.requireMock('../modules/billing/providers') as {
      stripeProvider: {
        cancelSubscription: jest.Mock;
      };
      asaasProvider: {
        cancelSubscription: jest.Mock;
      };
    };

    stripeProvider.cancelSubscription.mockClear();
    asaasProvider.cancelSubscription.mockClear();

    await prisma.salon.update({
      where: { id: salonId },
      data: {
        paymentProvider: 'ASAAS',
        subscriptionStatus: 'ACTIVE',
        providerSubscriptionId: 'sub_asaas_existing',
        isBlocked: false,
      },
    });

    try {
      const res = await request(app)
        .post('/billing/cancel')
        .set(bearer(ownerAuthToken));

      expect(res.status).toBe(200);
      expect(asaasProvider.cancelSubscription).toHaveBeenCalledWith(
        'sub_asaas_existing',
      );
      expect(stripeProvider.cancelSubscription).not.toHaveBeenCalled();

      const salon = await prisma.salon.findUnique({
        where: { id: salonId },
      });

      expect(salon?.subscriptionStatus).toBe('CANCELED');
      expect(salon?.isBlocked).toBe(true);
      expect(salon?.providerSubscriptionId).toBeNull();
    } finally {
      await prisma.salon.update({
        where: { id: salonId },
        data: {
          paymentProvider: null,
          subscriptionStatus: 'TRIAL',
          providerSubscriptionId: null,
          isBlocked: false,
        },
      });
    }
  });
});

// Testes de webhook foram movidos para src/modules/billing/__tests__/billing.test.ts
