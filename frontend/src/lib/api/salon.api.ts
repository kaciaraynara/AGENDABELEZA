/**
 * Salon API — dados do salão autenticado
 */

import api from '@/lib/axios';
import type { Salon } from '@/types/auth';

export interface UpdateSalonPayload {
  name?: string;
  phone?: string;
  email?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export const salonApi = {
  me: () =>
    api.get<{ salon: Salon }>('/salon/me').then((r) => r.data),

  update: (data: UpdateSalonPayload) =>
    api.put<{ salon: Salon }>('/salon/me', data).then((r) => r.data),
};
