'use client';

/**
 * BlockedPremium — Overlay/estado exibido quando isBlocked=true.
 * Pode ser usado como overlay em páginas premium ou como bloco inline.
 */

import Link from 'next/link';
import { Lock, Zap } from 'lucide-react';

interface BlockedPremiumProps {
  /** Se true, cobre todo o container pai com overlay semi-transparente */
  overlay?: boolean;
  title?: string;
  description?: string;
}

export function BlockedPremium({
  overlay = false,
  title = 'Recurso Premium',
  description = 'Assine um plano para desbloquear este recurso e continuar usando o AgendaBeleza.',
}: BlockedPremiumProps) {
  const content = (
    <div className="flex flex-col items-center text-center gap-4 py-10 px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Lock size={28} />
      </div>

      <div className="max-w-xs">
        <h3 className="font-bold text-base text-foreground mb-1.5">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <Link
        href="/billing"
        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
      >
        <Zap size={15} />
        Ver planos e assinar
      </Link>
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm border border-border">
        {content}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30">
      {content}
    </div>
  );
}
