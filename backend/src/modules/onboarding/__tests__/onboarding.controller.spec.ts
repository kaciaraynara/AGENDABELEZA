/**
 * Testes de integração — GET /onboarding/status
 */

import request from 'supertest';
import app from '../../../app';
import { prisma } from '../../../config/prisma';
import { ownerToken, professionalToken } from '../../../__tests__/helpers/auth.helper';

const SUFFIX = `_onboarding_${Date.now()}`;

let ownerId: string;
let salonId: string;
let ownerAuthToken: string;
let professionalAuthToken: string;

beforeAll(async () => {
  const owner = await prisma.user.create({
    data: {
      email: `owner${SUFFIX}@onboarding.test`,
      name: 'Owner Onboarding Test',
      password: 'hashed',
      role: 'OWNER',
    },
  });
  ownerId = owner.id;

  const salon = await prisma.salon.create({
    data: {
      ownerId: owner.id,
      name: `Salão Onboarding${SUFFIX}`,
      slug: `salao-onboarding${SUFFIX}`,
      phone: '85999990088',
    },
  });
  salonId = salon.id;

  ownerAuthToken = ownerToken(ownerId, salonId);
  professionalAuthToken = professionalToken('prof-fake-id');
});

afterAll(async () => {
  await prisma.salon.deleteMany({ where: { id: salonId } });
  await prisma.user.deleteMany({ where: { id: ownerId } });
  await prisma.$disconnect();
});

describe('GET /onboarding/status', () => {
  it('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/onboarding/status');
    expect(res.status).toBe(401);
  });

  it('deve retornar 403 para PROFESSIONAL', async () => {
    const res = await request(app)
      .get('/onboarding/status')
      .set('Authorization', `Bearer ${professionalAuthToken}`);
    expect(res.status).toBe(403);
  });

  it('deve retornar 200 com status correto para OWNER', async () => {
    const res = await request(app)
      .get('/onboarding/status')
      .set('Authorization', `Bearer ${ownerAuthToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('hasSalonInfo');
    expect(res.body).toHaveProperty('hasServices');
    expect(res.body).toHaveProperty('hasProfessionals');
  });
});
