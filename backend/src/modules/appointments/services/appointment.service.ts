import { UserRole } from '@prisma/client';
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../../../shared/errors/AppError';
import {
  AppointmentListFilters,
  AppointmentRepository,
  AppointmentResponse,
} from '../repositories/appointment.repository';
import {
  ListAppointmentsInput,
  UpdateAppointmentStatusInput,
} from '../validations/appointment.validation';

type AuthenticatedUser = Express.AuthenticatedUser;

const FORTALEZA_TIME_ZONE = 'America/Fortaleza';
const FORTALEZA_UTC_OFFSET_HOURS = 3;

export class AppointmentService {
  private readonly appointmentRepository = new AppointmentRepository();

  async list(user: AuthenticatedUser, filters: ListAppointmentsInput): Promise<AppointmentResponse[]> {
    const salonId = this.getSalonId(user);
    const repositoryFilters = this.buildRepositoryFilters(filters);

    return this.appointmentRepository.findManyBySalon(salonId, repositoryFilters);
  }

  async listToday(user: AuthenticatedUser): Promise<AppointmentResponse[]> {
    const salonId = this.getSalonId(user);
    const today = this.getDateKeyInFortaleza(new Date());

    return this.appointmentRepository.findManyBySalon(salonId, {
      limit: 100,
      offset: 0,
      dateRange: this.getFortalezaDateRange(today),
    });
  }

  async getById(user: AuthenticatedUser, id: string): Promise<AppointmentResponse> {
    const salonId = this.getSalonId(user);
    const appointment = await this.appointmentRepository.findByIdAndSalon(id, salonId);

    if (!appointment) {
      throw new NotFoundError('Agendamento', 'APPOINTMENT_NOT_FOUND');
    }

    return appointment;
  }

  async updateStatus(
    user: AuthenticatedUser,
    id: string,
    data: UpdateAppointmentStatusInput
  ): Promise<AppointmentResponse> {
    const salonId = this.getSalonId(user);
    await this.getById(user, id);

    return this.appointmentRepository.updateStatusByIdAndSalon(id, salonId, data.status);
  }

  private getSalonId(user: AuthenticatedUser) {
    if (user.role === UserRole.PROFESSIONAL) {
      throw new ForbiddenError(
        'Profissional ainda não possui vínculo de usuário para acessar agendamentos',
        'APPOINTMENT_PROFESSIONAL_FORBIDDEN'
      );
    }

    if (!user.salonId) {
      throw new UnauthorizedError('Token não possui salão associado', 'AUTH_SALON_MISSING');
    }

    return user.salonId;
  }

  private buildRepositoryFilters(filters: ListAppointmentsInput): AppointmentListFilters {
    return {
      status: filters.status,
      professionalId: filters.professionalId,
      clientPhone: filters.clientPhone,
      limit: filters.limit,
      offset: filters.offset,
      dateRange: filters.date ? this.getFortalezaDateRange(this.getDateKeyInFortaleza(filters.date)) : undefined,
    };
  }

  private getDateKeyInFortaleza(value: string | Date) {
    if (typeof value === 'string') {
      const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

      if (dateOnlyMatch) {
        return value;
      }
    }

    const date = typeof value === 'string' ? new Date(value) : value;
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: FORTALEZA_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);

    const year = parts.find(part => part.type === 'year')?.value;
    const month = parts.find(part => part.type === 'month')?.value;
    const day = parts.find(part => part.type === 'day')?.value;

    return `${year}-${month}-${day}`;
  }

  private getFortalezaDateRange(dateKey: string) {
    const [year, month, day] = dateKey.split('-').map(Number);
    const start = new Date(Date.UTC(year, month - 1, day, FORTALEZA_UTC_OFFSET_HOURS));
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    return { start, end };
  }
}
