import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Teste de Carga / Smoke Test (k6) - AgendaBeleza API
 * Valida o SLO de latÃªncia p95 < 200ms e taxa de erro < 1%
 * Como executar:
 *   k6 run backend/scripts/k6-smoke.js
 */
export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Ramp-up inicial (Smoke / Warm-up)
    { duration: '20s', target: 30 }, // Carga sustentada
    { duration: '10s', target: 0 },  // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // SLO: 95% das requisiÃ§Ãµes abaixo de 200ms
    http_req_failed: ['rate<0.01'],   // SLO: Taxa de falhas tÃ©cnicas menor que 1%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3333';
const SALON_SLUG = __ENV.SALON_SLUG || 'salao-das-flores';

export default function () {
  // 1. Verifica disponibilidade do Health Check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health status Ã© 200': (r) => r.status === 200,
    'health status ok': (r) => r.json('status') === 'ok',
  });

  // 2. Consulta o endpoint pÃºblico do salÃ£o (fluxo principal de leitura pÃºblica)
  const publicRes = http.get(`${BASE_URL}/public/${SALON_SLUG}`, {
    tags: { expected_response: 'true' },
  });
  check(publicRes, {
    'rota pÃºblica respondeu sem erro 5xx': (r) => r.status === 200 || r.status === 404,
  });

  sleep(0.5);
}