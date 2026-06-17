/**
 * Setup de ambiente para testes de integração
 * Carrega variáveis de ambiente antes de qualquer teste
 */

import 'dotenv/config';

// Garantir que NODE_ENV seja 'test' nos testes
process.env.NODE_ENV = 'test';
