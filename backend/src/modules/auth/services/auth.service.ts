import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Salon, User } from '@prisma/client';
import { env } from '../../../config/env';
import { ConflictError, UnauthorizedError } from '../../../shared/errors/AppError';
import { AuthRepository } from '../repositories/auth.repository';
import { LoginInput, RegisterInput } from '../validations/auth.validation';

type SafeUser = Omit<User, 'password'>;

interface AuthResponse {
  token: string;
  user: SafeUser;
  salon: Salon | null;
}

interface MeResponse {
  user: SafeUser;
  salon: Salon | null;
}

export class AuthService {
  private readonly authRepository = new AuthRepository();

  async register(data: RegisterInput): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ConflictError('E-mail já cadastrado', 'EMAIL_ALREADY_EXISTS');
    }

    const existingSalon = await this.authRepository.findSalonBySlug(data.salon.slug);

    if (existingSalon) {
      throw new ConflictError('Slug do salão já está em uso', 'SALON_SLUG_ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const { user, salon } = await this.authRepository.createOwnerWithSalon({
      user: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
      },
      salon: data.salon,
    });

    const token = this.generateToken(user, salon);

    return {
      token,
      user: this.sanitizeUser(user),
      salon,
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await this.authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError('E-mail ou senha inválidos', 'INVALID_CREDENTIALS');
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedError('E-mail ou senha inválidos', 'INVALID_CREDENTIALS');
    }

    const token = this.generateToken(user, user.salon);

    return {
      token,
      user: this.sanitizeUser(user),
      salon: user.salon,
    };
  }

  async me(userId: string): Promise<MeResponse> {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new UnauthorizedError('Usuário do token não encontrado', 'AUTH_USER_NOT_FOUND');
    }

    return {
      user: this.sanitizeUser(user),
      salon: user.salon,
    };
  }

  private generateToken(user: User, salon: Salon | null) {
    const payload = {
      sub: user.id,
      role: user.role,
      salonId: salon?.id ?? null,
    };

    const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, env.JWT_SECRET, options);
  }

  private sanitizeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
