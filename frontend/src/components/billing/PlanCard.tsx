'use client';

/**
 * PlanCard — Cartão de plano de assinatura com destaque para o recomendado.
 */

import { Check, Star } from 'lucide-react';
import { PayButton } from './PayButton';
import type { BillingPlan, BillingStatus } from '@/types/billing.types';

interface PlanCardProps {
  plan: BillingPlan;
  currentStatus: BillingStatus | null;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

export function PlanCard({ plan, currentStatus }: PlanCardProps) {
  const isCurrentPlan = currentStatus?.currentPlan === plan.id;
  const isActive = currentStatus?.subscriptionStatus === 'ACTIVE' && isCurrentPlan;
  const isRecommended = plan.recommended;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-200 ${
        isRecommended
          ? 'border-primary bg-gradient-to-b from-primary/5 to-primary/[0.02] shadow-lg shadow-primary/10'
          : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
      }`}
    >
      {/* Badge recomendado */}
      {isRecommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-[11px] font-bold text-primary-foreground shadow-sm">
            <Star size={10} className="fill-current" />
            Recomendado
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <h3 className={`text-base font-bold ${isRecommended ? 'text-primary' : 'text-foreground'}`}>
          {plan.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{plan.description}</p>
      </div>

      {/* Preço */}
      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-extrabold tracking-tight">
            {formatPrice(plan.priceCents)}
          </span>
          <span className="text-xs text-muted-foreground mb-1">/mês</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Cobrança mensal · Cancele quando quiser
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-7 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                isRecommended ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              }`}
            >
              <Check size={10} className="font-bold" strokeWidth={3} />
            </span>
            <span className="leading-snug text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isActive ? (
        <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-center text-sm font-semibold text-emerald-700">
          ✓ Plano atual
        </div>
      ) : (
        <PayButton
          plan={plan}
          variant={isRecommended ? 'primary' : 'outline'}
        />
      )}
    </div>
  );
}
