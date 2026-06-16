/**
 * React Query Client — configuração global
 *
 * - staleTime: 60s (não refetch se dado é recente)
 * - retry: 1, mas não retenta em erros 4xx (client errors)
 * - refetchOnWindowFocus: false (evita refetch agressivo)
 */

import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 60s
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Não retenta em erros do cliente (4xx)
        if (error instanceof AxiosError && error.response) {
          const status = error.response.status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 1;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
