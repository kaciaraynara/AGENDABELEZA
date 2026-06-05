# AgendaBeleza — Roadmap Realista para Produto SaaS

**Objetivo**: Lançar SaaS vendável em 3 semanas  
**Modelo**: Assinatura por plano  
**MVP mínimo**: Plano Essencial funcional  

---

## 📊 Roadmap Visual

```
FASE 1: Fundação SaaS (Week 1)
  ✅ Step 1: Backend base
  ✅ Step 2: Banco Prisma
  ⏳ Step 3: Autenticação
  ⏳ Step 4: Middleware JWT
  
FASE 2: Operação do Salão (Week 2)
  ⏳ Step 5: Módulo Salão
  ⏳ Step 6: Módulo Serviço
  ⏳ Step 7: Módulo Profissional
  
FASE 3: Agendamento Público (Week 2-3)
  ⏳ Step 8: Link público do salão
  ⏳ Step 9: Agendamento via link
  ⏳ Step 10: Confirmação WhatsApp
  
FASE 4: Gestão Interna (Week 3)
  ⏳ Step 11: Painel de agenda
  ⏳ Step 12: Dashboard básico
  
FASE 5: Produto Vendável (Week 3)
  ⏳ Step 13: Landing page
  ⏳ Step 14: Painel de planos
  ⏳ Step 15: Deploy produção
```

---

## 💰 Modelo de Negócio

### Plano Essencial
**Preço**: R$ 49/mês

**Público**: Profissionais autônomos

**Features**:
- ✅ 1 profissional
- ✅ Serviços cadastrados
- ✅ Link público de agendamento
- ✅ Agenda diária
- ✅ WhatsApp semiautomático (mensagens prontas)
- ✅ Histórico básico

**Suportado por**: Steps 1-12

---

### Plano Profissional
**Preço**: R$ 99/mês

**Público**: Pequenos salões (até 5 profissionais)

**Features**:
- ✅ Múltiplos profissionais
- ✅ Agenda por profissional
- ✅ Clientes cadastrados
- ✅ Confirmações pelo WhatsApp
- ✅ Dashboard básico
- ✅ Histórico completo
- ✅ Análise de no-show

**Suportado por**: Steps 1-12 + validações

---

### Plano Premium
**Preço**: R$ 199/mês

**Público**: Salões estruturados (5+ profissionais)

**Features**:
- ✅ Relatórios avançados
- ✅ Controle de no-show com taxa
- ✅ Campanhas de retorno de cliente
- ✅ Horários vagos disponíveis
- ✅ Personalização de marca (logo, cores)
- ✅ Múltiplos usuários com permissões
- ✅ API para integrações

**Suportado por**: Steps 1-12 + Step 13+ (pagamento)

---

## 🎯 Por Que Este Roadmap

### Problema Real
- Donos de salão usam WhatsApp manual
- Clientes esquecem horários
- Cancelamentos desorganizados
- Sem controle sobre faturamento

### Solução Mínima (Essencial)
1. Profissional cria conta
2. Cadastra serviços
3. Gera link público
4. Recebe agendamentos
5. Usa WhatsApp pronto para confirmar

**Isso JÁ reduz falta e melhora organização.**

### Expansão (Profissional)
- Suportar múltiplos profissionais
- Histórico de cliente
- Dashboard para visualizar
- Identificar padrões de no-show

### Premium
- Relatórios financeiros
- Estratégias de retenção
- Controle de qualidade

---

## 🏗️ Arquitetura Preparada

### Step 2 prepara schema para:

#### Plano Essencial
```prisma
Salon {
  professionals: [1]           // 1 profissional
  services: [...many]          // Múltiplos serviços
}

Professional {
  services: [...many]          // Vários serviços oferecidos
  appointments: [...]          // Histórico
}
```

✅ **Schema já suporta** (não precisa alterar BD)

---

#### Plano Profissional
```prisma
Salon {
  professionals: [1, 2, 3, 4, 5]  // Até 5
  clients: [...]                  // Cadastro
  appointments: [...]             // Histórico
}

Professional {
  appointments: [...]  // Análise individual
}
```

✅ **Schema já suporta** (não precisa alterar BD)

---

#### Plano Premium
```prisma
Salon {
  // Adicionar no Step 13:
  subscriptionPlanId: String  // Link ao plano
  customBranding: {...}       // Logo, cores
}

User {
  // Adicionar no Step 13:
  permissions: [...String]    // Controle granular
}
```

✅ **Schema extensível sem quebrar migração**

---

## ⚡ Steps Críticos

### Step 3: Autenticação
**Por quê critico:**
- Define User e Salon binding
- Garante isolamento SaaS
- Habilita login real

**Blocker se não fizer:**
- Impossível testar outros steps
- Sem JWT, sem proteção

---

### Step 5: Módulo Salão
**Por quê crítico:**
- Dono configura informações do salão
- Slug público é chave do marketing
- Habilita link vendável

**Blocker se não fizer:**
- Sem salão = sem agendamento público

---

### Step 9: Agendamento Público
**Por quê crítico:**
- **É a venda**
- Cliente se autoagenda
- Sem implementar = produto não funciona

**Blocker se não fizer:**
- MVP completo falha

---

## 📈 Métricas de Sucesso por Fase

### Fase 1 (Week 1)
- ✅ API rodando sem erros
- ✅ Schema válido
- ✅ JWT token sendo gerado
- ✅ Isolamento SaaS testado

---

### Fase 2 (Week 2)
- ✅ Dono consegue configurar salão
- ✅ Profissionais cadastrados
- ✅ Serviços cadastrados
- ✅ Link público funciona

---

### Fase 3 (Week 2-3)
- ✅ Cliente consegue agendar via link
- ✅ WhatsApp pronto para enviar
- ✅ Dono vê agenda organizada

---

### Fase 4 (Week 3)
- ✅ Dashboard mostra KPIs básicos
- ✅ Dono consegue gerenciar agenda

---

## 🎯 O Que Não Fazer

❌ **Não adicionar features fora do roadmap**
- Social login → Futuro
- App mobile → Futuro
- Integração Stripe → Futuro (Step 13+)
- Relatórios avançados → Futuro
- Múltiplos idiomas → Futuro

✅ **Manter foco no MVP**
- Email/senha básico
- Web apenas
- Manual pay ou demo
- Português apenas
- 1 país (Brasil)

---

## 🚀 Timeline Realista

### Week 1 (Dias 1-3)
- Step 1: Backend ✅ (feito)
- Step 2: Banco ✅ (hoje)
- Step 3: Autenticação (2h)
- Step 4: JWT Middleware (1h)

**Entrega**: API autenticada funcionando

---

### Week 2 (Dias 4-7)
- Step 5: Módulo Salão (3h)
- Step 6: Módulo Serviço (2h)
- Step 7: Módulo Profissional (2h)
- Step 8: Agendamento Público (4h)

**Entrega**: Backend 100% funcional

---

### Week 2-3 (Dias 8-10)
- Step 9: Agenda Interna (3h)
- Step 10: WhatsApp Semiautomático (2h)
- Step 11: Dashboard (4h)

**Entrega**: Plano Essencial funcional

---

### Week 3 (Dias 11-15)
- Step 12: Documentação API (2h)
- Step 13: Landing page (4h)
- Step 14: Deploy (2h)
- Step 15: Testes finais (4h)

**Entrega**: Produto em produção

---

## 📝 Regras para Não Falhar

1. **Cada step deve ser funcional em si**
   - Testável isoladamente
   - Revisável antes de próximo
   - Documentado com testes

2. **Não alterar BD sem documentar**
   - Cada migration é rastreável
   - Comentar porquê do schema
   - Prepare para versão futura

3. **Sempre isolar por salonId**
   - Query: `WHERE salonId = $1`
   - Validação: Conferir pertencimento
   - Rota protegida: Extrair salonId do JWT

4. **Sempre validar com Zod**
   - Input: Validado na rota
   - Output: Documentado em DTO
   - Erro: Mensagem clara em português

5. **Sempre testar antes de avançar**
   - Manual no Insomnia/Postman
   - Caso de sucesso
   - Caso de erro
   - Caso de edge

---

## 🎁 Próximos Passos

### Hoje (Step 2)
- [x] Schema pronto
- [x] Geração de tipos
- [x] Documentação
- [ ] Você validar testes

### Amanhã (Step 3)
- [ ] POST /auth/register
- [ ] POST /auth/login
- [ ] JWT token
- [ ] Teste manual

### Semana que vem (Steps 5-12)
- [ ] Módulos de negócio
- [ ] Link público
- [ ] Dashboard

---

## ✅ Status Atual

**Step 2: Schema Prisma**
- Schema enxuto e preparado ✅
- Isolamento SaaS garantido ✅
- Relacionamentos corretos ✅
- Pronto para Step 3 ✅

**Quando começar Step 3:**
- Após você validar Step 2 ✅

---

## 📚 Documentação Criada

- `docs/STEP_2_REVIEW.md` → Revisão técnica completa
- `docs/STEP_2_TEST_INSTRUCTIONS.md` → Como testar
- `docs/ROADMAP.md` → Este documento

**Próximo**: Ler STEP_2_TEST_INSTRUCTIONS.md e rodar testes! 🚀
