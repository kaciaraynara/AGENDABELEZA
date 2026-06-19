/**
 * Hook useAuth — abstração sobre o Zustand auth store
 * Expõe state + ações de login/logout com integração real da API
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import api, { getApiErrorMessage } from '@/lib/axios';
import type { AuthResponse, MeResponse } from '@/types/auth';

export function useAuth() {
  const router = useRouter();
  const { token, user, salon, isAuthenticated, isHydrated, setAuth, clearAuth, setSalon } =
    useAuthStore();

  /**
   * Login com email e senha
   * Chama POST /auth/login → salva token + dados no store
   */
  async function login(email: string, password: string): Promise<void> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    setAuth(data.token, data.user, data.salon);
    document.cookie =
      '__ab_auth=1; path=/; max-age=604800; SameSite=Lax';
    router.replace('/dashboard');
    router.refresh();
  }

  /**
   * Cadastro de novo OWNER + Salão
   * Chama POST /auth/register → salva token + dados no store
   */
  async function register(payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    salon: {
      name: string;
      slug: string;
      phone: string;
    };
  }): Promise<void> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    setAuth(data.token, data.user, data.salon);
    document.cookie =
      '__ab_auth=1; path=/; max-age=604800; SameSite=Lax';
    router.replace('/dashboard');
    router.refresh();
  }

  /**
   * Logout — limpa store e redireciona para login
   */
  function logout(): void {
    clearAuth();
    document.cookie =
      '__ab_auth=; path=/; max-age=0; SameSite=Lax';
    router.replace('/login');
    router.refresh();
  }

  /**
   * Recarrega dados do usuário autenticado
   * Chama GET /auth/me → atualiza user + salon no store
   */
  async function refreshMe(): Promise<void> {
    try {
      const { data } = await api.get<MeResponse>('/auth/me');
      if (data.salon) {
        setSalon(data.salon);
      }
    } catch {
      // Silencia erro — o interceptor 401 já cuida de logout forçado
    }
  }

  return {
    // Estado
    token,
    user,
    salon,
    isAuthenticated,
    isHydrated,

    // Ações
    login,
    register,
    logout,
    refreshMe,

    // Helpers
    getApiErrorMessage,
  };
}
