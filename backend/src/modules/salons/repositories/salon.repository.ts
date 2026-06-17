import { Prisma } from '@prisma/client';
import { prisma } from '../../../config/prisma';
import { UpdateSalonInput } from '../validations/salon.validation';

export class SalonRepository {
  async findById(id: string) {
    return prisma.salon.findUnique({
      where: { id },
    });
  }

  async findByIdAndOwner(id: string, ownerId: string) {
    return prisma.salon.findFirst({
      where: { id, ownerId },
    });
  }

  async findBySlug(slug: string) {
    return prisma.salon.findUnique({
      where: { slug },
    });
  }

  async updateByIdAndOwner(id: string, ownerId: string, data: UpdateSalonInput) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const salon = await tx.salon.findFirst({
        where: { id, ownerId },
      });

      if (!salon) {
        return null;
      }

      return tx.salon.update({
        where: { id },
        data,
      });
    });
  }

  async updateById(id: string, data: UpdateSalonInput) {
    return prisma.salon.update({
      where: { id },
      data,
    });
  }
}
