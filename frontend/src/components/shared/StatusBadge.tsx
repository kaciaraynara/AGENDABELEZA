/**
 * StatusBadge — Badge de status de agendamento
 */

import { Badge } from '@/components/ui/badge';
import type { AppointmentStatus } from '@/types/api';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: 'Pendente',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  CONFIRMED: {
    label: 'Confirmado',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  COMPLETED: {
    label: 'Concluído',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  CANCELED: {
    label: 'Cancelado',
    className: 'bg-red-50 text-red-600 border-red-200',
  },
  NO_SHOW: {
    label: 'Não compareceu',
    className: 'bg-gray-50 text-gray-500 border-gray-200',
  },
};

interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

export { STATUS_CONFIG };
