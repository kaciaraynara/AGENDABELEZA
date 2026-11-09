# Projeto B — AgendaBeleza

Sistema SaaS para gestão de salões de beleza e agendamento online de clientes.

## 1. Como subir o projeto

Para subir o ambiente completo com Docker Compose:
`ash
docker compose up -d --build
``n
A API responderá em: http://localhost:3333
- Status: GET /health
- Métricas: GET /metrics

### Rodando localmente (sem Docker)
`ash
docker compose up -d db
cd backend
npm install
npx prisma db push
npm run dev
``n
## 2. Como rodar os testes
`ash
cd backend
npm test
npm run test:coverage
``n
## 3. Teste de carga e desempenho
- k6 (smoke test): k6 run backend/scripts/k6-smoke.js`n- Autocannon: 
ode backend/scripts/load-test.js`n
Mais detalhes sobre o teste de carga e latência p95 em docs/desempenho.md.

## 4. Estrutura e Decisões Técnicas
- **Arquitetura:** Backend modular por contexto (billing, professionals, public, salons, services) com Express e Prisma.
- **Design Pattern:** Strategy/Adapter em billing/providers para suporte ao Mercado Pago (detalhes no docs/adr/0001-decisao.md).
- **Documentação de API:** Contrato OpenAPI 3.1 em docs/openapi.yaml.
- **Diagramas:** Modelagem C4 em docs/c4/contexto.md.
- **Autoria:** Detalhes de entrega em CONTRIBUTORS.md.
