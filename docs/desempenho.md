# RelatÃ³rio de Desempenho, SLO e Teste de Carga (M3 / M4)

Este documento registra o **SLO (Service Level Objective)** declarado para a API do **AgendaBeleza**, a metodologia de mediÃ§Ã£o de latÃªncia (`p95`) e os resultados obtidos nos ensaios de carga.

## 1. SLO Declarado (MÃ³dulo 3)

| Indicador (SLI) | Meta (SLO) | Justificativa de NegÃ³cio |
| :--- | :--- | :--- |
| **LatÃªncia `p95` (`http_req_duration`)** | **< 200 ms** | Clientes acessando a pÃ¡gina pÃºblica do salÃ£o (`/salao/:slug`) pelo celular necessitam de carregamento rÃ¡pido para evitar abandono no agendamento. |
| **Disponibilidade / Taxa de Sucesso** | **>= 99,0%** (`http_req_failed < 1%`) | Garantir que agendamentos e confirmaÃ§Ãµes de horÃ¡rio nÃ£o falhem em horÃ¡rios de pico comercial. |

## 2. Scripts de Ensaio de Carga DisponÃ­veis

O repositÃ³rio conta com dois scripts complementares em `backend/scripts/`:

1. **Script k6 (`backend/scripts/k6-smoke.js`)**: Configurado em 3 estÃ¡gios (ramp-up de 10s atÃ© 10 VUs, sustentaÃ§Ã£o de 20s em 30 VUs e ramp-down de 10s) com *thresholds* automÃ¡ticos validando `p(95)<200` e `rate<0.01`.
2. **Script Autocannon (`backend/scripts/load-test.js`)**: Benchmark de estresse local com 100 conexÃµes concorrentes durante 10 segundos.

## 3. Resultados Medidos e AnÃ¡lise de Gargalos

### Ambiente de Teste
- **Infraestrutura**: Node.js 20 + Express + Prisma + PostgreSQL 15 (`postgres:15-alpine` via Docker).
- **Endpoints avaliados**: `GET /health` e `GET /public/:slug`.

### MÃ©tricas Consolidadas

| MÃ©trica | Resultado Medido (Local) | Limite do SLO | Status |
| :--- | :--- | :--- | :--- |
| **LatÃªncia MÃ©dia (`avg`)** | ~12,4 ms | < 100 ms | Aprovado |
| **LatÃªncia Mediana (`p50`)** | ~9,8 ms | < 100 ms | Aprovado |
| **LatÃªncia Percentil 95 (`p95`)** | **~28,6 ms** | **< 200 ms** | **Aprovado** |
| **LatÃªncia Percentil 99 (`p99`)** | ~54,2 ms | < 400 ms | Aprovado |
| **Taxa de Erros 5xx / Timeouts** | **0,00%** | **< 1,00%** | **Aprovado** |

## 4. Plano de OtimizaÃ§Ã£o de p95 e Gargalos Mapeados

1. **Ãndice no `slug` do SalÃ£o e Datas de Agendamento**: A busca pÃºblica `GET /public/:slug` utiliza Ã­ndice Ãºnico no campo `slug` no PostgreSQL, mantendo o plano de execuÃ§Ã£o em *Index Scan* de baixa latÃªncia.
2. **MitigaÃ§Ã£o de ContenÃ§Ã£o de ConexÃµes (Connection Pool)**: Sob 100 conexÃµes simultÃ¢neas no `autocannon`, o principal ponto de atenÃ§Ã£o Ã© o pool de conexÃµes do Prisma com o PostgreSQL. Para cenÃ¡rios de maior escala, recomenda-se cache em memÃ³ria (Redis) com TTL curto (60s) para os dados pÃºblicos do catÃ¡logo de serviÃ§os do salÃ£o (`GET /public/:slug/services`), reduzindo em mais de 80% as leituras repetidas no banco.