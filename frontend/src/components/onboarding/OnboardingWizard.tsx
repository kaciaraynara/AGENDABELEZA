'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useOnboardingStatus } from '@/hooks/useOnboarding';
import type { OnboardingStatusDto } from '@/types/onboarding.types';

import SalonStep from '../onboarding/SalonStep';
import ServicesStep from '../onboarding/ServicesStep';
import ProfessionalsStep from '../onboarding/ProfessionalsStep';
import PublicLinkStep from '../onboarding/PublicLinkStep';
import FinishStep from '../onboarding/FinishStep';

const stepsOrder: OnboardingStatusDto['nextStep'][] = [
  'salon',
  'services',
  'professionals',
  'publicLink',
  'finish',
];

const stepLabels: Record<OnboardingStatusDto['nextStep'], string> = {
  salon: 'Dados do salão',
  services: 'Serviços',
  professionals: 'Profissionais',
  publicLink: 'Link público',
  finish: 'Finalização',
};

export default function OnboardingWizard() {
  const { data: status, isLoading, error, refetch } = useOnboardingStatus();

  const [currentStep, setCurrentStep] =
    useState<OnboardingStatusDto['nextStep']>('salon');

  const hasShownError = useRef(false);

  useEffect(() => {
    if (!status?.nextStep) return;

    setCurrentStep((previousStep) => {
      if (previousStep === status.nextStep) {
        return previousStep;
      }

      return status.nextStep;
    });
  }, [status?.nextStep]);

  useEffect(() => {
    if (!error || hasShownError.current) return;

    hasShownError.current = true;
    toast.error('Erro ao carregar status de onboarding');
  }, [error]);

  const handleStepSuccess = async () => {
    await refetch();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'salon':
        return <SalonStep onSuccess={handleStepSuccess} />;

      case 'services':
        return <ServicesStep onSuccess={handleStepSuccess} />;

      case 'professionals':
        return <ProfessionalsStep onSuccess={handleStepSuccess} />;

      case 'publicLink':
        return <PublicLinkStep onSuccess={handleStepSuccess} />;

      case 'finish':
        return <FinishStep />;

      default:
        return null;
    }
  };

  const currentIndex = stepsOrder.indexOf(currentStep);
  const progress = ((currentIndex + 1) / stepsOrder.length) * 100;

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-[#F3E7DD] bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#FFE1EF] border-t-[#FF4F9A]" />
          <p className="text-sm font-medium text-zinc-600">
            Preparando seu salão...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FF4F9A] via-[#FF7A59] to-[#FFD166] p-8 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
          Configuração inicial
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          Vamos deixar seu salão pronto para vender mais
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 md:text-base">
          Configure seus dados principais, serviços, profissionais e link público
          de agendamento em poucos passos.
        </p>
      </div>

      <div className="rounded-[2rem] border border-[#F3E7DD] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#FF4F9A]">
              Etapa {currentIndex + 1} de {stepsOrder.length}
            </p>
            <h2 className="text-xl font-bold text-[#1F1F1F]">
              {stepLabels[currentStep]}
            </h2>
          </div>

          <span className="rounded-full bg-[#FFF0F6] px-4 py-2 text-sm font-semibold text-[#FF4F9A]">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-[#FFF0F6]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF4F9A] via-[#FF7A59] to-[#FFD166] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-6 grid gap-2 md:grid-cols-5">
          {stepsOrder.map((step, index) => {
            const isActive = step === currentStep;
            const isCompleted = index < currentIndex;

            return (
              <div
                key={step}
                className={`rounded-2xl border p-3 text-xs font-semibold transition-all ${isActive
                    ? 'border-[#FF4F9A] bg-[#FFF0F6] text-[#FF4F9A]'
                    : isCompleted
                      ? 'border-[#2ECC71]/30 bg-[#EEFFF6] text-[#1E9E57]'
                      : 'border-[#F3E7DD] bg-[#FFF8F2] text-zinc-500'
                  }`}
              >
                {stepLabels[step]}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#F3E7DD] bg-white p-6 shadow-sm">
        {renderStep()}
      </div>
    </section>
  );
}