/**
 * /billing — Página de Assinatura
 * Exibe status da conta, banner de trial e cards de planos.
 */

'use client';

import { Shield, LifeBuoy } from 'lucide-react';
import { useBillingPlans, useBillingStatus } from '@/hooks/useBilling';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingPage } from '@/components/shared/LoadingSpinner';
import { TrialBanner } from '@/components/billing/TrialBanner';
import { SubscriptionStatus } from '@/components/billing/SubscriptionStatus';
import { PlanCard } from '@/components/billing/PlanCard';
import { BlockedPremium } from '@/components/billing/BlockedPremium';

export default function BillingPage() {
  const { data: plans, isLoading: plansLoading } = useBillingPlans();
  const { data: status, isLoading: statusLoading } = useBillingStatus();

  const isLoading = plansLoading || statusLoading;

  if (isLoading) return <LoadingPage />;

  const isBlocked = status?.isBlocked ?? false;
  const subscriptionStatus = status?.subscriptionStatus ?? 'TRIAL';

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <PageHeader
        title="Assinatura"
        description="Gerencie seu plano e acesse todos os recursos do AgendaBeleza."
      />

      {/* Bloqueio total quando conta está bloqueada e cancelada/expirada */}
      {isBlocked && subscriptionStatus !== 'TRIAL' && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <BlockedPremium
            title="Sua assinatura foi cancelada"
            description="Renove sua assinatura para recuperar acesso a todos os recursos do AgendaBeleza."
          />
        </div>
      )}

      {/* Trial Banner */}
      {status && <TrialBanner status={status} />}

      {/* Status atual */}
      {status && <SubscriptionStatus status={status} />}

      {/* Cards de planos */}
      <section id="planos" aria-labelledby="plans-heading">
        <div className="mb-5">
          <h2
            id="plans-heading"
            className="text-lg font-bold text-foreground"
          >
            Escolha seu plano
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sem taxa de setup · Cancele a qualquer momento · 7 dias de trial grátis
          </p>
        </div>

        {plansLoading ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl border border-border bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5 items-start">
            {plans?.map((plan) => (
              <PlanCard key={plan.id} plan={plan} currentStatus={status ?? null} />
            ))}
          </div>
        )}
      </section>

      {/* Garantias */}
      <div className="grid sm:grid-cols-2 gap-4">
        <GuaranteeCard
          icon={<Shield size={18} />}
          title="Pagamento 100% seguro"
          description="Todos os pagamentos são processados pelo Stripe com criptografia SSL. Não armazenamos dados do cartão."
        />
        <GuaranteeCard
          icon={<LifeBuoy size={18} />}
          title="Suporte dedicado"
          description="Nossa equipe está disponível para ajudar com qualquer dúvida sobre sua assinatura."
        />
      </div>

      {/* FAQ rápido */}
      <FaqSection />
    </div>
  );
}

// ─── Componentes internos ─────────────────────────────────────────────────────

function GuaranteeCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3.5 rounded-xl border border-border bg-card p-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim. Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais. O acesso é mantido até o fim do período pago.',
  },
  {
    q: 'O que acontece quando o trial acaba?',
    a: 'Ao fim do trial de 7 dias, os recursos premium são bloqueados. Assine um plano para retomar o acesso completo.',
  },
  {
    q: 'Como funciona a cobrança?',
    a: 'A cobrança é mensal, realizada via cartão de crédito através do Stripe. Você recebe um e-mail com a nota fiscal.',
  },
  {
    q: 'Posso mudar de plano?',
    a: 'Sim. Você pode fazer upgrade ou downgrade a qualquer momento diretamente no painel de assinatura.',
  },
];

function FaqSection() {
  return (
    <div>
      <h2 className="text-base font-bold text-foreground mb-4">Perguntas frequentes</h2>
      <div className="space-y-3">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.q}
            className="rounded-xl border border-border bg-card px-5 py-4"
          >
            <p className="text-sm font-semibold text-foreground">{item.q}</p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
