import { Service } from '@prisma/client';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../../shared/errors/AppError';
import { CreateServiceInput, UpdateServiceInput } from '../validations/service.validation';
import { ServiceRepository } from '../repositories/service.repository';

type AuthenticatedUser = Express.AuthenticatedUser;

export class ServiceService {
  private readonly serviceRepository = new ServiceRepository();

  async create(user: AuthenticatedUser, data: CreateServiceInput): Promise<Service> {
    const salonId = this.getSalonId(user);
    await this.ensureNoActiveServiceWithName(salonId, data.name);

    return this.serviceRepository.create(salonId, data);
  }

  async list(user: AuthenticatedUser): Promise<Service[]> {
    const salonId = this.getSalonId(user);
    return this.serviceRepository.findManyBySalon(salonId);
  }

  async getById(user: AuthenticatedUser, id: string): Promise<Service> {
    const salonId = this.getSalonId(user);
    const service = await this.serviceRepository.findByIdAndSalon(id, salonId);

    if (!service) {
      throw new NotFoundError('Serviço', 'SERVICE_NOT_FOUND');
    }

    return service;
  }

  async update(user: AuthenticatedUser, id: string, data: UpdateServiceInput): Promise<Service> {
    const salonId = this.getSalonId(user);
    const service = await this.getById(user, id);

    if (data.name && data.name !== service.name) {
      await this.ensureNoActiveServiceWithName(salonId, data.name, service.id);
    }

    return this.serviceRepository.updateByIdAndSalon(id, salonId, data);
  }

  async softDelete(user: AuthenticatedUser, id: string): Promise<Service> {
    const salonId = this.getSalonId(user);
    await this.getById(user, id);

    return this.serviceRepository.softDeleteByIdAndSalon(id, salonId);
  }

  private getSalonId(user: AuthenticatedUser) {
    if (!user.salonId) {
      throw new UnauthorizedError('Token não possui salão associado', 'AUTH_SALON_MISSING');
    }

    return user.salonId;
  }

  private async ensureNoActiveServiceWithName(salonId: string, name: string, ignoreServiceId?: string) {
    const existingService = await this.serviceRepository.findActiveByName(salonId, name);

    if (existingService && existingService.id !== ignoreServiceId) {
      throw new ConflictError('Serviço ativo com este nome já existe no salão', 'SERVICE_NAME_ALREADY_EXISTS');
    }
  }
}
