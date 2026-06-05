/**
 * Classe base para erros da aplicação
 * Padroniza tratamento de erros com tipos e status codes
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    // Captura stack trace corretamente
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Erro de validação (400)
 */
export class ValidationError extends AppError {
  constructor(message: string, code = 'VALIDATION_ERROR') {
    super(message, 400, code);
    this.name = 'ValidationError';
  }
}

/**
 * Recurso não encontrado (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string, code = 'NOT_FOUND') {
    super(`${resource} não encontrado`, 404, code);
    this.name = 'NotFoundError';
  }
}

/**
 * Não autorizado (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado', code = 'UNAUTHORIZED') {
    super(message, 401, code);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Proibido (403)
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Acesso proibido', code = 'FORBIDDEN') {
    super(message, 403, code);
    this.name = 'ForbiddenError';
  }
}

/**
 * Conflito (409)
 */
export class ConflictError extends AppError {
  constructor(message: string, code = 'CONFLICT') {
    super(message, 409, code);
    this.name = 'ConflictError';
  }
}

/**
 * Erro interno (500)
 */
export class InternalServerError extends AppError {
  constructor(message = 'Erro interno do servidor', code = 'INTERNAL_ERROR') {
    super(message, 500, code, false);
    this.name = 'InternalServerError';
  }
}
