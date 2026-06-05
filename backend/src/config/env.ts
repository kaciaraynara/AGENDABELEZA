/**
 * Configuração de variáveis de ambiente
 * Carrega e valida todas as variáveis necessárias
 */

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3333', 10),
  API_URL: process.env.API_URL || 'http://localhost:3333',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

/**
 * Validação rigorosa de ambiente
 * Executa na inicialização do servidor
 */
export function validateEnv() {
  // Variáveis obrigatórias
  const requiredVars = ['DATABASE_URL'];

  const missingVars = requiredVars.filter(
    v => !process.env[v] || process.env[v]?.trim() === ''
  );

  if (missingVars.length > 0) {
    throw new Error(
      `❌ Variáveis de ambiente obrigatórias faltando: ${missingVars.join(', ')}\n` +
      'Verifique arquivo .env'
    );
  }

  // Validações específicas por ambiente
  if (env.NODE_ENV === 'production') {
    // Em produção, JWT_SECRET não pode ser o default
    if (
      env.JWT_SECRET === 'dev-secret-key-change-in-production' ||
      !env.JWT_SECRET
    ) {
      throw new Error(
        '❌ JWT_SECRET não pode usar o valor default em PRODUÇÃO\n' +
        'Defina um JWT_SECRET seguro em .env'
      );
    }

    // DATABASE_URL deve ser PostgreSQL em produção
    if (!env.DATABASE_URL.includes('postgresql')) {
      throw new Error(
        '❌ Em PRODUÇÃO, DATABASE_URL deve ser PostgreSQL\n' +
        'URL atual não é PostgreSQL válida'
      );
    }

    // FRONTEND_URL deve estar definido em produção
    if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL === 'http://localhost:3000') {
      throw new Error(
        '❌ Em PRODUÇÃO, FRONTEND_URL deve ser definido\n' +
        'Defina o URL do frontend em produção'
      );
    }
  }

  // Validações gerais
  if (isNaN(env.PORT) || env.PORT < 1 || env.PORT > 65535) {
    throw new Error(`❌ PORT deve ser um número entre 1 e 65535 (recebido: ${env.PORT})`);
  }

  // Log de configuração (sem expor secrets)
  console.log('✓ Environment loaded:', {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    API_URL: env.API_URL,
    FRONTEND_URL: env.FRONTEND_URL,
    DATABASE_URL: env.DATABASE_URL.substring(0, 30) + '***',
    JWT_EXPIRES_IN: env.JWT_EXPIRES_IN,
  });
}
