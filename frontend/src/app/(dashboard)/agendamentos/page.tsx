/**
 * Agendamentos — Tabela completa com filtros e atualização de status
 */

'use client';

import { useState } from 'react';
import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, STATUS_CONFIG } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Appointment, AppointmentStatus } from '@/types/api';

// ─── Filtros ─────────────────────────────────────────────────────────────────

interface Filters {
  status?: AppointmentStatus;
  date?: string;
  clientPhone?: string;
}

function AppointmentFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={filters.status ?? 'ALL'}
        onValueChange={(v) =>
          onChange({ ...filters, status: v === 'ALL' ? undefined : (v as AppointmentStatus) })
        }
      >
        <SelectTrigger className="w-40 h-9 text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos os status</SelectItem>
          {(Object.keys(STATUS_CONFIG) as AppointmentStatus[]).map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        className="w-44 h-9 text-sm"
        value={filters.date ?? ''}
        onChange={(e) => onChange({ ...filters, date: e.target.value || undefined })}
      />

      <Input
        type="tel"
        placeholder="Telefone do cliente"
        className="w-48 h-9 text-sm"
        value={filters.clientPhone ?? ''}
        onChange={(e) =>
          onChange({ ...filters, clientPhone: e.target.value || undefined })
        }
      />

      {(filters.status || filters.date || filters.clientPhone) && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 text-sm"
          onClick={() => onChange({})}
        >
          Limpar filtros
        </Button>
      )}
    </div>
  );
}

// ─── Dialog de atualização de status ─────────────────────────────────────────

interface StatusDialogProps {
  appointment: Appointment | null;
  onClose: () => void;
}

function StatusUpdateDialog({ appointment, onClose }: StatusDialogProps) {
  const { mutate, isPending } = useUpdateAppointmentStatus();
  const [selected, setSelected] = useState<AppointmentStatus | ''>('');

  if (!appointment) return null;

  function handleSave() {
    if (!selected || !appointment) return;
    mutate({ id: appointment.id, status: selected }, { onSuccess: onClose });
  }

  return (
    <Dialog open={Boolean(appointment)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Atualizar status</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{appointment.client.name}</span>{' '}
            · {appointment.service.name}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status atual:</span>
            <StatusBadge status={appointment.status} />
          </div>

          <Select
            value={selected}
            onValueChange={(v) => setSelected(v as AppointmentStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o novo status" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(STATUS_CONFIG) as AppointmentStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!selected || isPending}
          >
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Linha da tabela ──────────────────────────────────────────────────────────

function AppointmentRow({
  appt,
  onStatusClick,
}: {
  appt: Appointment;
  onStatusClick: (a: Appointment) => void;
}) {
  const dt = new Date(appt.scheduledAt);
  const date = dt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'America/Fortaleza',
  });
  const time = dt.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Fortaleza',
  });

  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3 text-sm">
        <div className="font-medium">{appt.client.name}</div>
        <div className="text-xs text-muted-foreground">{appt.client.phone}</div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
        {appt.service.name}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
        {appt.professional?.name || '-'}
      </td>
      <td className="px-4 py-3 text-sm">
        <div>{date}</div>
        <div className="text-xs text-muted-foreground">{time}</div>
      </td>
      <td className="px-4 py-3">
        <button onClick={() => onStatusClick(appt)} className="hover:opacity-80 transition-opacity">
          <StatusBadge status={appt.status} />
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        {appt.client.phone && (
          <a
            href={`https://wa.me/55${appt.client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
              `Olá ${appt.client.name.split(' ')[0]}, seu horário para ${appt.service.name} amanhã às ${time} está confirmado!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
            title="Enviar mensagem via WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>
        )}
      </td>
    </tr>
  );
}

// ─── Skeleton da tabela ───────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-border">
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-3 w-20" />
          </td>
          <td className="px-4 py-3 hidden sm:table-cell">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-4 py-3 hidden md:table-cell">
            <Skeleton className="h-4 w-20" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-3 w-10" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-5 w-20" />
          </td>
          <td className="px-4 py-3 text-right">
            <Skeleton className="h-8 w-8 rounded-full ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default function AgendamentosPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);

  const { data, isLoading } = useAppointments({
    status: filters.status,
    date: filters.date,
    clientPhone: filters.clientPhone,
    limit: 50,
    offset: 0,
  });

  const appointments = data?.appointments ?? [];

  return (
    <div className="space-y-5 max-w-6xl">
      <PageHeader
        title="Agendamentos"
        description="Gerencie todos os agendamentos do seu salão"
      />

      <AppointmentFilters filters={filters} onChange={setFilters} />

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Cliente
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                Serviço
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                Profissional
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Data/Hora
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton />
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    title="Nenhum agendamento encontrado"
                    description={
                      filters.status || filters.date || filters.clientPhone
                        ? 'Tente limpar os filtros'
                        : 'Os agendamentos aparecerão aqui conforme os clientes agendarem'
                    }
                  />
                </td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <AppointmentRow
                  key={appt.id}
                  appt={appt}
                  onStatusClick={setEditingAppt}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        {!isLoading && `${appointments.length} agendamento${appointments.length !== 1 ? 's' : ''} encontrado${appointments.length !== 1 ? 's' : ''}`}
      </p>

      <StatusUpdateDialog
        appointment={editingAppt}
        onClose={() => setEditingAppt(null)}
      />
    </div>
  );
}
