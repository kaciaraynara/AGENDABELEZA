# Arquitetura C4 â€” AgendaBeleza (Contexto e ContÃªineres)

Diagramas elaborados em **Mermaid C4** representando as fronteiras do sistema **AgendaBeleza** e seus contÃªineres de execuÃ§Ã£o.

## NÃ­vel 1: Diagrama de Contexto do Sistema (C4 Context)

```mermaid
C4Context
    title Diagrama de Contexto (C4 NÃ­vel 1) - AgendaBeleza SaaS

    Person(cliente, "Cliente do SalÃ£o", "Acessa a pÃ¡gina pÃºblica (/salao/:slug) para consultar serviÃ§os, profissionais e realizar agendamentos online.")
    Person(gestor, "Gestor / Profissional do SalÃ£o", "Gerencia agenda diÃ¡ria, catÃ¡logo de serviÃ§os, equipe de profissionais e assinatura do salÃ£o.")

    System(agendabeleza, "Sistema AgendaBeleza", "Plataforma SaaS que centraliza agendamentos online, gestÃ£o operacional do salÃ£o e controle de assinaturas.")

    System_Ext(mercadopago, "Mercado Pago API", "Processa checkout de assinaturas e notificaÃ§Ãµes de pagamento via Webhook.")

    Rel(cliente, agendabeleza, "Consulta disponibilidade e cria agendamentos pÃºblicos", "HTTPS / JSON")
    Rel(gestor, agendabeleza, "Administra agenda, serviÃ§os, profissionais e plano", "HTTPS / JSON (JWT)")
    Rel(agendabeleza, mercadopago, "Cria preferÃªncias de assinatura e recebe webhooks", "HTTPS / REST")
```

## NÃ­vel 2: Diagrama de ContÃªineres (C4 Container)

```mermaid
C4Container
    title Diagrama de ContÃªineres (C4 NÃ­vel 2) - AgendaBeleza SaaS

    Person(cliente, "Cliente do SalÃ£o", "Agenda horÃ¡rios pela vitrine pÃºblica.")
    Person(gestor, "Gestor do SalÃ£o", "Opera o painel administrativo.")

    System_Boundary(c1, "AgendaBeleza SaaS") {
        Container(web, "Frontend Web App", "Next.js, React, TypeScript, Tailwind CSS", "Interface responsiva contendo a vitrine pÃºblica (/salao/[slug]) e o painel do assinante (/dashboard, /agendamentos, /billing).")
        Container(api, "Backend API (MonÃ³lito Modular)", "Node.js, Express, TypeScript, Prisma, Pino", "ExpÃµe API RESTful modularizada (auth, salons, services, professionals, appointments, public, billing) com validaÃ§Ã£o Zod e mÃ©tricas Prometheus.")
        ContainerDb(db, "Banco de Dados Relacional", "PostgreSQL 15", "Armazena salÃµes, usuÃ¡rios, profissionais, serviÃ§os, agendamentos e histÃ³rico de assinaturas.")
    }

    System_Ext(mercadopago, "Mercado Pago API", "Gateway de pagamentos e assinaturas.")

    Rel(cliente, web, "Acessa vitrine pÃºblica", "HTTPS")
    Rel(gestor, web, "Acessa dashboard administrativo", "HTTPS")
    Rel(web, api, "Consome endpoints REST", "HTTP/JSON (Porta 3333)")
    Rel(api, db, "LÃª e persiste dados via Prisma ORM", "TCP (Porta 5432)")
    Rel(api, mercadopago, "Integra cobranÃ§a via Strategy Provider", "HTTPS")
```