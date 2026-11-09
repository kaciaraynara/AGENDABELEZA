/**
 * Dashboard — Command Center (Power BI Style)
 */

'use client';

import Link from 'next/link';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import type { Appointment } from '@/types/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// ─── Cartão de métrica ───────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}

function MetricCard({ label, value, sub, highlight }: MetricCardProps) {
  return (
    <div className={`bg-card rounded-xl border p-5 space-y-1 shadow-sm ${highlight ? 'border-primary/50 bg-primary/10 shadow-primary/10' : 'border-border'}`}>
      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-3xl font-bold tracking-tight ${highlight ? 'text-primary drop-shadow-sm' : ''}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground font-medium">{sub}</p>}
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
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 px-2 rounded-md transition-colors">
      <div className="w-12 text-center">
        <span className="text-sm font-bold text-primary">{time}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate">{appt.client.name}</p>
        <p className="text-xs text-muted-foreground truncate font-medium">
          {appt.service.name} · {appt.professional?.name || 'Salão'}
        </p>
      </div>
      <div className="shrink-0 flex items-center gap-3">
        <StatusBadge status={appt.status} />
        {appt.client.phone && (
          <a
            href={`https://wa.me/55${appt.client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
              `Olá ${appt.client.name.split(' ')[0]}, seu horário para ${appt.service.name} amanhã às ${time} está confirmado!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-sm"
            title="Enviar mensagem automática no WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span className="text-xs font-bold hidden sm:inline">WhatsApp</span>
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton de agendamentos ────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
    </div>
  );
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, salon } = useAuth();
  
  // Pegamos os últimos 100 agendamentos para gerar estatísticas ricas
  const { data, isLoading } = useAppointments({ limit: 100 });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <PageHeader title="Carregando Inteligência..." description="Analisando dados do salão" />
        <DashboardSkeleton />
      </div>
    );
  }

  const appointments = data?.appointments ?? [];

  // Cálculos de Inteligência de Negócio
  const totalRevenue = appointments
    .filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED')
    .reduce((acc, a) => acc + Number(a.service.price), 0);

  const pending = appointments.filter((a) => a.status === 'PENDING').length;
  const completed = appointments.filter((a) => a.status === 'COMPLETED').length;
  const canceled = appointments.filter((a) => a.status === 'CANCELED').length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.scheduledAt.startsWith(todayStr));

  // Dados para o Gráfico de Barras (Receita por Dia nos últimos 7 dias)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const revenueByDay = last7Days.map(dateStr => {
    const dayRevenue = appointments
      .filter(a => a.scheduledAt.startsWith(dateStr) && (a.status === 'COMPLETED' || a.status === 'CONFIRMED'))
      .reduce((acc, a) => acc + Number(a.service.price), 0);
    
    // Pegar só o dia e mês para o label
    const [, month, day] = dateStr.split('-');
    return { name: `${day}/${month}`, Receita: dayRevenue };
  });

  // Dados para o Gráfico de Pizza (Status)
  const statusData = [
    { name: 'Concluídos', value: completed, color: '#10b981' }, // emerald-500
    { name: 'Pendentes', value: pending, color: '#3b82f6' },    // blue-500 (Vibrante)
    { name: 'Cancelados', value: canceled, color: '#ec4899' },  // pink-500 (Vibrante)
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Executive Board · ${salon?.name ?? 'Salão'}`}
          description="Visão estratégica e inteligência de negócio"
        />
        {salon?.slug && (
          <Link
            href={`/salao/${salon.slug}`}
            target="_blank"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 shadow-[0_0_15px_rgba(201,162,112,0.5)] border border-primary/50"
          >
            Página Pública do Salão
          </Link>
        )}
      </div>

      {/* KPIs Premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Receita Estimada"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
          sub="agendamentos confirmados e concluídos"
          highlight
        />
        <MetricCard
          label="Hoje"
          value={todayAppointments.length}
          sub="agendamentos marcados para hoje"
        />
        <MetricCard
          label="Taxa de Conclusão"
          value={`${appointments.length ? Math.round((completed / appointments.length) * 100) : 0}%`}
          sub="dos agendamentos foram finalizados"
        />
        <MetricCard
          label="Total (Histórico)"
          value={appointments.length}
          sub="agendamentos registrados"
        />
      </div>

      {/* Gráficos Power BI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico de Receita */}
        <div className="bg-card rounded-xl border border-border p-5 lg:col-span-2 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-6">Receita nos Últimos 7 Dias</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByDay}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(val) => `R$ ${val}`} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                />
                <Bar dataKey="Receita" fill="url(#colorReceita)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza (Status) */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-2">Distribuição de Status</h3>
          <div className="flex-1 h-[250px] w-full flex items-center justify-center">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">Sem dados suficientes</p>
            )}
          </div>
          {/* Legenda manual */}
          {statusData.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {statusData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs font-medium text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lista de Agendamentos de Hoje */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Fila de Hoje</h3>
          <Link
            href="/agendamentos"
            className="text-xs text-primary hover:underline font-bold"
          >
            Ver todos →
          </Link>
        </div>

        <div className="px-5 pb-2">
          {todayAppointments.length === 0 ? (
            <EmptyState
              title="A fila de hoje está livre"
              description="Envie sua página pública pelo WhatsApp para lotar sua agenda!"
            />
          ) : (
            todayAppointments.map((appt) => (
              <AppointmentRow key={appt.id} appt={appt} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
