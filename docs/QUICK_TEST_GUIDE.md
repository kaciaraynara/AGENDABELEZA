# 🧪 GUIA RÁPIDO DE TESTES — VALIDAÇÃO LOCAL

**O que fazer AGORA**:  
Execute estes testes para validar que tudo funciona corretamente após as melhorias.

---

## ✅ Teste 1: Instalar & Build

```bash
# Entrar na pasta backend
cd backend

# Instalar dependências (incluindo helmet)
npm install

# Compilar TypeScript
npm run build

# Resultado esperado:
# - Sem erros de compilação
# - Pasta dist/ criada
# - Arquivos .js gerados
```

**Se falhar**: Execute `npm install` novamente ou verifique versão do Node.js

---

## ✅ Teste 2: Dev Server

```bash
# Terminal 1: Rodar servidor em modo desenvolvimento
npm run dev

# Resultado esperado:
# ✓ Environment loaded: {...}
# ╔════════════════════════════════════════════════════════════╗
# ║          🚀 AgendaBeleza API - Servidor Iniciado           ║
# ║  ✓ Servidor:     http://localhost:3333                    ║
# ║  ✓ Ambiente:     development                              ║
# ║  ✓ Health:       GET /health                              ║
# ║  ✓ API Root:     GET /                                    ║
# ╚════════════════════════════════════════════════════════════╝
```

**Se falhar**:
- Verifique se porta 3333 está disponível
- Verifique se DATABASE_URL está correto no `.env`
- Execute `npx prisma generate` manualmente

---

## ✅ Teste 3: Health Endpoints

```bash
# Terminal 2: Abrir novo terminal e testar endpoints

# GET / (rota raiz)
curl http://localhost:3333/

# Resultado esperado:
# {
#   "app": "AgendaBeleza API",
#   "version": "0.1.0",
#   "environment": "development",
#   "status": "operational",
#   "endpoints": {
#     "health": "GET /health",
#     "auth": "POST /auth/register, POST /auth/login",
#     "docs": "GET /docs (futuro)"
#   }
# }

# GET /health
curl http://localhost:3333/health

# Resultado esperado:
# {
#   "status": "ok",
#   "app": "AgendaBeleza API",
#   "timestamp": "2026-06-05T10:30:45.123Z",
#   "uptime": 5.234,
#   "environment": "development"
# }
```

---

## ✅ Teste 4: 404 Handling

```bash
# Testar rota inexistente
curl http://localhost:3333/rota-inexistente

# Resultado esperado (status 404):
# {
#   "error": {
#     "name": "NotFound",
#     "message": "Rota GET /rota-inexistente não encontrada",
#     "code": "ROUTE_NOT_FOUND"
#   },
#   "path": "/rota-inexistente"
# }
```

---

## ✅ Teste 5: Prisma Validation

```bash
# Terminal 2: Validar schema Prisma

# Validar schema
npx prisma validate

# Resultado esperado:
# ✓ Your schema is valid

# Gerar Prisma Client
npx prisma generate

# Resultado esperado:
# ✓ Generated Prisma Client v5.7.1
# Done in Xms
```

---

## ✅ Teste 6: TypeScript Aliases

Se tudo passou nos testes acima, os aliases estão funcionando. Pode comprovar verificando que:
- ✅ `import { env } from '@config'` funciona
- ✅ `import { prisma } from '@config'` funciona
- ✅ `import { errorHandler } from '@middlewares'` funciona
- ✅ `import { AppError } from '@shared'` funciona

---

## ✅ Teste 7: Graceful Shutdown

```bash
# Terminal 1: Pressione Ctrl+C

# Resultado esperado:
# ^C
# ⚠️  SIGINT recebido, encerrando servidor...
# ✓ HTTP server fechado
# ✓ Prisma desconectado
# ✓ Servidor encerrado com sucesso
```

---

## 📊 Checklist de Validação

| Teste | Comando | Status |
|-------|---------|--------|
| Install | `npm install` | ✓ |
| Build | `npm run build` | ✓ |
| Dev | `npm run dev` | ✓ |
| GET / | `curl localhost:3333/` | ✓ |
| GET /health | `curl localhost:3333/health` | ✓ |
| 404 | `curl localhost:3333/inexistente` | ✓ |
| Prisma | `npx prisma validate` | ✓ |
| Prisma Gen | `npx prisma generate` | ✓ |
| Shutdown | `Ctrl+C` | ✓ |

---

## 🆘 Troubleshooting

### Erro: "Cannot find module '@config'"

**Solução**: 
```bash
# Limpar build
rm -rf dist/
npm run build
```

### Erro: "DATABASE_URL not defined"

**Solução**:
```bash
# Verificar .env
cat .env

# Deve ter:
# DATABASE_URL=postgresql://...

# Se não tiver, adicione:
echo "DATABASE_URL=postgresql://user:password@localhost:5432/agenda_beleza" >> .env
```

### Erro: "Port 3333 already in use"

**Solução**:
```bash
# Mudar porta em .env
echo "PORT=3334" >> .env

# Ou matar processo na porta 3333
lsof -ti:3333 | xargs kill -9
```

### Erro: "Prisma Client not generated"

**Solução**:
```bash
npx prisma generate
npx prisma validate
npm run dev
```

---

## ✅ Tudo Passou!

Se todos os 7 testes passaram sem erros:

🎉 **Infraestrutura está PRONTA para Step 3!**

**Próximo comando:**
```bash
# Manter npm run dev rodando
# E começar Step 3: Autenticação
```

---

## 📝 Comandos Rápidos

```bash
# Desenvolvimento
npm run dev         # Rodar servidor

# Build
npm run build       # Compilar TS
npm run start       # Rodar build em produção

# Prisma
npx prisma migrate dev --name initial   # Criar migration
npx prisma db seed                      # Rodar seed
npx prisma studio                       # UI para DB

# Utilitários
npm list            # Ver dependências
npm outdated        # Ver outdated packages
npx tsc --noEmit    # Verificar tipos sem build
```

---

**Testes Rápidos - PRONTO PARA EXECUTAR! ✅**

Execute AGORA e reporte qualquer erro que encontrar.
