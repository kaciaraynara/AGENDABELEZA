# DeclaraÃ§Ã£o de Uso de InteligÃªncia Artificial (`docs/ia.md`)

Em conformidade com as diretrizes do [Encontro 24 â€“ Uso de IA](https://henriquelopeslima.github.io/diglass/aulas/24-projeto-final.html#/uso-de-ia), este documento registra os prompts que importaram no projeto final e como as decisÃµes tÃ©cnicas permaneceram sob controle e validaÃ§Ã£o da autora.

## 1. Prompts Relevantes Utilizados

1. **AnÃ¡lise de AderÃªncia e EstruturaÃ§Ã£o Arquitetural**:
   - *Prompt*: `"Me auxilie a fazer esse projeto final usando meu projeto Agenda Beleza conforme o professor deseja, analisando os requisitos do Encontro 24 e o estado atual do meu repositÃ³rio Git."`
   - *Uso*: Mapeamento das exigÃªncias dos MÃ³dulos 1 a 4 contra os mÃ³dulos jÃ¡ implementados no `backend/` e `frontend/`.

2. **RefatoraÃ§Ã£o do Gateway de Pagamentos (Strategy Pattern) e Testes**:
   - *Prompt*: `"Estruturar o provedor do Mercado Pago em backend/src/modules/billing/providers/ mantendo um contrato desacoplado no BillingService e criar testes unitÃ¡rios/integraÃ§Ã£o em billing.test.ts com Jest."`
   - *Uso*: Apoio na organizaÃ§Ã£o da interface de provedores e nos cenÃ¡rios de teste com mocks do SDK.

3. **PadronizaÃ§Ã£o de DocumentaÃ§Ã£o MADR, OpenAPI 3.1, C4, Observabilidade e Pipeline CI**:
   - *Prompt*: `"Gerar a estrutura padronizada do ADR 0001 (MADR), diagrama C4 em Mermaid, contrato OpenAPI 3.1 das rotas reais do app.ts, logs estruturados com pino + mÃ©trica prom-client e workflow do GitHub Actions com PostgreSQL."`
   - *Uso*: EstruturaÃ§Ã£o dos artefatos de documentaÃ§Ã£o em `docs/`, instrumentaÃ§Ã£o do endpoint `/metrics` e automaÃ§Ã£o do `.github/workflows/ci.yml`.

## 2. DecisÃµes TÃ©cnicas Tomadas pela Autora (Human-in-the-Loop)

- **Escolha de Arquitetura e DomÃ­nio**: A modelagem de domÃ­nio do **AgendaBeleza** (salÃµes, profissionais, serviÃ§os, agendamentos pÃºblicos por `slug` e assinaturas) foi projetada e validada pela autora.
- **DecisÃ£o de Troca de Gateway (Stripe -> Mercado Pago)**: A IA sugeriu formas de manter mÃºltiplos provedores ou criar microsserviÃ§os; a decisÃ£o de usar um **Strategy Pattern** enxuto dentro do monÃ³lito modular e priorizar o Mercado Pago para o pÃºblico brasileiro foi tomada pela autora e documentada no [ADR 0001](adr/0001-decisao.md).
- **RevisÃ£o e ValidaÃ§Ã£o de CÃ³digo**: Todo cÃ³digo, migraÃ§Ã£o Prisma e suÃ­te de testes no repositÃ³rio foi executado, depurado e validado localmente antes do commit.