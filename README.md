> **NÃ­vel escolhido:** Projeto B â€” NÃ­vel Simples (com entregÃ¡veis adicionais de modularizaÃ§Ã£o e C4 do Projeto A)

# AgendaBeleza â€” SaaS de Agendamento e GestÃ£o para SalÃµes de Beleza

Plataforma SaaS para gestÃ£o de salÃµes de beleza, profissionais, catÃ¡logo de serviÃ§os, agendamento pÃºblico online e assinaturas recorrentes. Projeto Final consolidando as prÃ¡ticas de Engenharia de Software dos MÃ³dulos 1 a 4 ([Encontro 24 â€“ Projeto Final](https://henriquelopeslima.github.io/diglass/aulas/24-projeto-final.html#/title-slide)).

## 1. Arquitetura e PrincÃ­pios de Engenharia (M1)

- **SOLID e SeparaÃ§Ã£o de Responsabilidades**: Backend estruturado em mÃ³dulos de domÃ­nio (`billing`, `professionals`, `public`, `salons`, `services`) com camadas explÃ­citas (`routes`, `controllers`, `services`, `repositories`, `validations` e `providers`).
- **Design Pattern Justificado (Strategy / Adapter Pattern)**: Isolamento dos gateways de cobranÃ§a em `backend/src/modules/billing/providers/`, permitindo alternar ou evoluir provedores de pagamento (migraÃ§Ã£o de Stripe para Mercado Pago documentada no [ADR 0001](docs/adr/0001-decisao.md)) sem acoplamento na regra de negÃ³cio (`BillingService`).
- **Database Pattern (Repository Pattern + Prisma ORM)**: Acesso a dados encapsulado em repositÃ³rios tipados com PostgreSQL 15 e migraÃ§Ãµes versionadas em `backend/prisma/migrations/`.

## 2. Como Subir a AplicaÃ§Ã£o com 1 Comando (M1 / M3)

PrÃ©-requisitos: [Docker](https://docs.docker.com/get-docker/) e Docker Compose instalados.

```bash
docker compose up -d --build
```

O comando acima sobe o banco de dados `postgres:15-alpine` com *healthcheck*, executa as migraÃ§Ãµes do Prisma e inicia a API em `http://localhost:3333`.

### ExecuÃ§Ã£o Local em Modo Desenvolvimento (Opcional)

```bash
# 1. Subir apenas o banco PostgreSQL
docker compose up -d db

# 2. Configurar variÃ¡veis de ambiente do backend
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate deploy

# 3. Iniciar a API (porta 3333)
npm run dev
```

Para verificar a saÃºde da aplicaÃ§Ã£o e mÃ©tricas de observabilidade (M3):
- **Health Check**: `GET http://localhost:3333/health`
- **MÃ©tricas Prometheus (`prom-client`)**: `GET http://localhost:3333/metrics`

## 3. Como Executar Lint, Testes e Coverage (M2)

```bash
cd backend
npm run lint
npm test
npm run test:coverage
```

A suÃ­te utiliza **Jest** e **Supertest** para validar as regras de domÃ­nio e integraÃ§Ã£o dos endpoints da API.

## 4. Como Executar o Teste de Carga com k6 (M4)

Com a API rodando em `http://localhost:3333`, execute o smoke/load test em **k6**:

```bash
k6 run backend/scripts/k6-smoke.js
```

Alternativamente, para rodar o benchmark em Node.js via `autocannon`:

```bash
node backend/scripts/load-test.js
```

## 5. Ãndice da DocumentaÃ§Ã£o TÃ©cnica (M4)

- **DecisÃ£o Arquitetural (ADR 0001)**: [`docs/adr/0001-decisao.md`](docs/adr/0001-decisao.md)
- **Diagramas de Arquitetura (C4 Model)**: [`docs/c4/contexto.md`](docs/c4/contexto.md)
- **Contrato da API (OpenAPI 3.1)**: [`docs/openapi.yaml`](docs/openapi.yaml)
- **RelatÃ³rio de Desempenho, SLO e p95**: [`docs/desempenho.md`](docs/desempenho.md)
- **Registro de Uso de IA**: [`docs/ia.md`](docs/ia.md)
- **Autoria e ContribuiÃ§Ãµes**: [`CONTRIBUTORS.md`](CONTRIBUTORS.md)