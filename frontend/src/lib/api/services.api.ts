/**
 * Services API — serviços do salão
 */

import api from '@/lib/axios';
import type { Service, ServicesListResponse, ServiceResponse } from '@/types/api';

export interface CreateServicePayload {
  name: string;
  description?: string;
  category: string;
  price: number;
  durationMinutes: number;
}

export type UpdateServicePayload = Partial<CreateServicePayload> & {
  active?: boolean;
};

export const servicesApi = {
  list: () =>
    api.get<ServicesListResponse>('/services').then((r) => r.data),

  getById: (id: string) =>
    api.get<ServiceResponse>(`/services/${id}`).then((r) => r.data),

  create: (data: CreateServicePayload) =>
    api.post<ServiceResponse>('/services', data).then((r) => r.data),

  update: (id: string, data: UpdateServicePayload) =>
    api.put<ServiceResponse>(`/services/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/services/${id}`).then((r) => r.data),
};
