import { AppointmentStatus, Prisma } from '@prisma/client';
import { prisma } from '../../../config/prisma';
import { CreatePublicAppointmentInput } from '../validations/public-appointment.validation';

const publicSalonSelect = {
  id: true,
  name: true,
  slug: true,
  phone: true,
  email: true,
  description: true,
  address: true,
  city: true,
  state: true,
  businessHours: true,
} satisfies Prisma.SalonSelect;

const publicServiceSelect = {
  id: true,
  name: true,
  description: true,
  category: true,
  price: true,
  durationMinutes: true,
} satisfies Prisma.ServiceSelect;

const publicProfessionalSelect = {
  id: true,
  name: true,
  bio: true,
} satisfies Prisma.ProfessionalSelect;

const publicClientSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
} satisfies Prisma.ClientSelect;

const publicAppointmentSelect = {
  id: true,
  scheduledAt: true,
  status: true,
  notes: true,
  createdAt: true,
} satisfies Prisma.AppointmentSelect;

type PublicSalon = Prisma.SalonGetPayload<{ select: typeof publicSalonSelect }>;
type PublicService = Prisma.ServiceGetPayload<{ select: typeof publicServiceSelect }>;
type PublicProfessional = Prisma.ProfessionalGetPayload<{ select: typeof publicProfessionalSelect }>;

export class PublicRepository {
  async findSalonBySlug(slug: string) {
    return prisma.salon.findUnique({
      where: { slug },
      select: publicSalonSelect,
    });
  }

  async findServicesBySalonId(salonId: string) {
    return prisma.service.findMany({
      where: {
        salonId,
        active: true,
        deletedAt: null,
      },
      select: publicServiceSelect,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findProfessionalsBySalonId(salonId: string) {
    return prisma.professional.findMany({
      where: {
        salonId,
        active: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        services: {
          where: {
            active: true,
            deletedAt: null,
          },
          select: publicServiceSelect,
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findBookableServiceById(serviceId: string, salonId: string) {
    return prisma.service.findFirst({
      where: {
        id: serviceId,
        salonId,
        active: true,
        deletedAt: null,
      },
      select: publicServiceSelect,
    });
  }

  async findBookableProfessionalById(professionalId: string, salonId: string) {
    return prisma.professional.findFirst({
      where: {
        id: professionalId,
        salonId,
        active: true,
        deletedAt: null,
      },
      select: publicProfessionalSelect,
    });
  }

  async isProfessionalLinkedToService(professionalId: string, serviceId: string) {
    const professional = await prisma.professional.findFirst({
      where: {
        id: professionalId,
        services: {
          some: {
            id: serviceId,
            active: true,
            deletedAt: null,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return Boolean(professional);
  }

  async findAppointmentByProfessionalAndScheduledAt(professionalId: string, scheduledAt: Date) {
    return prisma.appointment.findUnique({
      where: {
        professionalId_scheduledAt: {
          professionalId,
          scheduledAt,
        },
      },
      select: {
        id: true,
      },
    });
  }

  async createAppointmentWithClient(
    salon: PublicSalon,
    service: PublicService,
    professional: PublicProfessional,
    data: CreatePublicAppointmentInput
  ) {
    return prisma.$transaction(async tx => {
      const client = await tx.client.upsert({
        where: {
          salonId_phone: {
            salonId: salon.id,
            phone: data.clientPhone,
          },
        },
        update: {},
        create: {
          salonId: salon.id,
          name: data.clientName,
          phone: data.clientPhone,
          email: data.clientEmail,
        },
        select: publicClientSelect,
      });

      const appointment = await tx.appointment.create({
        data: {
          salonId: salon.id,
          clientId: client.id,
          professionalId: professional.id,
          serviceId: service.id,
          scheduledAt: data.scheduledAt,
          status: AppointmentStatus.PENDING,
          notes: data.notes,
        },
        select: publicAppointmentSelect,
      });

      return {
        appointment,
        client,
        service,
        professional,
        salon,
      };
    });
  }
}
