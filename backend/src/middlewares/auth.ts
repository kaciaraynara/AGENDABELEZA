import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { env } from '../config/env';
import { ForbiddenError, UnauthorizedError } from '../shared/errors/AppError';
import type { AuthRole } from '../types/express';

interface AuthTokenPayload extends JwtPayload {
  sub?: string;
  role?: AuthRole;
  salonId?: string | null;
}

const VALID_ROLES = new Set<string>(Object.values(UserRole));

function getBearerToken(authorizationHeader?: string) {
  if (!authorizationHeader) {
    throw new UnauthorizedError('Token de autenticação não informado', 'AUTH_TOKEN_MISSING');
  }

  const [scheme, token, ...extraParts] = authorizationHeader.trim().split(/\s+/);

  if (scheme !== 'Bearer' || !token || extraParts.length > 0) {
    throw new UnauthorizedError('Formato de token inválido', 'AUTH_TOKEN_INVALID_FORMAT');
  }

  return token;
}

function normalizePayload(decoded: string | JwtPayload): Express.AuthenticatedUser {
  if (typeof decoded === 'string') {
    throw new UnauthorizedError('Token inválido', 'AUTH_TOKEN_INVALID');
  }

  const payload = decoded as AuthTokenPayload;

  if (!payload.sub || !payload.role || !VALID_ROLES.has(payload.role)) {
    throw new UnauthorizedError('Token inválido', 'AUTH_TOKEN_INVALID');
  }

  return {
    userId: payload.sub,
    role: payload.role,
    salonId: typeof payload.salonId === 'string' ? payload.salonId : null,
  };
}

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getBearerToken(req.headers.authorization);
    const decoded = jwt.verify(token, env.JWT_SECRET);

    req.user = normalizePayload(decoded);

    return next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return next(error);
    }

    if (error instanceof TokenExpiredError) {
      return next(new UnauthorizedError('Token expirado', 'AUTH_TOKEN_EXPIRED'));
    }

    if (error instanceof JsonWebTokenError) {
      return next(new UnauthorizedError('Token inválido', 'AUTH_TOKEN_INVALID'));
    }

    return next(error);
  }
}

export function authorize(allowedRoles: AuthRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Usuário não autenticado', 'AUTH_USER_MISSING'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Perfil sem permissão para acessar este recurso', 'ROLE_FORBIDDEN'));
    }

    return next();
  };
}
