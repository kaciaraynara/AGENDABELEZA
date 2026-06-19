import { Prisma, UserRole } from '@prisma/client';
import { prisma } from '../../../config/prisma';

interface CreateOwnerWithSalonData {
  user: {
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
  };
  salon: {
    name: string;
    slug: string;
    phone: string;
    email?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    businessHours?: string;
  };
}

export class AuthRepository {
  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { salon: true },
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { salon: true },
    });
  }

  async findSalonBySlug(slug: string) {
    return prisma.salon.findUnique({
      where: { slug },
    });
  }

  async createOwnerWithSalon(data: CreateOwnerWithSalonData) {
    const trialDays = Number(process.env.TRIAL_DAYS ?? 7);

    if (Number.isInteger(trialDays) === false || trialDays < 1) {
      throw new Error('TRIAL_DAYS deve ser um número inteiro maior que zero');
    }

    const trialEndsAt = new Date(
      Date.now() + trialDays * 24 * 60 * 60 * 1000,
    );

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: {
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          password: data.user.passwordHash,
          role: UserRole.OWNER,
        },
      });

      const salon = await tx.salon.create({
        data: {
          ownerId: user.id,
          name: data.salon.name,
          slug: data.salon.slug,
          phone: data.salon.phone,
          email: data.salon.email,
          description: data.salon.description,
          address: data.salon.address,
          city: data.salon.city,
          state: data.salon.state,
          zipCode: data.salon.zipCode,
          businessHours: data.salon.businessHours,
          trialEndsAt,
        },
      });

      return { user, salon };
    });
  }
}
