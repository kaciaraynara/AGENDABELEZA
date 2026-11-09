# ADR 0001: AdoÃ§Ã£o do Strategy Pattern para Gateways de Pagamento e MigraÃ§Ã£o de Stripe para Mercado Pago

- **Status:** Aceito
- **Data:** 2026-11-09
- **Decisores:** Raynara KÃ¡cia MagalhÃ£es Fonteles

## Contexto e DeclaraÃ§Ã£o do Problema

O **AgendaBeleza** Ã© um SaaS voltado para salÃµes de beleza brasileiros com cobranÃ§a recorrente de planos (*Starter* e *Professional*). Na versÃ£o inicial do sistema, o mÃ³dulo de faturamento (`backend/src/modules/billing`) estava acoplado diretamente Ã  SDK da **Stripe** (`stripeProvider.ts`).

Durante a evoluÃ§Ã£o do produto para o mercado nacional, surgiram dois problemas tÃ©cnicos e de negÃ³cio:
1. Necessidade de suportar mÃ©todos de pagamento locais amplamente utilizados por pequenos negÃ³cios no Brasil (como Pix imediato e checkout transparente via **Mercado Pago**) com menores taxas de intermediaÃ§Ã£o local.
2. Forte acoplamento entre o `BillingService` e a API especÃ­fica do provedor de pagamento, dificultando testes automatizados em CI (exigindo mocks complexos) e tornando arriscada a troca de gateway.

## OpÃ§Ãµes Consideradas

1. **OpÃ§Ã£o 1 (escolhida):** Implementar o padrÃ£o **Strategy / Adapter** em `backend/src/modules/billing/providers/` e migrar o provedor ativo para **Mercado Pago** (`mercadoPagoProvider.ts`), mantendo contrato Ãºnico de interface.
2. **OpÃ§Ã£o 2 (descartada):** Manter a **Stripe** hardcoded diretamente dentro de `BillingService` com condicionais `if/else` para rotas de checkout.
3. **OpÃ§Ã£o 3 (descartada):** Extrair o faturamento para um microsserviÃ§o independente de pagamentos nesta fase do projeto.

## DecisÃ£o

Escolhemos a **OpÃ§Ã£o 1**: desacoplar a integraÃ§Ã£o de pagamento por meio de um *Provider Pattern (Strategy/Adapter)* centralizado em `backend/src/modules/billing/providers/index.ts` e adotar o `mercadoPagoProvider.ts` como implementaÃ§Ã£o principal, suportada pela migration `20260724203157_add_mercadopago_provider` no Prisma.

### Justificativa TÃ©cnica e Alternativa Descartada

- **Por que descartamos manter a Stripe acoplada (OpÃ§Ã£o 2):** Viola os princÃ­pios **OCP (Open-Closed Principle)** e **DIP (Dependency Inversion Principle)** do SOLID. Qualquer alteraÃ§Ã£o de SDK ou falha de rede no provedor externo quebrava diretamente a camada de serviÃ§o e impedia testes determinÃ­sticos sem chamadas externas.
- **Por que descartamos um microsserviÃ§o separado agora (OpÃ§Ã£o 3):** Adicionaria sobrecarga operacional (filas, rede, deploy distribuÃ­do e reconciliaÃ§Ã£o eventual) desnecessÃ¡ria para a volumetria atual do monÃ³lito modular.

## ConsequÃªncias

### Positivas
- O `BillingService` depende apenas de uma abstraÃ§Ã£o de provedor, facilitando a injeÃ§Ã£o de mocks nos testes (`backend/src/modules/billing/__tests__/billing.test.ts`).
- AdequaÃ§Ã£o imediata ao mercado brasileiro com suporte nativo ao ecossistema Mercado Pago.
- Facilidade para adicionar novos provedores no futuro (ou reativar a Stripe como fallback) sem alterar controllers ou rotas.

### Negativas / Trade-offs
- Necessidade de manter o mapeamento padronizado de status de assinatura (`TRIAL`, `ACTIVE`, `PAST_DUE`, `CANCELED`) entre o webhook do provedor externo e o banco PostgreSQL.