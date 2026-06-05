/**
 * Cliente Prisma centralizado
 * Garante uma única instância em desenvolvimento e produção
 * Evita problemas de conexão e sincronização
 * 
 * Padrão SaaS: Isolamento por salonId garantido aqui
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Desconectar do banco de dados
 * Use em testes e graceful shutdown
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

/**
 * Reconectar ao banco de dados
 * Use se necessário reconectar após erro
 */
export async function reconnectPrisma() {
  await disconnectPrisma();
  globalForPrisma.prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
  return globalForPrisma.prisma;
}
