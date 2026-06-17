/**
 * Step 11 — Painel de Agendamentos do Salão
 * Testes de integração para o módulo de appointments
 *
 * Cenários obrigatórios:
 * 1. GET /appointments sem token → 401
 * 2. GET /appointments com OWNER → 200
 * 3. GET /appointments/today → 200
 * 4. GET /appointments/:id do próprio salão → 200
 * 5. GET /appointments/:id de outro salão → 404
 * 6. PATCH /appointments/:id/status com status válido → 200
 * 7. PATCH /appointments/:id/status com status inválido → 400
 * 8. PROFESSIONAL tentando acessar → 403
 * 9. Filtros funcionando
 * 10. Resposta não expõe dados sensíveis
 * 11. npm run build
 * 12. npx prisma migrate status
 */

import request from 'supertest';
import app from '../app';
import { ownerToken, professionalToken } from './helpers/auth.helper';
import { seedAppointmentData, cleanupAppointmentData, SeedData } from './helpers/db.helper';

// ─── Dados de teste (criados antes de todos os testes) ───────────────────────
let seed: SeedData;
let ownerAuthToken: string;
let professionalAuthToken: string;

beforeAll(async () => {
  seed = await seedAppointmentData();
  ownerAuthToken = ownerToken(seed.ownerId, seed.salonId);
  professionalAuthToken = professionalToken('professional-user-id-fake');
});

afterAll(async () => {
  await cleanupAppointmentData(seed);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function bearerHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ─── Conjunto de testes ───────────────────────────────────────────────────────

describe('Step 11 — Painel de Agendamentos', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // TEST 1: GET /appointments sem token → 401
  // ──────────────────────────────────────────────────────────────────────────
  describe('Test 1 — GET /appointments sem token', () => {
    it('deve retornar 401 quando não há token de autenticação', async () => {
      const res = await request(app).get('/appointments');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: GET /appointments com OWNER → 200
  // ──────────────────────────────────────────────────────────────────────────
  describe('Test 2 — GET /appointments com OWNER', () => {
    it('deve retornar 200 e lista de agendamentos para OWNER autenticado', async () => {
      const res = await request(app)
        .get('/appointments')
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('appointments');
      expect(Array.isArray(res.body.appointments)).toBe(true);
      expect(res.body).toHaveProperty('pagination');
    });

    it('deve retornar apenas agendamentos do próprio salão', async () => {
      const res = await request(app)
        .get('/appointments')
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      const ids = res.body.appointments.map((a: any) => a.id);
      expect(ids).toContain(seed.appointmentId);
      expect(ids).not.toContain(seed.otherAppointmentId);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 3: GET /appointments/today → 200
  // ──────────────────────────────────────────────────────────────────────────
  describe('Test 3 — GET /appointments/today', () => {
    it('deve retornar 200 com agendamentos de hoje', async () => {
      const res = await request(app)
        .get('/appointments/today')
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('appointments');
      expect(Array.isArray(res.body.appointments)).toBe(true);
    });

    it('deve retornar 401 sem token em /today', async () => {
      const res = await request(app).get('/appointments/today');

      expect(res.status).toBe(401);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 4: GET /appointments/:id do próprio salão → 200
  // ──────────────────────────────────────────────────────────────────────────
  describe('Test 4 — GET /appointments/:id do próprio salão', () => {
    it('deve retornar 200 com dados do agendamento do próprio salão', async () => {
      const res = await request(app)
        .get(`/appointments/${seed.appointmentId}`)
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('appointment');
      expect(res.body.appointment.id).toBe(seed.appointmentId);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 5: GET /appointments/:id de outro salão → 404
  // ──────────────────────────────────────────────────────────────────────────
  describe('Test 5 — GET /appointments/:id de outro salão', () => {
    it('deve retornar 404 ao tentar acessar agendamento de outro salão', async () => {
      const res = await request(app)
        .get(`/appointments/${seed.otherAppointmentId}`)
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 6: PATCH /appointments/:id/status com status válido → 200
  // ──────────────────────────────────────────────────────────────────────────
  describe('Test 6 — PATCH /appointments/:id/status com status válido', () => {
    const validStatuses = ['CONFIRMED', 'COMPLETED', 'CANCELED', 'NO_SHOW', 'PENDING'];

    validStatuses.forEach((status) => {
      it(`deve retornar 200 ao atualizar status para ${status}`, async () => {
        const res = await request(app)
          .patch(`/appointments/${seed.appointmentId}/status`)
          .set(bearerHeader(ownerAuthToken))
          .send({ status });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('appointment');
        expect(res.body.appointment.status).toBe(status);
      });
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 7: PATCH /appointments/:id/status com status inválido → 400
  // ──────────────────────────────────────────────────────────────────────────
  describe('Test 7 — PATCH /appointments/:id/status com status inválido', () => {
    const invalidStatuses = ['INVALID', 'DONE', 'OPEN', '', 'pending'];

    invalidStatuses.forEach((status) => {
      it(`deve retornar 400 para status inválido: "${status}"`, async () => {
        const res = await request(app)
          .patch(`/appointments/${seed.appointmentId}/status`)
          .set(bearerHeader(ownerAuthToken))
          .send({ status });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
      });
    });

    it('deve retornar 400 quando body está vazio', async () => {
      const res = await request(app)
        .patch(`/appointments/${seed.appointmentId}/status`)
        .set(bearerHeader(ownerAuthToken))
        .send({});

      expect(res.status).toBe(400);
    });

    it('deve retornar 400 quando body tem campos extras (strict)', async () => {
      const res = await request(app)
        .patch(`/appointments/${seed.appointmentId}/status`)
        .set(bearerHeader(ownerAuthToken))
        .send({ status: 'PENDING', extra: 'field' });

      expect(res.status).toBe(400);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 8: PROFESSIONAL tentando acessar → 403
  // ──────────────────────────────────────────────────────────────────────────
  describe('Test 8 — PROFESSIONAL tentando acessar', () => {
    it('deve retornar 403 quando PROFESSIONAL tenta acessar GET /appointments', async () => {
      const res = await request(app)
        .get('/appointments')
        .set(bearerHeader(professionalAuthToken));

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');
    });

    it('deve retornar 403 quando PROFESSIONAL tenta acessar GET /appointments/today', async () => {
      const res = await request(app)
        .get('/appointments/today')
        .set(bearerHeader(professionalAuthToken));

      expect(res.status).toBe(403);
    });

    it('deve retornar 403 quando PROFESSIONAL tenta acessar GET /appointments/:id', async () => {
      const res = await request(app)
        .get(`/appointments/${seed.appointmentId}`)
        .set(bearerHeader(professionalAuthToken));

      expect(res.status).toBe(403);
    });

    it('deve retornar 403 quando PROFESSIONAL tenta PATCH de status', async () => {
      const res = await request(app)
        .patch(`/appointments/${seed.appointmentId}/status`)
        .set(bearerHeader(professionalAuthToken))
        .send({ status: 'CONFIRMED' });

      expect(res.status).toBe(403);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 9: Filtros funcionando
  // ──────────────────────────────────────────────────────────────────────────
  describe('Test 9 — Filtros de GET /appointments', () => {
    it('deve filtrar por status=PENDING', async () => {
      const res = await request(app)
        .get('/appointments?status=PENDING')
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      res.body.appointments.forEach((a: any) => {
        expect(a.status).toBe('PENDING');
      });
    });

    it('deve filtrar por status=CONFIRMED (retorna lista vazia ou com CONFIRMED)', async () => {
      const res = await request(app)
        .get('/appointments?status=CONFIRMED')
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      res.body.appointments.forEach((a: any) => {
        expect(a.status).toBe('CONFIRMED');
      });
    });

    it('deve retornar 400 para status de filtro inválido', async () => {
      const res = await request(app)
        .get('/appointments?status=INVALID_STATUS')
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(400);
    });

    it('deve filtrar por professionalId', async () => {
      const res = await request(app)
        .get(`/appointments?professionalId=${seed.professionalId}`)
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.appointments)).toBe(true);
      if (res.body.appointments.length > 0) {
        res.body.appointments.forEach((a: any) => {
          expect(a.professional.id).toBe(seed.professionalId);
        });
      }
    });

    it('deve filtrar por clientPhone', async () => {
      const res = await request(app)
        .get('/appointments?clientPhone=85999990003')
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.appointments)).toBe(true);
    });

    it('deve filtrar por date (YYYY-MM-DD)', async () => {
      const today = new Date().toISOString().split('T')[0]; // ex: 2026-06-08
      const res = await request(app)
        .get(`/appointments?date=${today}`)
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.appointments)).toBe(true);
    });

    it('deve respeitar limit e offset', async () => {
      const res = await request(app)
        .get('/appointments?limit=1&offset=0')
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      expect(res.body.appointments.length).toBeLessThanOrEqual(1);
      expect(res.body.pagination.limit).toBe(1);
      expect(res.body.pagination.offset).toBe(0);
    });

    it('deve retornar 400 para limit inválido (> 100)', async () => {
      const res = await request(app)
        .get('/appointments?limit=200')
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(400);
    });

    it('deve retornar 400 para limit = 0', async () => {
      const res = await request(app)
        .get('/appointments?limit=0')
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(400);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 10: Resposta não expõe dados sensíveis
  // ──────────────────────────────────────────────────────────────────────────
  describe('Test 10 — Resposta não expõe dados sensíveis', () => {
    it('GET /appointments não deve expor password em nenhum campo', async () => {
      const res = await request(app)
        .get('/appointments')
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      const json = JSON.stringify(res.body);
      expect(json).not.toMatch(/password/i);
    });

    it('GET /appointments/:id não deve expor password', async () => {
      const res = await request(app)
        .get(`/appointments/${seed.appointmentId}`)
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      const json = JSON.stringify(res.body);
      expect(json).not.toMatch(/password/i);
    });

    it('GET /appointments/:id não deve expor ownerId ou informações do Owner', async () => {
      const res = await request(app)
        .get(`/appointments/${seed.appointmentId}`)
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);
      const appointment = res.body.appointment;

      // Verificar que o salon não expõe ownerId
      if (appointment.salon) {
        expect(appointment.salon).not.toHaveProperty('ownerId');
        expect(appointment.salon).not.toHaveProperty('owner');
      }
    });

    it('GET /appointments retorna campos esperados sem campos extras sensíveis', async () => {
      const res = await request(app)
        .get('/appointments')
        .set(bearerHeader(ownerAuthToken));

      expect(res.status).toBe(200);

      if (res.body.appointments.length > 0) {
        const appt = res.body.appointments[0];

        // Campos esperados
        expect(appt).toHaveProperty('id');
        expect(appt).toHaveProperty('scheduledAt');
        expect(appt).toHaveProperty('status');
        expect(appt).toHaveProperty('client');
        expect(appt).toHaveProperty('professional');
        expect(appt).toHaveProperty('service');

        // Campos NÃO esperados (dados sensíveis)
        expect(appt).not.toHaveProperty('password');
        expect(appt.client).not.toHaveProperty('password');
        expect(appt.professional).not.toHaveProperty('password');

        // Salon deve ter apenas campos básicos (sem ownerId)
        if (appt.salon) {
          expect(appt.salon).not.toHaveProperty('ownerId');
        }
      }
    });

    it('PATCH /appointments/:id/status não deve expor password na resposta', async () => {
      const res = await request(app)
        .patch(`/appointments/${seed.appointmentId}/status`)
        .set(bearerHeader(ownerAuthToken))
        .send({ status: 'PENDING' });

      expect(res.status).toBe(200);
      const json = JSON.stringify(res.body);
      expect(json).not.toMatch(/password/i);
    });
  });
});
