import { Service } from '@prisma/client';
import { NotFoundError, UnauthorizedError } from '../../../shared/errors/AppError';
import { ProfessionalServicesRepository } from '../repositories/professional-services.repository';
import { LinkProfessionalServicesInput } from '../validations/professional-services.validation';

type AuthenticatedUser = Express.AuthenticatedUser;

export class ProfessionalServicesService {
  private readonly professionalServicesRepository = new ProfessionalServicesRepository();

  async linkServices(
    user: AuthenticatedUser,
    professionalId: string,
    data: LinkProfessionalServicesInput
  ): Promise<Service[]> {
    const salonId = this.getSalonId(user);
    await this.ensureProfessionalBelongsToSalon(professionalId, salonId);

    const uniqueServiceIds = [...new Set(data.serviceIds)];
    await this.ensureServicesBelongToSalon(uniqueServiceIds, salonId);

    const linkedServiceIds = await this.professionalServicesRepository.findLinkedServiceIds(professionalId);
    const serviceIdsToConnect = uniqueServiceIds.filter(serviceId => !linkedServiceIds.includes(serviceId));

    return this.professionalServicesRepository.linkServices(professionalId, serviceIdsToConnect);
  }

  async listServices(user: AuthenticatedUser, professionalId: string): Promise<Service[]> {
    const salonId = this.getSalonId(user);
    await this.ensureProfessionalBelongsToSalon(professionalId, salonId);

    return this.professionalServicesRepository.findServicesForProfessional(professionalId);
  }

  async unlinkService(user: AuthenticatedUser, professionalId: string, serviceId: string): Promise<Service[]> {
    const salonId = this.getSalonId(user);
    await this.ensureProfessionalBelongsToSalon(professionalId, salonId);
    await this.ensureServicesBelongToSalon([serviceId], salonId);

    return this.professionalServicesRepository.unlinkService(professionalId, serviceId);
  }

  private getSalonId(user: AuthenticatedUser) {
    if (!user.salonId) {
      throw new UnauthorizedError('Token não possui salão associado', 'AUTH_SALON_MISSING');
    }

    return user.salonId;
  }

  private async ensureProfessionalBelongsToSalon(professionalId: string, salonId: string) {
    const professional = await this.professionalServicesRepository.findProfessionalByIdAndSalon(
      professionalId,
      salonId
    );

    if (!professional) {
      throw new NotFoundError('Profissional', 'PROFESSIONAL_NOT_FOUND');
    }
  }

  private async ensureServicesBelongToSalon(serviceIds: string[], salonId: string) {
    const services = await this.professionalServicesRepository.findServicesByIdsAndSalon(serviceIds, salonId);

    if (services.length !== serviceIds.length) {
      throw new NotFoundError('Serviço', 'SERVICE_NOT_FOUND');
    }
  }
}
