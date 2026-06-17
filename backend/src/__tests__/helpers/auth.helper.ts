/**
 * Helpers para geração de tokens JWT nos testes
 */

import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

export interface TokenPayload {
  userId: string;
  role: UserRole;
  salonId: string | null;
}

/**
 * Gera um token JWT de teste para o usuário informado
 */
export function generateTestToken(payload: TokenPayload): string {
  return jwt.sign(
    {
      sub: payload.userId,
      role: payload.role,
      salonId: payload.salonId,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

/**
 * Token de OWNER com salonId
 */
export function ownerToken(userId: string, salonId: string): string {
  return generateTestToken({ userId, role: UserRole.OWNER, salonId });
}

/**
 * Token de PROFESSIONAL sem salonId (sem vínculo User-Professional)
 */
export function professionalToken(userId: string): string {
  return generateTestToken({ userId, role: UserRole.PROFESSIONAL, salonId: null });
}

/**
 * Token de SUPER_ADMIN
 */
export function superAdminToken(userId: string, salonId: string | null = null): string {
  return generateTestToken({ userId, role: UserRole.SUPER_ADMIN, salonId });
}
