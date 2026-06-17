import { Salon, UserRole } from '@prisma/client';
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from '../../../shared/errors/AppError';
import { UpdateSalonInput } from '../validations/salon.validation';
import { SalonRepository } from '../repositories/salon.repository';

type SafeSalon = Omit<Salon, 'ownerId'>;

type AuthenticatedUser = Express.AuthenticatedUser;

export class SalonService {
  private readonly salonRepository = new SalonRepository();

  async getMySalon(user: AuthenticatedUser): Promise<SafeSalon> {
    const salon = await this.getAccessibleSalon(user);
    return this.sanitizeSalon(salon);
  }

  async updateMySalon(user: AuthenticatedUser, data: UpdateSalonInput): Promise<SafeSalon> {
    const salon = await this.getAccessibleSalon(user);

    if (data.slug) {
      const existingSalon = await this.salonRepository.findBySlug(data.slug);

      if (existingSalon && existingSalon.id !== salon.id) {
        throw new ConflictError('Slug do salão já está em uso', 'SALON_SLUG_ALREADY_EXISTS');
      }
    }

    const updatedSalon =
      user.role === UserRole.SUPER_ADMIN
        ? await this.salonRepository.updateById(salon.id, data)
        : await this.salonRepository.updateByIdAndOwner(salon.id, user.userId, data);

    if (!updatedSalon) {
      throw new ForbiddenError('Você não tem permissão para atualizar este salão', 'SALON_OWNER_MISMATCH');
    }

    return this.sanitizeSalon(updatedSalon);
  }

  private async getAccessibleSalon(user: AuthenticatedUser) {
    if (!user.salonId) {
      throw new UnauthorizedError('Token não possui salão associado', 'AUTH_SALON_MISSING');
    }

    if (user.role === UserRole.PROFESSIONAL) {
      throw new ForbiddenError('Profissional não pode gerenciar dados do salão', 'ROLE_FORBIDDEN');
    }

    const salon =
      user.role === UserRole.SUPER_ADMIN
        ? await this.salonRepository.findById(user.salonId)
        : await this.salonRepository.findByIdAndOwner(user.salonId, user.userId);

    if (!salon) {
      throw new NotFoundError('Salão', 'SALON_NOT_FOUND');
    }

    return salon;
  }

  private sanitizeSalon(salon: Salon): SafeSalon {
    const { ownerId, ...safeSalon } = salon;
    return safeSalon;
  }
}
