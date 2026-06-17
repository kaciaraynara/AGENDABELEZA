import { ZodError, z } from 'zod';

const requiredText = (field: string) =>
  z
    .string()
    .trim()
    .min(1, `${field} é obrigatório`);

const optionalText = z
  .string()
  .trim()
  .min(1, 'Campo não pode ser vazio')
  .optional();

const emailSchema = z
  .string()
  .trim()
  .email('E-mail inválido')
  .transform(email => email.toLowerCase())
  .optional();

const scheduledAtSchema = z
  .string()
  .trim()
  .min(1, 'Data do agendamento é obrigatória')
  .refine(value => !Number.isNaN(Date.parse(value)), 'Data do agendamento inválida')
  .transform(value => new Date(value));

export const createPublicAppointmentSchema = z
  .object({
    clientName: requiredText('Nome do cliente'),
    clientPhone: requiredText('Telefone do cliente'),
    clientEmail: emailSchema,
    serviceId: requiredText('Serviço'),
    professionalId: requiredText('Profissional'),
    scheduledAt: scheduledAtSchema,
    notes: optionalText,
  })
  .strict();

export type CreatePublicAppointmentInput = z.infer<typeof createPublicAppointmentSchema>;

export function formatZodError(error: ZodError) {
  return error.issues
    .map(issue => `${issue.path.join('.') || 'body'}: ${issue.message}`)
    .join('; ');
}
