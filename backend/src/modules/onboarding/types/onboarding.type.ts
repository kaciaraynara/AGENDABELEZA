export interface OnboardingStatusDto {
  hasSalonInfo: boolean;
  hasServices: boolean;
  hasProfessionals: boolean;
  hasPublicLink: boolean;
  completedSteps: number; // 0-5
  nextStep: 'salon' | 'services' | 'professionals' | 'publicLink' | 'finish';
}
