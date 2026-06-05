/**
 * Inicialização do servidor Express
 * Carrega ambiente, inicia servidor e registra logs
 */

import 'dotenv/config';
import app from './app';
import { env, validateEnv } from './config/env';
import { disconnectPrisma } from './config/prisma';

// Validar variáveis de ambiente
try {
  validateEnv();
} catch (error) {
  console.error('❌ Environment validation failed:', error instanceof Error ? error.message : error);
  process.exit(1);
}

const port = env.PORT;

const server = app.listen(port, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║          🚀 AgendaBeleza API - Servidor Iniciado           ║');
  console.log('║                                                            ║');
  console.log(`║  ✓ Servidor:     http://localhost:${port}`);
  console.log(`║  ✓ Ambiente:     ${env.NODE_ENV.toUpperCase()}`);
  console.log('║  ✓ Health:       GET /health');
  console.log('║  ✓ API Root:     GET /');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

async function gracefulShutdown(signal: string) {
  console.log(`\n⚠️  ${signal} recebido, encerrando servidor...`);
  
  server.close(async () => {
    console.log('✓ HTTP server fechado');
    
    try {
      await disconnectPrisma();
      console.log('✓ Prisma desconectado');
    } catch (error) {
      console.error('❌ Erro ao desconectar Prisma:', error);
    }
    
    console.log('✓ Servidor encerrado com sucesso');
    process.exit(0);
  });

  // Force shutdown se houver timeout
  setTimeout(() => {
    console.error('❌ Shutdown timeout - forçando encerramento');
    process.exit(1);
  }, 30000); // 30 segundos
}

// Handlers de sinal
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ============================================================================
// ERROR HANDLERS
// ============================================================================

// Erro não capturado em Promise
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('❌ Unhandled Rejection:', {
    reason: reason instanceof Error ? reason.message : reason,
  });
});

// Exceção não capturada
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

export default server;
