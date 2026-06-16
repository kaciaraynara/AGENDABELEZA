/**
 * Header — Barra superior do painel protegido
 * Exibe título da página e info do salão
 */

'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/agendamentos': 'Agendamentos',
  '/servicos': 'Serviços',
  '/profissionais': 'Profissionais',
};

export function Header() {
  const pathname = usePathname();
  const { salon } = useAuth();

  const title =
    Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path))?.[1] ??
    'Painel';

  return (
    <header className="h-14 px-6 border-b border-border bg-card flex items-center justify-between">
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>

      {salon && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {salon.city ? `${salon.name} · ${salon.city}` : salon.name}
          </span>
          {salon.slug && (
            <a
              href={`/salao/${salon.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Ver página pública →
            </a>
          )}
        </div>
      )}
    </header>
  );
}
