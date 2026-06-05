/**
 * Middleware de tratamento de erros centralizado
 * Captura todos os erros e os formata conforme tipo
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Se for AppError customizado
  if (err instanceof AppError) {
    console.error(`[${err.name}] ${err.message}`, {
      statusCode: err.statusCode,
      code: err.code,
      path: req.path,
      method: req.method,
    });

    return res.status(err.statusCode).json({
      error: {
        name: err.name,
        message: err.message,
        code: err.code,
      },
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        request: {
          method: req.method,
          path: req.path,
          query: req.query,
        },
      }),
    });
  }

  // Se for erro Prisma
  if ((err as any).code?.startsWith('P')) {
    console.error('[PrismaError]', err.message);

    const prismaErrors: Record<string, { status: number; message: string }> = {
      P2025: { status: 404, message: 'Registro não encontrado' },
      P2002: { status: 409, message: 'Valor duplicado em campo único' },
      P2003: { status: 400, message: 'Relacionamento inválido' },
    };

    const errorInfo = prismaErrors[(err as any).code] || {
      status: 500,
      message: 'Erro no banco de dados',
    };

    return res.status(errorInfo.status).json({
      error: {
        name: 'DatabaseError',
        message: errorInfo.message,
        code: (err as any).code,
      },
      ...(process.env.NODE_ENV === 'development' && {
        details: (err as any).message,
      }),
    });
  }

  // Erro desconhecido
  console.error('[UnexpectedError]', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  return res.status(500).json({
    error: {
      name: 'InternalServerError',
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
    },
    ...(process.env.NODE_ENV === 'development' && {
      details: err.message,
      stack: err.stack,
    }),
  });
}
