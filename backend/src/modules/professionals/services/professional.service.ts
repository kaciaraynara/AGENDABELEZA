import { Professional } from '@prisma/client';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../../shared/errors/AppError';
import { ProfessionalRepository } from '../repositories/professional.repository';
import {
  CreateProfessionalInput,
  UpdateProfessionalInput,
} from '../validations/professional.validation';

type AuthenticatedUser = Express.AuthenticatedUser;

export class ProfessionalService {
  private readonly professionalRepository = new ProfessionalRepository();

  async create(user: AuthenticatedUser, data: CreateProfessionalInput): Promise<Professional> {
    const salonId = this.getSalonId(user);
    await this.ensureNoActiveProfessionalWithPhone(salonId, data.phone);

    return this.professionalRepository.create(salonId, data);
  }

  async list(user: AuthenticatedUser): Promise<Professional[]> {
    const salonId = this.getSalonId(user);
    return this.professionalRepository.findManyBySalon(salonId);
  }

  async getById(user: AuthenticatedUser, id: string): Promise<Professional> {
    const salonId = this.getSalonId(user);
    const professional = await this.professionalRepository.findByIdAndSalon(id, salonId);

    if (!professional) {
      throw new NotFoundError('Profissional', 'PROFESSIONAL_NOT_FOUND');
    }

    return professional;
  }

  async update(user: AuthenticatedUser, id: string, data: UpdateProfessionalInput): Promise<Professional> {
    const salonId = this.getSalonId(user);
    const professional = await this.getById(user, id);

    if (data.phone && data.phone !== professional.phone) {
      await this.ensureNoActiveProfessionalWithPhone(salonId, data.phone, professional.id);
    }

    return this.professionalRepository.updateByIdAndSalon(id, salonId, data);
  }

  async softDelete(user: AuthenticatedUser, id: string): Promise<Professional> {
    const salonId = this.getSalonId(user);
    await this.getById(user, id);

    return this.professionalRepository.softDeleteByIdAndSalon(id, salonId);
  }

  private getSalonId(user: AuthenticatedUser) {
    if (!user.salonId) {
      throw new UnauthorizedError('Token não possui salão associado', 'AUTH_SALON_MISSING');
    }

    return user.salonId;
  }

  private async ensureNoActiveProfessionalWithPhone(
    salonId: string,
    phone: string,
    ignoreProfessionalId?: string
  ) {
    const existingProfessional = await this.professionalRepository.findActiveByPhone(salonId, phone);

    if (existingProfessional && existingProfessional.id !== ignoreProfessionalId) {
      throw new ConflictError('Profissional ativo com este telefone já existe no salão', 'PROFESSIONAL_PHONE_ALREADY_EXISTS');
    }
  }
}
