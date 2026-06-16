/**
 * Onboarding API
 * Consome os endpoints de configuração inicial do salão.
 */

import api from '@/lib/axios';
import type { OnboardingStatusDto } from '@/types/onboarding.types';

export const onboardingApi = {
  getStatus: () =>
    api
      .get<OnboardingStatusDto>('/onboarding/status')
      .then((response) => response.data),
};
