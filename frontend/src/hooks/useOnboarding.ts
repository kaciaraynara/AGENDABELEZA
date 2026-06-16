/**
 * Hooks React Query para o onboarding do salão.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { onboardingApi } from '@/lib/api/onboarding.api';

export const ONBOARDING_KEYS = {
  all: ['onboarding'] as const,
  status: ['onboarding', 'status'] as const,
};

export function useOnboardingStatus() {
  return useQuery({
    queryKey: ONBOARDING_KEYS.status,
    queryFn: () => onboardingApi.getStatus(),
    staleTime: 1000 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
