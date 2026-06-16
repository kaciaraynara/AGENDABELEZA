/**
 * Axios Client — AgendaBeleza API
 *
 * - baseURL apontado para o backend (NEXT_PUBLIC_API_URL)
 * - Request interceptor: injeta JWT do store em cada requisição
 * - Response interceptor: em 401 → limpa auth + redireciona para /login
 */

import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// ─── Request interceptor — injeta token JWT ───────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Import store lazily to avoid circular deps
    const { token } = require('@/store/auth.store').useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Response interceptor — trata 401 ────────────────────────────────────
let hasRedirected = false;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined' && !hasRedirected) {
      const { clearAuth } = require('@/store/auth.store').useAuthStore.getState();
      clearAuth();
      localStorage.removeItem('agendabeleza-auth');
      hasRedirected = true;
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);



// ─── Helper: extrai mensagem de erro da API ───────────────────────────────
export function getApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: { message?: string } } | undefined;
    return data?.error?.message ?? fallback;
  }
  return fallback;
}

export default api;
