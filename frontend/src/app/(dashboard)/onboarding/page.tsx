import React from 'react';
import OnboardingWizard from '../../../components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Vamos deixar seu salão pronto para receber agendamentos
      </h1>
      <OnboardingWizard />
    </main>
  );
}
