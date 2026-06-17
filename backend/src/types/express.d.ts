import type { UserRole } from '@prisma/client';

export type AuthRole = UserRole;

declare global {
  namespace Express {
    interface AuthenticatedUser {
      userId: string;
      role: AuthRole;
      salonId: string | null;
    }

    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
