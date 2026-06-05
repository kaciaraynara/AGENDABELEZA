/**
 * Aplicação Express - Configuração principal
 * Middlewares, rotas e tratamento de erros
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();

// ============================================================================
// SEGURANÇA
// ============================================================================

// Helmet para security headers
app.use(helmet());

// ============================================================================
// CORS - Configuração por ambiente
// ============================================================================

const ALLOWED_ORIGINS = {
  development: '*',
  staging: process.env.FRONTEND_URL || 'http://localhost:3000',
  production: process.env.FRONTEND_URL || 'https://agenda-beleza.com',
};

const currentEnv = (process.env.NODE_ENV || 'development') as 'development' | 'staging' | 'production';

app.use(
  cors({
    origin: ALLOWED_ORIGINS[currentEnv],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
  })
);

// ============================================================================
// PARSERS
// ============================================================================

// JSON Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================================================
// ROTAS
// ============================================================================

// Rota raiz com informações da API
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    app: 'AgendaBeleza API',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    status: 'operational',
    endpoints: {
      health: 'GET /health',
      auth: 'POST /auth/register, POST /auth/login',
      docs: 'GET /docs (futuro)',
    },
  });
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'ok',
    app: 'AgendaBeleza API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// ============================================================================
// TRATAMENTO DE ROTAS NÃO ENCONTRADAS
// ============================================================================

// 404 - Rota não encontrada
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    error: {
      name: 'NotFound',
      message: `Rota ${req.method} ${req.path} não encontrada`,
      code: 'ROUTE_NOT_FOUND',
    },
    path: req.path,
  });
});

// ============================================================================
// MIDDLEWARE DE ERRO GLOBAL (deve ser o último)
// ============================================================================

app.use(errorHandler);

export default app;
