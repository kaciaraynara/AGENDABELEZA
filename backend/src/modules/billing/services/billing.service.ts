// src/modules/billing/services/billing.service.ts

import { PaymentProvider, SubscriptionStatus } from '@prisma/client';
import { prisma } from '../../../config/prisma';
import {
  billingProvider,
  getBillingProvider,
  stripeProvider,
} from '../providers';
import { AppError } from '../../../shared/errors/AppError';
import {
  BillingStatusDto,
  PlanDto,
  CreateCheckoutResponse,
  CancelResponse,
} from '../types/billing.type';

// ─── Planos disponíveis ────────────────────────────────────────────────────────
const plans: PlanDto[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceCents: 3990,
    description: 'Plano básico para salões iniciantes',
    features: [
      'Gestão de agenda',
      'Histórico de clientes',
      'Link público de agendamento',
      'WhatsApp manual',
    ],
    recommended: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    priceCents: 6990,
    description: 'Plano completo com recursos avançados',
    features: [
      'Todas as funcionalidades do Starter',
      'Dashboard executivo',
      'Integração WhatsApp automática',
      'Relatórios avançados',
      'Suporte prioritário',
    ],
    recommended: true,
  },
];

const VALID_PLAN_IDS = plans.map((p) => p.id);

function getActiveProvider(): PaymentProvider {
  const raw = (process.env.PAYMENT_PROVIDER ?? 'STRIPE').toUpperCase();
  return raw === 'ASAAS' ? PaymentProvider.ASAAS : PaymentProvider.STRIPE;
}

export const billingService = {
  /** GET /billing/plans (público) */
  getPlans(): PlanDto[] {
    return plans;
  },

  /** GET /billing/status */
  async getStatus(salonId: string): Promise<BillingStatusDto> {
    const salon = await prisma.salon.findUnique({ where: { id: salonId } });
    if (!salon) throw new AppError('SALON_NOT_FOUND', 404);

    return {
      subscriptionStatus: salon.subscriptionStatus ?? 'TRIAL',
      trialEndsAt: salon.trialEndsAt?.toISOString() ?? null,
      subscriptionEndsAt: salon.subscriptionEndsAt?.toISOString() ?? null,
      isBlocked: salon.isBlocked ?? false,
      currentPlan: salon.currentPlan ?? null,
      daysRemainingInTrial: salon.trialEndsAt
        ? Math.max(
            0,
            Math.ceil(
              (salon.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
            ),
          )
        : undefined,
    } as BillingStatusDto;
  },

  /** POST /billing/create-checkout */
  async createCheckout(
    salonId: string,
    planId: string,
    callbackUrl: string,
  ): Promise<CreateCheckoutResponse> {
    if (!VALID_PLAN_IDS.includes(planId)) {
      throw new AppError('PLAN_NOT_FOUND', 400);
    }

    const salon = await prisma.salon.findUnique({ where: { id: salonId } });
    if (!salon) throw new AppError('SALON_NOT_FOUND', 404);

    const blockingStatuses = new Set<SubscriptionStatus>([
      SubscriptionStatus.TRIAL,
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.PAST_DUE,
    ]);

    const hasExistingSubscription =
      Boolean(salon.providerSubscriptionId) &&
      blockingStatuses.has(salon.subscriptionStatus);

    if (hasExistingSubscription) {
      throw new AppError('ALREADY_SUBSCRIBED', 409);
    }

    const providerResponse = await billingProvider.createCheckout(
      salonId,
      planId,
      callbackUrl,
    );

    await prisma.salon.update({
      where: { id: salonId },
      data: {
        currentPlan: planId,
        paymentProvider: getActiveProvider(),
        ...(providerResponse.providerCustomerId
          ? { providerCustomerId: providerResponse.providerCustomerId }
          : {}),
      },
    });

    return { checkoutUrl: providerResponse.checkoutUrl } as CreateCheckoutResponse;
  },

  /** POST /billing/cancel */
  async cancelSubscription(salonId: string): Promise<CancelResponse> {
    const salon = await prisma.salon.findUnique({ where: { id: salonId } });
    if (!salon) throw new AppError('SALON_NOT_FOUND', 404);
    if (!salon.providerSubscriptionId) {
      throw new AppError('NO_ACTIVE_SUBSCRIPTION', 400);
    }

    const paymentProvider =
      salon.paymentProvider ?? getActiveProvider();

    const provider = getBillingProvider(paymentProvider);

    await provider.cancelSubscription(
      salon.providerSubscriptionId,
    );

    if (paymentProvider === PaymentProvider.ASAAS) {
      await prisma.salon.update({
        where: { id: salonId },
        data: {
          subscriptionStatus: 'CANCELED',
          isBlocked: true,
          providerSubscriptionId: null,
        },
      });
    } else {
      await prisma.salon.update({
        where: { id: salonId },
        data: {
          isBlocked: false,
        },
      });
    }

    return { success: true } as CancelResponse;
  },

  /**
   * POST /billing/webhook
   * Processa eventos do Stripe e atualiza o status da assinatura.
   */
  async handleWebhook(event: any): Promise<void> {
    const eventType = event.type as string;

    switch (eventType) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const salonId = session.metadata?.salonId as string | undefined;
        const planId = session.metadata?.planId as string | undefined;
        if (!salonId) break;

        await prisma.salon.update({
          where: { id: salonId },
          data: {
            subscriptionStatus: 'TRIAL',
            isBlocked: false,
            currentPlan: planId ?? undefined,
            providerSubscriptionId: (session.subscription as string) ?? null,
            providerCustomerId: (session.customer as string) ?? null,
            paymentProvider: PaymentProvider.STRIPE,
          },
        });
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const salonId = sub.metadata?.salonId as string | undefined;
        if (!salonId) break;

        const stripeStatus = sub.status as string;
        const isTrialing = stripeStatus === 'trialing';
        const isActive = stripeStatus === 'active';
        const hasAccess = isTrialing || isActive;
        const periodEnd = new Date((sub.current_period_end as number) * 1000);
        const trialEndsAt =
          typeof sub.trial_end === 'number'
            ? new Date(sub.trial_end * 1000)
            : null;

        await prisma.salon.update({
          where: { id: salonId },
          data: {
            subscriptionStatus: isTrialing
              ? 'TRIAL'
              : isActive
                ? 'ACTIVE'
                : 'CANCELED',
            isBlocked: !hasAccess,
            trialEndsAt,
            subscriptionEndsAt: periodEnd,
            providerSubscriptionId: sub.id as string,
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const salonId = sub.metadata?.salonId as string | undefined;
        if (!salonId) break;

        await prisma.salon.update({
          where: { id: salonId },
          data: {
            subscriptionStatus: 'CANCELED',
            isBlocked: true,
            providerSubscriptionId: null,
          },
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subId = invoice.subscription as string | null;
        if (!subId) break;

        await prisma.salon.updateMany({
          where: { providerSubscriptionId: subId },
          data: {
            isBlocked: false,
          },
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subId = invoice.subscription as string | null;
        if (!subId) break;

        await prisma.salon.updateMany({
          where: { providerSubscriptionId: subId },
          data: {
            subscriptionStatus: 'PAST_DUE',
            isBlocked: true,
          },
        });
        break;
      }

      default:
        // Evento não mapeado — ignorado silenciosamente
        break;
    }
  },
};
