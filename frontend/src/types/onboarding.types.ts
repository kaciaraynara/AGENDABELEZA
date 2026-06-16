export type OnboardingStep =
  | 'salon'
  | 'services'
  | 'professionals'
  | 'publicLink'
  | 'finish';

export interface OnboardingStatusDto {
  completed: boolean;
  nextStep: OnboardingStep;
  progress?: number;
  steps?: {
    salon: boolean;
    services: boolean;
    professionals: boolean;
    publicLink: boolean;
    finish: boolean;
  };
}
