/**
 * Helper de banco de dados para testes de integração
 * Cria e limpa dados de seed de forma isolada por prefixo de teste
 */

import { PrismaClient, AppointmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({ log: ['error'] });

export interface SeedData {
  ownerId: string;
  salonId: string;
  professionalId: string;
  serviceId: string;
  clientId: string;
  appointmentId: string;
  // Segundo salão para testar isolamento
  otherOwnerId: string;
  otherSalonId: string;
  otherAppointmentId: string;
}

const SUFFIX = `_step11_${Date.now()}`;

/**
 * Cria dados completos no banco para rodar os testes do Step 11
 */
export async function seedAppointmentData(): Promise<SeedData> {
  const passwordHash = await bcrypt.hash('Test@12345', 10);

  // ─── Salão principal ────────────────────────────────────────────────────────
  const owner = await prisma.user.create({
    data: {
      email: `owner${SUFFIX}@step11.test`,
      name: 'Owner Step11',
      password: passwordHash,
      role: 'OWNER',
    },
  });

  const salon = await prisma.salon.create({
    data: {
      ownerId: owner.id,
      name: 'Salão Step11',
      slug: `salao-step11${SUFFIX}`,
      phone: '85999990001',
    },
  });

  const professional = await prisma.professional.create({
    data: {
      salonId: salon.id,
      name: 'Profissional Step11',
      phone: '85999990002',
    },
  });

  const service = await prisma.service.create({
    data: {
      salonId: salon.id,
      name: 'Corte Step11',
      price: 50,
      durationMinutes: 60,
      category: 'HAIRCUT',
    },
  });

  const client = await prisma.client.create({
    data: {
      salonId: salon.id,
      name: 'Cliente Step11',
      phone: '85999990003',
    },
  });

  const appointment = await prisma.appointment.create({
    data: {
      salonId: salon.id,
      clientId: client.id,
      professionalId: professional.id,
      serviceId: service.id,
      scheduledAt: new Date(Date.now() + 3600_000), // 1h no futuro
      status: AppointmentStatus.PENDING,
      timeZone: 'America/Fortaleza',
    },
  });

  // ─── Segundo salão (para testar isolamento) ─────────────────────────────────
  const otherOwner = await prisma.user.create({
    data: {
      email: `other${SUFFIX}@step11.test`,
      name: 'Other Owner Step11',
      password: passwordHash,
      role: 'OWNER',
    },
  });

  const otherSalon = await prisma.salon.create({
    data: {
      ownerId: otherOwner.id,
      name: 'Outro Salão Step11',
      slug: `outro-salao-step11${SUFFIX}`,
      phone: '85999990010',
    },
  });

  const otherProfessional = await prisma.professional.create({
    data: {
      salonId: otherSalon.id,
      name: 'Outro Profissional',
      phone: '85999990011',
    },
  });

  const otherService = await prisma.service.create({
    data: {
      salonId: otherSalon.id,
      name: 'Serviço Outro Salão',
      price: 80,
      durationMinutes: 45,
      category: 'NAILS',
    },
  });

  const otherClient = await prisma.client.create({
    data: {
      salonId: otherSalon.id,
      name: 'Outro Cliente',
      phone: '85999990012',
    },
  });

  const otherAppointment = await prisma.appointment.create({
    data: {
      salonId: otherSalon.id,
      clientId: otherClient.id,
      professionalId: otherProfessional.id,
      serviceId: otherService.id,
      scheduledAt: new Date(Date.now() + 7200_000), // 2h no futuro
      status: AppointmentStatus.PENDING,
      timeZone: 'America/Fortaleza',
    },
  });

  return {
    ownerId: owner.id,
    salonId: salon.id,
    professionalId: professional.id,
    serviceId: service.id,
    clientId: client.id,
    appointmentId: appointment.id,
    otherOwnerId: otherOwner.id,
    otherSalonId: otherSalon.id,
    otherAppointmentId: otherAppointment.id,
  };
}

/**
 * Remove todos os dados criados pelo seed de testes
 */
export async function cleanupAppointmentData(data: SeedData): Promise<void> {
  try {
    await prisma.appointment.deleteMany({
      where: { id: { in: [data.appointmentId, data.otherAppointmentId] } },
    });
    await prisma.client.deleteMany({
      where: { salonId: { in: [data.salonId, data.otherSalonId] } },
    });
    await prisma.professional.deleteMany({
      where: { salonId: { in: [data.salonId, data.otherSalonId] } },
    });
    await prisma.service.deleteMany({
      where: { salonId: { in: [data.salonId, data.otherSalonId] } },
    });
    await prisma.salon.deleteMany({
      where: { id: { in: [data.salonId, data.otherSalonId] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [data.ownerId, data.otherOwnerId] } },
    });
  } catch (err) {
    console.error('[cleanupAppointmentData] Erro ao limpar dados:', err);
  } finally {
    await prisma.$disconnect();
  }
}

export { prisma as testPrisma };
