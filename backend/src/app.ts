/**
 * AplicaÃ§Ã£o Express - ConfiguraÃ§Ã£o principal
 * Middlewares, observabilidade (Pino + Prometheus), rotas e tratamento de erros
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import client from 'prom-client';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

const app: Express = express();

// ============================================================================
// OBSERVABILIDADE (M3): Logs Estruturados (Pino) e MÃ©tricas (Prometheus)
// ============================================================================

export const logger = pino({
  level: process.env.NODE_ENV === 'test' ? 'silent' : (process.env.LOG_LEVEL || 'info'),
  base: { service: 'agenda-beleza-api' },
});

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'DuraÃ§Ã£o das requisiÃ§Ãµes HTTP em milissegundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [5, 10, 25, 50, 100, 200, 500, 1000],
  registers: [register],
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const routeLabel = req.route?.path || req.path;
    httpRequestDurationMs
      .labels(req.method, routeLabel, String(res.statusCode))
      .observe(durationMs);

    logger.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
    }, 'HTTP request processed');
  });
  next();
});

// ============================================================================
// SEGURANÃ‡A
// ============================================================================

app.use(helmet());

// ============================================================================
// CORS - ConfiguraÃ§Ã£o por ambiente
// ============================================================================

const ALLOWED_ORIGINS = {
  development: '*',
  staging: process.env.FRONTEND_URL || 'http://localhost:3000',
  production: process.env.FRONTEND_URL || 'https://agenda-beleza.com',
};

const currentEnv = (process.env.NODE_ENV || 'development') as 'development' | 'staging' | 'production';

app.use(
  cors({
    origin: ALLOWED_ORIGINS[currentEnv] || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);

// ============================================================================
// PARSERS
// ============================================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================================================
// ROTAS DE SISTEMA, HEALTH E MÃ‰TRICAS
// ============================================================================

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    app: 'AgendaBeleza API',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    status: 'operational',
    endpoints: {
      health: 'GET /health',
      metrics: 'GET /metrics',
      auth: 'POST /auth/register, POST /auth/login, GET /auth/me',
      appointments: 'GET /appointments, GET /appointments/today, GET /appointments/:id, PATCH /appointments/:id/status',
      salon: 'GET /salon/me, PUT /salon/me',
      services: 'POST /services, GET /services, GET /services/:id, PUT /services/:id, DELETE /services/:id',
      professionals: 'POST /professionals, GET /professionals, GET /professionals/:id, PUT /professionals/:id, DELETE /professionals/:id',
      professionalServices: 'POST /professionals/:professionalId/services, GET /professionals/:professionalId/services, DELETE /professionals/:professionalId/services/:serviceId',
      public: 'GET /public/:slug, GET /public/:slug/services, GET /public/:slug/professionals, POST /public/:slug/appointments',
      docs: 'docs/openapi.yaml',
    },
  });
});

app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'ok',
    app: 'AgendaBeleza API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

app.get('/metrics', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', register.contentType);
  return res.status(200).send(await register.metrics());
});

// ============================================================================
// ROTAS DE DOMÃNIO
// ============================================================================

app.use(routes);

// ============================================================================
// TRATAMENTO DE ROTAS NÃƒO ENCONTRADAS (404)
// ============================================================================

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    error: {
      name: 'NotFound',
      message: `Rota ${req.method} ${req.path} nÃ£o encontrada`,
      code: 'ROUTE_NOT_FOUND',
    },
    path: req.path,
  });
});

// ============================================================================
// MIDDLEWARE DE ERRO GLOBAL
// ============================================================================

app.use(errorHandler);

export { app };
export default app;