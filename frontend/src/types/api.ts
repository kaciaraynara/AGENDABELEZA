/**
 * Tipos das respostas da API AgendaBeleza
 */

// ─── Erros ───────────────────────────────────────────────────────────────────

export interface ApiErrorDetail {
  name: string;
  message: string;
  code: string;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

// ─── Paginação ───────────────────────────────────────────────────────────────

export interface Pagination {
  limit: number;
  offset: number;
}

// ─── Agendamentos ─────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELED'
  | 'NO_SHOW';

export interface AppointmentClient {
  id: string;
  name: string;
  phone: string;
  email: string | null;
}

export interface AppointmentProfessional {
  id: string;
  name: string;
  phone: string;
  bio: string | null;
  avatarUrl: string | null;
}

export interface AppointmentService {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: string; // Decimal vem como string do Prisma
  durationMinutes: number;
  imageUrl: string | null;
}

export interface AppointmentSalon {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
}

export interface Appointment {
  id: string;
  scheduledAt: string;
  status: AppointmentStatus;
  notes: string | null;
  timeZone: string | null;
  createdAt: string;
  updatedAt: string;
  client: AppointmentClient;
  service: AppointmentService;
  professional: AppointmentProfessional;
  salon: AppointmentSalon;
}

export interface AppointmentsListResponse {
  appointments: Appointment[];
  pagination: Pagination;
}

export interface AppointmentResponse {
  appointment: Appointment;
}

// ─── Serviços ─────────────────────────────────────────────────────────────────

export type ServiceCategory =
  | 'HAIRCUT'
  | 'COLORING'
  | 'STYLING'
  | 'NAILS'
  | 'MASSAGE'
  | 'SKINCARE'
  | 'LASHES'
  | 'WAXING'
  | 'OTHER';

export interface Service {
  id: string;
  salonId: string;
  name: string;
  description: string | null;
  category: ServiceCategory;
  price: string;
  durationMinutes: number;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesListResponse {
  services: Service[];
}

export interface ServiceResponse {
  service: Service;
}

// ─── Profissionais ────────────────────────────────────────────────────────────

export interface Professional {
  id: string;
  salonId: string;
  name: string;
  phone: string;
  bio: string | null;
  avatarUrl: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalsListResponse {
  professionals: Professional[];
}

export interface ProfessionalResponse {
  professional: Professional;
}

// ─── Salão ────────────────────────────────────────────────────────────────────

export interface SalonMeResponse {
  salon: import('./auth').Salon;
}

// ─── Público ─────────────────────────────────────────────────────────────────

export interface PublicSalonData {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  avatarUrl: string | null;
}

export interface PublicSalonResponse {
  salon: PublicSalonData;
}
