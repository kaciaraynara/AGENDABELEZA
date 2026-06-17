import { prisma } from '../../../config/prisma';

export class ProfessionalServicesRepository {
  async findProfessionalByIdAndSalon(professionalId: string, salonId: string) {
    return prisma.professional.findFirst({
      where: {
        id: professionalId,
        salonId,
        deletedAt: null,
      },
    });
  }

  async findServicesByIdsAndSalon(serviceIds: string[], salonId: string) {
    return prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        salonId,
        deletedAt: null,
      },
    });
  }

  async findLinkedServiceIds(professionalId: string) {
    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      select: {
        services: {
          select: { id: true },
        },
      },
    });

    return professional?.services.map(service => service.id) ?? [];
  }

  async linkServices(professionalId: string, serviceIds: string[]) {
    if (serviceIds.length === 0) {
      return this.findServicesForProfessional(professionalId);
    }

    const professional = await prisma.professional.update({
      where: { id: professionalId },
      data: {
        services: {
          connect: serviceIds.map(id => ({ id })),
        },
      },
      select: {
        services: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' },
        },
      },
    });

    return professional.services;
  }

  async findServicesForProfessional(professionalId: string) {
    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      select: {
        services: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' },
        },
      },
    });

    return professional?.services ?? [];
  }

  async unlinkService(professionalId: string, serviceId: string) {
    const professional = await prisma.professional.update({
      where: { id: professionalId },
      data: {
        services: {
          disconnect: { id: serviceId },
        },
      },
      select: {
        services: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' },
        },
      },
    });

    return professional.services;
  }
}
