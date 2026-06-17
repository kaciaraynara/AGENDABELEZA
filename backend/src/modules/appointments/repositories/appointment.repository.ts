import { AppointmentStatus, Prisma } from '@prisma/client';
import { prisma } from '../../../config/prisma';

const appointmentSelect = {
  id: true,
  scheduledAt: true,
  status: true,
  notes: true,
  timeZone: true,
  createdAt: true,
  updatedAt: true,
  client: {
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
    },
  },
  service: {
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      price: true,
      durationMinutes: true,
    },
  },
  professional: {
    select: {
      id: true,
      name: true,
      phone: true,
      bio: true,
    },
  },
  salon: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.AppointmentSelect;

export type AppointmentResponse = Prisma.AppointmentGetPayload<{
  select: typeof appointmentSelect;
}>;

export interface AppointmentListFilters {
  status?: AppointmentStatus;
  professionalId?: string;
  clientPhone?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  limit: number;
  offset: number;
}

export class AppointmentRepository {
  async findManyBySalon(salonId: string, filters: AppointmentListFilters) {
    const where: Prisma.AppointmentWhereInput = {
      salonId,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.professionalId ? { professionalId: filters.professionalId } : {}),
      ...(filters.clientPhone
        ? {
            client: {
              phone: filters.clientPhone,
            },
          }
        : {}),
      ...(filters.dateRange
        ? {
            scheduledAt: {
              gte: filters.dateRange.start,
              lt: filters.dateRange.end,
            },
          }
        : {}),
    };

    return prisma.appointment.findMany({
      where,
      select: appointmentSelect,
      orderBy: {
        scheduledAt: 'asc',
      },
      take: filters.limit,
      skip: filters.offset,
    });
  }

  async findByIdAndSalon(id: string, salonId: string) {
    return prisma.appointment.findFirst({
      where: {
        id,
        salonId,
      },
      select: appointmentSelect,
    });
  }

  async updateStatusByIdAndSalon(id: string, salonId: string, status: AppointmentStatus) {
    return prisma.appointment.update({
      where: {
        id,
        salonId,
      },
      data: {
        status,
      },
      select: appointmentSelect,
    });
  }
}
