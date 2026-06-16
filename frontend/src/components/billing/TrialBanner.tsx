'use client';

/**
 * TrialBanner — Exibe um aviso quando o salão está em período de trial.
 * Aparece no topo da página de billing e opcionalmente no dashboard.
 */

import Link from 'next/link';
import { Clock, Zap } from 'lucide-react';
import type { BillingStatus } from '@/types/billing.types';

interface TrialBannerProps {
  status: BillingStatus;
  compact?: boolean;
}

export function TrialBanner({ status, compact = false }: TrialBannerProps) {
  if (status.subscriptionStatus !== 'TRIAL') return null;

  const days = status.daysRemainingInTrial ?? 0;
  const isUrgent = days <= 3;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border ${
          isUrgent
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}
      >
        <Clock size={13} />
        <span>
          Trial: {days > 0 ? `${days} dia${days !== 1 ? 's' : ''} restante${days !== 1 ? 's' : ''}` : 'Expirado hoje'}
        </span>
        <Link href="/billing" className="underline underline-offset-2 ml-1 font-semibold">
          Assinar
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        isUrgent
          ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
          : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
      }`}
    >
      {/* Faixa decorativa */}
      <div
        className={`absolute inset-y-0 left-0 w-1 rounded-l-2xl ${
          isUrgent ? 'bg-red-400' : 'bg-amber-400'
        }`}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pl-3">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              isUrgent ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            <Clock size={18} />
          </div>
          <div>
            <p className={`font-semibold text-sm ${isUrgent ? 'text-red-800' : 'text-amber-800'}`}>
              {isUrgent ? '⚠️ Trial expirando em breve!' : '✨ Período de trial ativo'}
            </p>
            <p className={`text-xs mt-0.5 ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
              {days > 0
                ? `Você tem ${days} dia${days !== 1 ? 's' : ''} restante${days !== 1 ? 's' : ''} no trial. Assine para continuar usando todos os recursos.`
                : 'Seu período de trial expira hoje. Assine agora para não perder o acesso.'}
            </p>
          </div>
        </div>

        <Link
          href="#planos"
          className={`flex items-center gap-2 shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-150 ${
            isUrgent
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
          }`}
        >
          <Zap size={13} />
          Assinar agora
        </Link>
      </div>
    </div>
  );
}
