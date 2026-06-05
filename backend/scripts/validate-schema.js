#!/usr/bin/env node

/**
 * Script de validação do Prisma Schema
 * Executa: npx prisma validate
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

// Validações básicas
const errors = [];
const warnings = [];

try {
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // 1. Verificar estrutura básica
  if (!schema.includes('datasource db')) {
    errors.push('❌ Missing "datasource db" block');
  }
  if (!schema.includes('generator client')) {
    errors.push('❌ Missing "generator client" block');
  }

  // 2. Verificar modelos esperados
  const expectedModels = ['model User', 'model Salon', 'model Professional', 'model Service', 'model Client', 'model Appointment'];
  expectedModels.forEach(model => {
    if (!schema.includes(model)) {
      errors.push(`❌ Missing "${model}"`);
    }
  });

  // 3. Verificar enums
  const expectedEnums = ['enum UserRole', 'enum AppointmentStatus', 'enum ServiceCategory'];
  expectedEnums.forEach(enumDef => {
    if (!schema.includes(enumDef)) {
      errors.push(`❌ Missing "${enumDef}"`);
    }
  });

  // 4. Verificar provider correto
  if (!schema.includes('provider = "postgresql"')) {
    errors.push('❌ PostgreSQL provider not found');
  }
  if (!schema.includes('provider = "prisma-client-js"')) {
    warnings.push('⚠️  Generator should use "prisma-client-js"');
  }

  // Relatório
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║       Prisma Schema Validation Report                  ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📁 Schema: ${schemaPath}`);
  console.log(`📊 Size: ${(fs.statSync(schemaPath).size / 1024).toFixed(2)} KB`);
  console.log('');

  if (errors.length > 0) {
    console.log('❌ ERRORS:');
    errors.forEach(err => console.log(`   ${err}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach(warn => console.log(`   ${warn}`));
    console.log('');
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Your schema is valid. Ready to start using Prisma!');
    console.log('');
    process.exit(0);
  } else if (errors.length === 0) {
    console.log('✅ Schema is valid (with warnings)');
    console.log('');
    process.exit(0);
  } else {
    console.log('Schema has errors. Please fix them before proceeding.');
    console.log('');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error reading schema file:', error.message);
  process.exit(1);
}
