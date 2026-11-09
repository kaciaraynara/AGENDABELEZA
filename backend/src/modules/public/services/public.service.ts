import { Prisma } from '@prisma/client';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../../../shared/errors/AppError';
import { PublicRepository } from '../repositories/public.repository';
import { CreatePublicAppointmentInput } from '../validations/public-appointment.validation';

export class PublicService {
  private readonly publicRepository = new PublicRepository();

  async getSalon(slug: string) {
    return this.getSalonBySlug(slug);
  }

  async getServices(slug: string) {
    const salon = await this.getSalonBySlug(slug);
    return this.publicRepository.findServicesBySalonId(salon.id);
  }

  async getProfessionals(slug: string) {
    const salon = await this.getSalonBySlug(slug);
    return this.publicRepository.findProfessionalsBySalonId(salon.id);
  }

  async createAppointment(slug: string, data: CreatePublicAppointmentInput) {
    const salon = await this.getSalonBySlug(slug);

    const service = await this.publicRepository.findBookableServiceById(data.serviceId, salon.id);

    if (!service) {
      throw new NotFoundError('Serviço', 'PUBLIC_SERVICE_NOT_FOUND');
    }

    let professional = null;
    if (data.professionalId) {
      professional = await this.publicRepository.findBookableProfessionalById(
        data.professionalId,
        salon.id
      );

      if (!professional) {
        throw new NotFoundError('Profissional', 'PUBLIC_PROFESSIONAL_NOT_FOUND');
      }
    }

    if (professional) {
      const isLinked = await this.publicRepository.isProfessionalLinkedToService(
        professional.id,
        service.id
      );

      if (!isLinked) {
        throw new ValidationError(
          'Profissional não está vinculado ao serviço escolhido',
          'PUBLIC_PROFESSIONAL_SERVICE_NOT_LINKED'
        );
      }
    }

    // Nesta etapa validamos somente conflito exato de horário.
    // Sobreposição por duração entra em uma etapa futura de agenda/disponibilidade.
    if (professional) {
      const existingAppointment = await this.publicRepository.findAppointmentByProfessionalAndScheduledAt(
        professional.id,
        data.scheduledAt
      );

      if (existingAppointment) {
        throw new ConflictError(
          'Horário já ocupado para este profissional',
          'PUBLIC_APPOINTMENT_TIME_UNAVAILABLE'
        );
      }
    } else {
      // Se não há profissional específico, verificamos se o salão já tem agendamento genérico nesse horário
      const existingAppointment = await this.publicRepository.findAppointmentBySalonAndScheduledAtWithoutProfessional(
        salon.id,
        data.scheduledAt
      );

      if (existingAppointment) {
        throw new ConflictError(
          'Horário já ocupado no salão',
          'PUBLIC_APPOINTMENT_TIME_UNAVAILABLE'
        );
      }
    }

    try {
      return await this.publicRepository.createAppointmentWithClient(
        salon,
        service,
        professional,
        data
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError(
          'Horário já ocupado para este profissional',
          'PUBLIC_APPOINTMENT_TIME_UNAVAILABLE'
        );
      }

      throw error;
    }
  }

  private async getSalonBySlug(slug: string) {
    const normalizedSlug = slug.trim().toLowerCase();
    const salon = await this.publicRepository.findSalonBySlug(normalizedSlug);

    if (!salon) {
      throw new NotFoundError('Salão', 'PUBLIC_SALON_NOT_FOUND');
    }

    return salon;
  }
}
