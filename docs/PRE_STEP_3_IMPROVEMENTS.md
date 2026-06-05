# 🛠️ MELHORIAS OBRIGATÓRIAS — PRÉ STEP 3

**Status**: CORREÇÕES A APLICAR AGORA  
**Data**: 5 de junho de 2026  
**Prioridade**: 🔴 CRÍTICO

---

## 1. Criar Estrutura de Erro Customizado

**Arquivo**: `src/shared/errors/AppError.ts`

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';

    // Captura stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} não encontrado`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}
```

---

## 2. Melhorar Middleware de Erro

**Arquivo**: `src/middlewares/errorHandler.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors/AppError';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      code: err.code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Erro desconhecido
  console.error('Unexpected error:', err);
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && {
      details: err.message,
      stack: err.stack,
    }),
  });
}
```

**Uso em app.ts**:
```typescript
import { errorHandler } from '@middlewares/errorHandler';

// ... depois de todas as rotas ...
app.use(errorHandler);
```

---

## 3. Adicionar Placeholder em Pastas Vazias

**Criar `src/shared/index.ts`**:
```typescript
// Re-exports do shared module
export * from './errors/AppError';
```

**Criar `src/middlewares/index.ts`**:
```typescript
// Middleware exports
export { errorHandler } from './errorHandler';
```

**Criar `src/providers/index.ts`**:
```typescript
// Providers (email, SMS, etc)
// Vazio por enquanto
```

**Criar `src/utils/index.ts`**:
```typescript
// Utility functions
// Vazio por enquanto
```

**Criar `src/types/index.ts`**:
```typescript
// Shared types
// Vazio por enquanto
```

**Criar `src/jobs/index.ts`**:
```typescript
// Scheduled jobs / Cron tasks
// Vazio por enquanto
```

**Criar `src/routes/index.ts`**:
```typescript
// Aggregated routes
import { Router } from 'express';

const router = Router();

// Será preenchido em Step 3
// import authRoutes from '@modules/auth/routes/auth.routes';
// router.use('/auth', authRoutes);

export default router;
```

---

## 4. Melhorar GET / (Rota Raiz)

**Atual em src/app.ts**:
```typescript
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    message: 'AgendaBeleza API v1',
    docs: '/docs',
    health: '/health',
  });
});
```

**Melhoria**:
```typescript
import { version } from '../package.json';

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    app: 'AgendaBeleza',
    version,
    environment: process.env.NODE_ENV,
    endpoints: {
      health: '/health',
      auth: '/auth/register, /auth/login',
      docs: '/docs (futuro)',
    },
    status: 'operational',
  });
});
```

---

## 5. Criar Validação de Env em Produção

**Melhorar src/config/env.ts**:
```typescript
export function validateEnv() {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars = requiredVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    throw new Error(
      `Variáveis de ambiente faltando: ${missingVars.join(', ')}`
    );
  }

  if (env.NODE_ENV === 'production') {
    if (env.JWT_SECRET === 'dev-secret-key-change-in-production') {
      throw new Error('JWT_SECRET usar o valor default em produção');
    }
    if (!process.env.DATABASE_URL?.includes('postgresql')) {
      throw new Error('DATABASE_URL deve ser PostgreSQL em produção');
    }
  }
}
```

---

## 6. Criar Health Check Robusto

**Arquivo**: `src/shared/health/health.service.ts`

```typescript
import { prisma } from '@config/prisma';

export class HealthService {
  async check() {
    const checks = {
      database: await this.checkDatabase(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };

    return checks;
  }

  private async checkDatabase() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', responseTime: 'ok' };
    } catch (err) {
      return { status: 'unhealthy', error: (err as Error).message };
    }
  }
}
```

---

## 7. Adicionar Helmet (Security Headers)

**Instalar**:
```bash
npm install helmet @types/helmet
```

**Usar em src/app.ts**:
```typescript
import helmet from 'helmet';

app.use(helmet());
```

---

## 8. Melhorar CORS para Produção

**Atual em src/app.ts**:
```typescript
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.API_URL : '*',
    credentials: true,
  })
);
```

**Melhoria**:
```typescript
const ALLOWED_ORIGINS = {
  development: '*',
  staging: process.env.FRONTEND_URL || 'http://localhost:3000',
  production: process.env.FRONTEND_URL || 'https://agenda-beleza.com',
};

app.use(
  cors({
    origin: ALLOWED_ORIGINS[process.env.NODE_ENV as 'development' | 'staging' | 'production'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

---

## ✅ Checklist de Aplicação

| Melhoria | Arquivo | Prioridade | Status |
|----------|---------|-----------|--------|
| AppError class | `src/shared/errors/AppError.ts` | 🔴 | ⏳ Criar |
| Error handler middleware | `src/middlewares/errorHandler.ts` | 🔴 | ⏳ Criar |
| Index files | `src/shared/index.ts`, etc | 🟡 | ⏳ Criar |
| Helmet security | `package.json` + app.ts | 🔴 | ⏳ Instalar |
| Health check robusto | `src/shared/health/health.service.ts` | 🟡 | ⏳ Criar |
| CORS whitelist | `src/app.ts` | 🔴 | ⏳ Melhorar |
| Validação env aprimorada | `src/config/env.ts` | 🟡 | ⏳ Melhorar |
| GET / melhorado | `src/app.ts` | 🟡 | ⏳ Melhorar |

---

## 📊 Depois de Aplicar

Estrutura final:
```
src/
├── shared/
│   ├── errors/
│   │   └── AppError.ts      ✅ NOVO
│   ├── health/
│   │   └── health.service.ts ✅ NOVO
│   └── index.ts             ✅ NOVO
├── middlewares/
│   ├── errorHandler.ts      ✅ NOVO
│   └── index.ts             ✅ NOVO
├── providers/
│   └── index.ts             ✅ NOVO
├── utils/
│   └── index.ts             ✅ NOVO
├── types/
│   └── index.ts             ✅ NOVO
├── jobs/
│   └── index.ts             ✅ NOVO
└── routes/
    └── index.ts             ✅ NOVO
```

---

## 🚀 Próximo Passo

Depois de aplicar essas melhorias:

**Step 3: Autenticação** estará pronto com:
- ✅ Error handling profissional
- ✅ Security headers
- ✅ Health check robusto
- ✅ Structure padronizada
- ✅ Env validation rigorosa

---

## 📝 Ordem de Aplicação

1. Criar `src/shared/errors/AppError.ts`
2. Criar `src/middlewares/errorHandler.ts`
3. Instalar `helmet`
4. Criar todos os `index.ts` em pastas vazias
5. Melhorar `src/app.ts` (Helmet, CORS, GET /)
6. Melhorar `src/config/env.ts` (validação)
7. Criar `src/shared/health/health.service.ts`
8. Testar: `npm run dev`

**Tempo estimado**: 30-45 minutos

---

**Depois dessas melhorias: ✅ PRONTO PARA STEP 3** 🚀
