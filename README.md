# Projeto B — AgendaBeleza

O **AgendaBeleza** é um sistema feito para salões de beleza gerenciarem seus atendimentos no dia a dia e permitirem que seus clientes agendem horários pela internet através de uma página pública.

---

## O que o sistema faz

- **Página pública do salão:** o cliente acessa o link do salão (`/salao/nome-do-salao`), escolhe o serviço, o profissional e o horário, e confirma o agendamento.
- **Painel do salão:** o dono do salão acompanha a lista de agendamentos do dia divididos em pendentes, confirmados e concluídos.
- **Serviços e equipe:** cadastro dos preços, tempo de duração de cada procedimento e profissionais disponíveis.
- **Planos e assinaturas:** controle de acesso ao sistema integrado com cobrança via Mercado Pago.

---

## Como rodar o projeto

### Opção 1: Usando Docker (Recomendado)

Se você tiver o Docker instalado, basta rodar o comando abaixo na pasta raiz do projeto. Ele já inicia o banco de dados e a API automaticamente:

```bash
docker compose up -d --build
