import { prisma } from '../../../config/prisma';
import {
  CreateProfessionalInput,
  UpdateProfessionalInput,
} from '../validations/professional.validation';

export class ProfessionalRepository {
  async create(salonId: string, data: CreateProfessionalInput) {
    return prisma.professional.create({
      data: {
        salonId,
        name: data.name,
        phone: data.phone,
        bio: data.bio,
        active: data.active ?? true,
      },
    });
  }

  async findActiveByPhone(salonId: string, phone: string) {
    return prisma.professional.findFirst({
      where: {
        salonId,
        phone,
        active: true,
        deletedAt: null,
      },
    });
  }

  async findManyBySalon(salonId: string) {
    return prisma.professional.findMany({
      where: {
        salonId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByIdAndSalon(id: string, salonId: string) {
    return prisma.professional.findFirst({
      where: {
        id,
        salonId,
        deletedAt: null,
      },
    });
  }

  async updateByIdAndSalon(id: string, salonId: string, data: UpdateProfessionalInput) {
    return prisma.professional.update({
      where: {
        id,
        salonId,
      },
      data,
    });
  }

  async softDeleteByIdAndSalon(id: string, salonId: string) {
    return prisma.professional.update({
      where: {
        id,
        salonId,
      },
      data: {
        active: false,
        deletedAt: new Date(),
      },
    });
  }
}
