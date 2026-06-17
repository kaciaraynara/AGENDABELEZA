import { Prisma } from '@prisma/client';
import { prisma } from '../../../config/prisma';
import { CreateServiceInput, UpdateServiceInput } from '../validations/service.validation';

export class ServiceRepository {
  async create(salonId: string, data: CreateServiceInput) {
    return prisma.service.create({
      data: {
        salonId,
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        durationMinutes: data.durationMinutes,
        active: data.active ?? true,
      },
    });
  }

  async findActiveByName(salonId: string, name: string) {
    return prisma.service.findFirst({
      where: {
        salonId,
        name,
        active: true,
        deletedAt: null,
      },
    });
  }

  async findManyBySalon(salonId: string) {
    return prisma.service.findMany({
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
    return prisma.service.findFirst({
      where: {
        id,
        salonId,
        deletedAt: null,
      },
    });
  }

  async updateByIdAndSalon(id: string, salonId: string, data: UpdateServiceInput) {
    return prisma.service.update({
      where: {
        id,
        salonId,
      },
      data,
    });
  }

  async softDeleteByIdAndSalon(id: string, salonId: string) {
    return prisma.service.update({
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

  async transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) {
    return prisma.$transaction(callback);
  }
}
