/**
 * Tipos de autenticação — espelham as respostas do backend
 */
export type UserRole = 'OWNER' | 'PROFESSIONAL' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Salon {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  phone: string;
  email: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  businessHours: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  salon: Salon | null;
}

export interface MeResponse {
  user: User;
  salon: Salon | null;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  salon: Salon | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}
