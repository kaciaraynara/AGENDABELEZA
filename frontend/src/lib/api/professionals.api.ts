/**
 * Professionals API — profissionais do salão
 */

import api from '@/lib/axios';
import type { Professional, ProfessionalsListResponse, ProfessionalResponse } from '@/types/api';

export interface CreateProfessionalPayload {
  name: string;
  phone: string;
  bio?: string;
}

export type UpdateProfessionalPayload = Partial<CreateProfessionalPayload> & {
  active?: boolean;
};

export const professionalsApi = {
  list: () =>
    api.get<ProfessionalsListResponse>('/professionals').then((r) => r.data),

  getById: (id: string) =>
    api.get<ProfessionalResponse>(`/professionals/${id}`).then((r) => r.data),

  create: (data: CreateProfessionalPayload) =>
    api.post<ProfessionalResponse>('/professionals', data).then((r) => r.data),

  update: (id: string, data: UpdateProfessionalPayload) =>
    api.put<ProfessionalResponse>(`/professionals/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/professionals/${id}`).then((r) => r.data),
};
