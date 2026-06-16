/**
 * Hook useIsAuthenticated — unifica a lógica de hidratação e autenticação
 */

'use client';

import { useAuthStore } from '@/store/auth.store';

/**
 * Retorna `true` apenas quando:
 *   • Zustand já está hidratado (`isHydrated`)
 *   • Existe token (`token` não nulo/undefined)
 *   • Store marca o usuário como autenticado (`isAuthenticated`)
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated, token, isHydrated } = useAuthStore(
    (state) => ({
      isAuthenticated: state.isAuthenticated,
      token: state.token,
      isHydrated: state.isHydrated,
    })
  );

  return Boolean(isHydrated && isAuthenticated && token);
}
