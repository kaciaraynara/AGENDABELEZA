/**
 * useAppointments — React Query hooks para agendamentos
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { appointmentsApi, AppointmentFilters } from '@/lib/api/appointments.api';
import { getApiErrorMessage } from '@/lib/axios';
import type { AppointmentStatus } from '@/types/api';

export const APPOINTMENTS_KEY = 'appointments';

export function useAppointments(filters?: AppointmentFilters) {
  return useQuery({
    queryKey: [APPOINTMENTS_KEY, 'list', filters],
    queryFn: () => appointmentsApi.list(filters),
  });
}

export function useAppointmentsToday() {
  return useQuery({
    queryKey: [APPOINTMENTS_KEY, 'today'],
    queryFn: () => appointmentsApi.today(),
    enabled: true,
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: [APPOINTMENTS_KEY, id],
    queryFn: () => appointmentsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_KEY] });
      toast.success('Status atualizado com sucesso');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao atualizar status'));
    },
  });
}
