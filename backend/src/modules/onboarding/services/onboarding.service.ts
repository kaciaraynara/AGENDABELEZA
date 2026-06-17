import { PrismaClient } from '@prisma/client';
import { OnboardingStatusDto } from '../types/onboarding.type';

const prisma = new PrismaClient();

/**
 * Determines which onboarding steps are completed for a given salon.
 * The logic follows the rules approved by the user.
 */
export const getOnboardingStatus = async (salonId: string): Promise<OnboardingStatusDto> => {
  // Fetch salon information
  const salon = await prisma.salon.findUnique({
    where: { id: salonId },
    select: { name: true, phone: true, city: true, state: true, description: true, slug: true },
  });

  const hasSalonInfo = Boolean(
    salon?.name && salon?.phone && salon?.city && salon?.state && salon?.description,
  );

  const serviceCount = await prisma.service.count({ where: { salonId } });
  const hasServices = serviceCount > 0;

  const professionalCount = await prisma.professional.count({ where: { salonId } });
  const hasProfessionals = professionalCount > 0;

  // If a slug exists we consider the public link ready (slug is used to build the public URL)
  const hasPublicLink = Boolean(salon?.slug);

  const completedSteps =
    Number(hasSalonInfo) + Number(hasServices) + Number(hasProfessionals) + Number(hasPublicLink);

  let nextStep: OnboardingStatusDto['nextStep'];
  if (!hasSalonInfo) nextStep = 'salon';
  else if (!hasServices) nextStep = 'services';
  else if (!hasProfessionals) nextStep = 'professionals';
  else if (!hasPublicLink) nextStep = 'publicLink';
  else nextStep = 'finish';

  return {
    hasSalonInfo,
    hasServices,
    hasProfessionals,
    hasPublicLink,
    completedSteps,
    nextStep,
  };
};
