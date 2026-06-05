# Step 2: Configuração do Prisma e Banco de Dados

## Status: ✅ IMPLEMENTADO

### Objetivo
Configurar Prisma com PostgreSQL, criar modelos iniciais e estabelecer relacionamentos para suportar multi-empresa (SaaS).

---

## Arquivos Criados/Alterados

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `prisma/schema.prisma` | **Atualizado** | Schema completo com 6 modelos + enums |
| `src/config/prisma.ts` | **Criado** | Cliente Prisma centralizado e singleton |
| `src/config/index.ts` | **Criado** | Exportações da pasta config |
| `src/server.ts` | **Atualizado** | Adicionado graceful shutdown com Prisma |
| `.env` | **Atualizado** | DATABASE_URL configurado |

---

## Modelos de Dados

### 1. **Enums**

#### `UserRole`
```
- OWNER: Dono do salão
- PROFESSIONAL: Profissional do salão  
- ADMIN: Admin da plataforma
```

#### `AppointmentStatus`
```
- PENDING: Aguardando confirmação
- CONFIRMED: Confirmado
- COMPLETED: Realizado
- CANCELED: Cancelado
- NO_SHOW: Não compareceu
```

#### `ServiceCategory`
```
- HAIRCUT, COLORING, STYLING, NAILS, MASSAGE, SKINCARE, LASHES, WAXING, OTHER
```

---

### 2. **Modelos e Relacionamentos**

#### **User** (Donos de salões, profissionais, admins)
```
- id: String (CUID)
- email: String (UNIQUE) ← Chave única de login
- name: String
- phone: String?
- password: String (bcryptjs hash)
- role: UserRole (padrão: OWNER)
- salon: Salon? ← (1:1) Dono tem um salão
```

#### **Salon** (Multi-empresa)
```
- id: String (CUID)
- ownerId: String (FK → User) ← Chave do dono
- name: String
- slug: String (UNIQUE) ← Para URLs públicas (ex: studio-ana)
- phone: String
- email: String?
- address, city, state, zipCode: Endereço
- businessHours: String? ← JSON com horários
- professionals: Professional[] ← (1:N) Múltiplos profissionais
- services: Service[] ← (1:N) Múltiplos serviços
- clients: Client[] ← (1:N) Múltiplos clientes
- appointments: Appointment[] ← (1:N) Múltiplos agendamentos
```

#### **Professional** (Profissionais do salão)
```
- id: String (CUID)
- salonId: String (FK → Salon)
- name: String
- phone: String
- bio: String?
- active: Boolean (padrão: true)
- services: Service[] ← (N:M) Múltiplos serviços
- appointments: Appointment[] ← (1:N) Múltiplos agendamentos
```

#### **Service** (Serviços oferecidos)
```
- id: String (CUID)
- salonId: String (FK → Salon)
- name: String
- description: String?
- category: ServiceCategory
- price: Decimal
- durationMinutes: Int ← Duração do atendimento
- active: Boolean (padrão: true)
- professionals: Professional[] ← (N:M) Múltiplos profissionais
- appointments: Appointment[] ← (1:N) Múltiplos agendamentos
```

#### **Client** (Clientes que agendaram)
```
- id: String (CUID)
- salonId: String (FK → Salon)
- name: String
- phone: String ← Pode ter múltiplos clientes com mesmo telefone
- email: String?
- appointments: Appointment[] ← (1:N) Múltiplos agendamentos
```

#### **Appointment** (Agendamentos)
```
- id: String (CUID)
- salonId: String (FK → Salon) ← Isolamento multi-empresa
- clientId: String (FK → Client)
- professionalId: String (FK → Professional)
- serviceId: String (FK → Service)
- scheduledAt: DateTime ← Data e hora do agendamento
- status: AppointmentStatus (padrão: PENDING)
- notes: String? ← Notas do agendamento
```

---

## Diagram de Relacionamentos

```
User (1)
  ↓ (1:1)
Salon (1)
  ├─ (1:N) → Professional (N)
  │           ├─ (N:M) ↔ Service
  │           └─ (1:N) → Appointment
  │
  ├─ (1:N) → Service (N)
  │           └─ (N:M) ↔ Professional
  │
  ├─ (1:N) → Client (N)
  │           └─ (1:N) → Appointment
  │
  └─ (1:N) → Appointment (N)
```

---

## Decisões Arquiteturais

### 1. **Multi-Empresa (SaaS)**
- Cada `Salon` é isolado (tem `salonId` em todas as tabelas relacionadas)
- Queries devem sempre filtrar por `salonId` do usuário logado
- Impede vazamento de dados entre salões

### 2. **CUID como ID**
- Gerado automaticamente pelo Prisma
- Mais seguro que UUID sequencial
- Melhor performance em índices

### 3. **Relacionamentos N:M**
- `Professional` ↔ `Service` (muitos-para-muitos)
- Profissional pode oferecer múltiplos serviços
- Serviço pode ser oferecido por múltiplos profissionais

### 4. **Unique Constraints**
- `Professional.phone` unique por salão (não globalmente)
- `Service.name` unique por salão
- `Client.phone` unique por salão
- `Appointment.professionalId + scheduledAt` unique (impede duplo booking)

### 5. **Índices**
- Criados em `Appointment` para queries frequentes:
  - `salonId`, `clientId`, `professionalId`, `serviceId`, `scheduledAt`

### 6. **OnDelete Cascade vs Restrict**
- **Cascade**: User → Salon (ao deletar dono, deleta salão)
- **Restrict**: Professional/Service → Appointment (impede deletar se há agendamentos)

---

## Como Testar

### Pré-requisitos
- PostgreSQL rodando
- `.env` com `DATABASE_URL` válido
- Node.js >= 18

### Testes Exatos

#### 1️⃣ Validar Schema
```bash
cd backend
npx prisma validate
```

**Esperado:**
```
✓ Your schema is valid. Ready to start using Prisma!
```

---

#### 2️⃣ Gerar Cliente Prisma
```bash
npx prisma generate
```

**Esperado:**
```
✓ Generated Prisma Client to ./generated/prisma in XXXms
```

Isso cria em `generated/prisma/` os tipos TypeScript do Prisma.

---

#### 3️⃣ Criar Migração Inicial
```bash
npx prisma migrate dev --name initial
```

**Passos:**
1. Pergunta o nome da migração → Digite: `initial`
2. Cria arquivo em `prisma/migrations/` com SQL
3. Executa a migração no banco
4. Regenera o Prisma Client

**Esperado:**
```
✓ Your database has been created and migrations executed.
✓ Generated Prisma Client

Migration initial applied successfully.
```

---

#### 4️⃣ Visualizar Banco (Opcional)
```bash
npx prisma studio
```

Abre UI web em http://localhost:5555 para visualizar dados.

---

## Possíveis Erros e Correções

| Erro | Causa | Solução |
|------|-------|---------|
| `DATABASE_URL is missing` | Variável de ambiente não definida | Adicione `DATABASE_URL` em `.env` |
| `Can't reach PostgreSQL` | Banco não está rodando | Inicie PostgreSQL (docker ou local) |
| `relation "users" already exists` | Migração já foi executada | Delete `prisma/migrations/` e execute novamente |
| `Invalid datasource` | Provider incorreto | Use `provider = "postgresql"` em schema.prisma |
| `PrismaClientValidationError` | Schema inválido | Execute `npx prisma validate` para diagnosticar |
| `ENOENT: no such file` | Arquivo não encontrado | Execute `npm install` novamente |

---

## Prisma Client Compartilhado

Arquivo: `src/config/prisma.ts`

**Características:**
- Singleton pattern (apenas uma conexão)
- Log de queries em desenvolvimento
- Funções para desconectar e reconectar
- Carregado automaticamente em `server.ts`

**Uso nos serviços:**
```typescript
import { prisma } from '@/config';

// Criar
const user = await prisma.user.create({
  data: { email, name, password }
});

// Ler
const salon = await prisma.salon.findUnique({
  where: { id: salonId }
});

// Atualizar
await prisma.professional.update({
  where: { id },
  data: { active: true }
});

// Deletar
await prisma.appointment.delete({
  where: { id }
});
```

---

## Próximas Etapas

Com o banco de dados configurado, podemos iniciar:

✅ **Step 3: Autenticação (cadastro/login)**
- Registrar usuário com email único
- Hash de senha com bcryptjs
- Gerar token JWT
- Login com email/senha

---

## Checklist de Validação

- ✅ Schema.prisma criado com 6 modelos + 3 enums
- ✅ Relacionamentos mapeados corretamente
- ✅ Prisma Client centralizado
- ✅ Multi-empresa isolado por salonId
- ✅ Unique constraints evitam duplicatas
- ✅ Índices otimizam queries
- ✅ Migrations prontas para executar
- ✅ Documentação clara
