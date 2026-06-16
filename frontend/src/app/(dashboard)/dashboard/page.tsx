/**
 * Dashboard — Visão geral do salão com dados reais
 */

'use client';

import Link from 'next/link';
import { useAppointmentsToday } from '@/hooks/useAppointments';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingPage } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import type { Appointment } from '@/types/api';

// ─── Cartão de métrica ───────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}

function MetricCard({ label, value, sub, highlight }: MetricCardProps) {
  return (
    <div className={`bg-card rounded-xl border p-5 space-y-1 ${highlight ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-2xl font-bold tracking-tight ${highlight ? 'text-primary' : ''}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ─── Linha de agendamento ────────────────────────────────────────────────────

function AppointmentRow({ appt }: { appt: Appointment }) {
  const time = new Date(appt.scheduledAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Fortaleza',
  });

  return (
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
      <div className="w-12 text-center">
        <span className="text-sm font-semibold">{time}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{appt.client.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {appt.service.name} · {appt.professional.name}
        </p>
      </div>
      <div className="shrink-0">
        <StatusBadge status={appt.status} />
      </div>
    </div>
  );
}

// ─── Skeleton de agendamentos ────────────────────────────────────────────────

function AppointmentsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <Skeleton className="h-5 w-12" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  );
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, salon } = useAuth();
  const { data, isLoading } = useAppointmentsToday();

  const appointments = data?.appointments ?? [];

  const pending   = appointments.filter((a) => a.status === 'PENDING').length;
  const confirmed = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const completed = appointments.filter((a) => a.status === 'COMPLETED').length;

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Fortaleza',
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title={`Olá, ${user?.name?.split(' ')[0] ?? 'bem-vinda'} 👋`}
        description={today.charAt(0).toUpperCase() + today.slice(1)}
      />

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Hoje"
          value={isLoading ? '—' : appointments.length}
          sub="agendamentos"
          highlight
        />
        <MetricCard
          label="Pendentes"
          value={isLoading ? '—' : pending}
          sub="aguardando"
        />
        <MetricCard
          label="Confirmados"
          value={isLoading ? '—' : confirmed}
          sub="confirmados"
        />
        <MetricCard
          label="Concluídos"
          value={isLoading ? '—' : completed}
          sub="realizados"
        />
      </div>

      {/* Agendamentos de hoje */}
      <div className="bg-card rounded-xl border border-border">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Agenda de hoje</h3>
          <Link
            href="/agendamentos"
            className="text-xs text-primary hover:underline font-medium"
          >
            Ver todos →
          </Link>
        </div>

        <div className="px-5 pb-2">
          {isLoading ? (
            <div className="py-3">
              <AppointmentsSkeleton />
            </div>
          ) : appointments.length === 0 ? (
            <EmptyState
              title="Sem agendamentos hoje"
              description="Compartilhe a página do seu salão para receber agendamentos."
              action={
                salon?.slug ? (
                  <Link
                    href={`/salao/${salon.slug}`}
                    target="_blank"
                    className="text-xs text-primary hover:underline"
                  >
                    Ver página pública →
                  </Link>
                ) : undefined
              }
            />
          ) : (
            appointments.map((appt) => (
              <AppointmentRow key={appt.id} appt={appt} />
            ))
          )}
        </div>
      </div>

      {/* Link página pública */}
      {salon?.slug && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Sua página pública</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Compartilhe este link com seus clientes para receberem agendamentos online
            </p>
          </div>
          <Link
            href={`/salao/${salon.slug}`}
            target="_blank"
            className="shrink-0 text-xs font-medium text-primary hover:underline"
          >
            /salao/{salon.slug} →
          </Link>
        </div>
      )}
    </div>
  );
}
