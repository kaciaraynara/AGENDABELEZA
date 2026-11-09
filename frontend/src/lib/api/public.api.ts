/**
 * Public API — endpoints públicos do salão (sem autenticação)
 */

import api from '@/lib/axios';
import type { PublicSalonResponse } from '@/types/api';
import type { Service } from '@/types/api';
import type { Professional } from '@/types/api';

export interface CreatePublicAppointmentPayload {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  professionalId?: string;
  serviceId: string;
  scheduledAt: string;
  notes?: string;
}

export const publicApi = {
  getSalon: (slug: string) =>
    api.get<PublicSalonResponse>(`/public/${slug}`).then((r) => r.data),

  getServices: (slug: string) =>
    api.get<{ services: Service[] }>(`/public/${slug}/services`).then((r) => r.data),

  getProfessionals: (slug: string) =>
    api
      .get<{ professionals: Professional[] }>(`/public/${slug}/professionals`)
      .then((r) => r.data),

  createAppointment: (slug: string, data: CreatePublicAppointmentPayload) =>
    api.post(`/public/${slug}/appointments`, data).then((r) => r.data),
};
