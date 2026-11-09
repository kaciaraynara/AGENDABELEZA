'use client';

/**
 * PayButton — Botão de assinar que dispara o checkout no MercadoPago.
 */

import { Loader2, Zap } from 'lucide-react';
import { useCreateCheckout } from '@/hooks/useBilling';
import type { BillingPlan } from '@/types/billing.types';

interface PayButtonProps {
  plan: BillingPlan;
  variant?: 'primary' | 'outline';
  className?: string;
}

export function PayButton({ plan, variant = 'primary', className = '' }: PayButtonProps) {
  const { mutate, isPending } = useCreateCheckout();

  const handleClick = () => {
    mutate({ planId: plan.id });
  };

  const base =
    'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  const styles = {
    primary: `${base} bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm`,
    outline: `${base} border border-primary text-primary hover:bg-primary/5`,
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`${styles[variant]} ${className}`}
      aria-label={`Assinar plano ${plan.name}`}
    >
      {isPending ? (
        <>
          <Loader2 size={15} className="animate-spin" />
          Aguarde…
        </>
      ) : (
        <>
          <Zap size={15} />
          Assinar agora
        </>
      )}
    </button>
  );
}
