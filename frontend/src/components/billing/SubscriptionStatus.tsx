'use client';

/**
 * SubscriptionStatus — Cartão com informações completas da assinatura atual.
 */

import { CheckCircle, AlertTriangle, XCircle, Clock, CreditCard } from 'lucide-react';
import type { BillingStatus, SubscriptionStatus as StatusType } from '@/types/billing.types';

interface SubscriptionStatusProps {
  status: BillingStatus;
}

const STATUS_CONFIG: Record<
  StatusType,
  { label: string; color: string; bgColor: string; borderColor: string; Icon: React.FC<{ size?: number }> }
> = {
  TRIAL: {
    label: 'Trial',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    Icon: Clock,
  },
  ACTIVE: {
    label: 'Ativo',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    Icon: CheckCircle,
  },
  PAST_DUE: {
    label: 'Pagamento pendente',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    Icon: AlertTriangle,
  },
  CANCELED: {
    label: 'Cancelado',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    Icon: XCircle,
  },
  EXPIRED: {
    label: 'Expirado',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    Icon: XCircle,
  },
};

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Fortaleza',
  });
}

function planLabel(plan: string | null) {
  if (!plan) return '—';
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

export function SubscriptionStatus({ status }: SubscriptionStatusProps) {
  const cfg = STATUS_CONFIG[status.subscriptionStatus] ?? STATUS_CONFIG.EXPIRED;
  const { Icon } = cfg;

  return (
    <div className={`rounded-2xl border p-5 ${cfg.bgColor} ${cfg.borderColor}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 ${cfg.color}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Status da assinatura
          </p>
          <p className={`text-base font-bold ${cfg.color}`}>{cfg.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <InfoCell label="Plano atual" value={planLabel(status.currentPlan)} />
        {status.subscriptionStatus === 'TRIAL' && (
          <InfoCell
            label="Trial expira em"
            value={
              status.daysRemainingInTrial !== undefined
                ? `${status.daysRemainingInTrial} dia${status.daysRemainingInTrial !== 1 ? 's' : ''}`
                : formatDate(status.trialEndsAt)
            }
          />
        )}
        {status.subscriptionStatus !== 'TRIAL' && (
          <InfoCell label="Renova em" value={formatDate(status.subscriptionEndsAt)} />
        )}
        <InfoCell
          label="Acesso"
          value={status.isBlocked ? 'Bloqueado' : 'Liberado'}
          valueClassName={status.isBlocked ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold'}
        />
      </div>

      {/* Badge de pagamento */}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <CreditCard size={13} />
        <span>Pagamento processado via Mercado Pago · SSL seguro</span>
      </div>
    </div>
  );
}

function InfoCell({
  label,
  value,
  valueClassName = '',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-white/60 rounded-xl p-3 border border-white/80">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className={`text-sm font-semibold ${valueClassName || 'text-foreground'}`}>{value}</p>
    </div>
  );
}
