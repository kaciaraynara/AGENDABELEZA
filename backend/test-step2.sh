#!/bin/bash
# ============================================================================
# STEP 2 - TESTES: Configuração do Prisma e Banco de Dados
# ============================================================================
# 
# Este script contém os comandos exatos para testar Step 2
# Execute cada comando um de cada vez e verifique o resultado
#
# ============================================================================

echo "🔧 STEP 2: Configuração do Prisma e Banco de Dados"
echo "=================================================="
echo ""

# Pré-requisitos
echo "✓ Pré-requisitos:"
echo "  - PostgreSQL rodando"
echo "  - DATABASE_URL configurado em .env"
echo "  - Node.js >= 18"
echo ""

# TEST 1: Validar Schema
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1️⃣: Validar Schema Prisma"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Comando:"
echo "  npx prisma validate"
echo ""
echo "Esperado:"
echo "  ✓ Your schema is valid. Ready to start using Prisma!"
echo ""
echo "Execução:"
npx prisma validate
RESULT1=$?
echo ""

# TEST 2: Gerar Cliente Prisma
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2️⃣: Gerar Cliente Prisma"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Comando:"
echo "  npx prisma generate"
echo ""
echo "Esperado:"
echo "  ✓ Generated Prisma Client to ./generated/prisma in XXXms"
echo ""
echo "Execução:"
npx prisma generate
RESULT2=$?
echo ""

# TEST 3: Listar arquivos gerados
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 3️⃣: Verificar Arquivos Gerados"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Comando:"
echo "  ls -la generated/prisma/ | head -10"
echo ""
echo "Esperado:"
echo "  - index.d.ts"
echo "  - index.js"
echo "  - schema.prisma"
echo "  - Outros tipos TypeScript"
echo ""
echo "Execução:"
ls -la generated/prisma/ 2>/dev/null | head -10 || echo "❌ Pasta não encontrada"
echo ""

# TEST 4: Criar Migração Inicial
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 4️⃣: Criar Migração Inicial"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Comando:"
echo "  npx prisma migrate dev --name initial"
echo ""
echo "Passos interativos:"
echo "  1. Pressione Enter para confirmar a criação da migração"
echo "  2. Será criado arquivo em prisma/migrations/"
echo "  3. A migração será executada no banco PostgreSQL"
echo "  4. Prisma Client será regenerado"
echo ""
echo "Esperado:"
echo "  ✓ Your database has been created with the initial schema."
echo "  ✓ Prisma Client generated"
echo ""
echo "Execução:"
npx prisma migrate dev --name initial
RESULT4=$?
echo ""

# TEST 5: Verificar Tabelas Criadas
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 5️⃣: Verificar Migrações Criadas"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Comando:"
echo "  ls -la prisma/migrations/"
echo ""
echo "Esperado:"
echo "  - Pasta com timestamp (ex: 20260605_initial/)"
echo "  - Arquivo migration.sql com SQL de criação"
echo ""
echo "Execução:"
ls -la prisma/migrations/ 2>/dev/null || echo "❌ Pasta não encontrada"
echo ""

# TEST 6: Listar Migrations no Banco
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 6️⃣: Verificar Status das Migrações"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Comando:"
echo "  npx prisma migrate status"
echo ""
echo "Esperado:"
echo "  Migration Status: All migrations have been applied"
echo ""
echo "Execução:"
npx prisma migrate status
RESULT6=$?
echo ""

# Resumo Final
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMO DOS TESTES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✓ Teste 1 (Validar Schema): $([ $RESULT1 -eq 0 ] && echo '✅ PASSOU' || echo '❌ FALHOU')"
echo "✓ Teste 2 (Gerar Cliente): $([ $RESULT2 -eq 0 ] && echo '✅ PASSOU' || echo '❌ FALHOU')"
echo "✓ Teste 4 (Migração):      $([ $RESULT4 -eq 0 ] && echo '✅ PASSOU' || echo '❌ FALHOU')"
echo "✓ Teste 6 (Status):        $([ $RESULT6 -eq 0 ] && echo '✅ PASSOU' || echo '❌ FALHOU')"
echo ""

# Próximo passo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 PRÓXIMO PASSO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Se todos os testes passaram ✅, podemos prosseguir para:"
echo ""
echo "Step 3: Módulo de Autenticação"
echo "  - POST /auth/register"
echo "  - POST /auth/login"
echo "  - Hash de senha com bcryptjs"
echo "  - Token JWT"
echo ""
echo "Comandos para verificar dados (Prisma Studio):"
echo "  npx prisma studio  # Abre UI em http://localhost:5555"
echo ""
