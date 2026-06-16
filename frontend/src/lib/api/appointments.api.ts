/**
 * Appointments API — agendamentos do salão
 */

import api from '@/lib/axios';
import type {
  Appointment,
  AppointmentsListResponse,
  AppointmentResponse,
  AppointmentStatus,
} from '@/types/api';

export interface AppointmentFilters {
  status?: AppointmentStatus;
  date?: string;
  professionalId?: string;
  clientPhone?: string;
  limit?: number;
  offset?: number;
}

export const appointmentsApi = {
  list: (filters?: AppointmentFilters) =>
    api
      .get<AppointmentsListResponse>('/appointments', { params: filters })
      .then((r) => r.data),

  today: () =>
    api
      .get<{ appointments: Appointment[] }>('/appointments/today')
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<AppointmentResponse>(`/appointments/${id}`).then((r) => r.data),

  updateStatus: (id: string, status: AppointmentStatus) =>
    api
      .patch<AppointmentResponse>(`/appointments/${id}/status`, { status })
      .then((r) => r.data),
};
