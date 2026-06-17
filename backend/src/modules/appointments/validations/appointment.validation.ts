import { AppointmentStatus } from '@prisma/client';
import { ZodError, z } from 'zod';

const appointmentStatusValues = Object.values(AppointmentStatus) as [
  AppointmentStatus,
  ...AppointmentStatus[],
];

const optionalIdSchema = z
  .string()
  .trim()
  .min(1, 'ID não pode ser vazio')
  .optional();

const optionalPhoneSchema = z
  .string()
  .trim()
  .min(1, 'Telefone não pode ser vazio')
  .optional();

const dateFilterSchema = z
  .string()
  .trim()
  .min(1, 'Data não pode ser vazia')
  .refine(value => !Number.isNaN(Date.parse(value)), 'Data inválida')
  .optional();

export const listAppointmentsSchema = z
  .object({
    status: z.enum(appointmentStatusValues).optional(),
    date: dateFilterSchema,
    professionalId: optionalIdSchema,
    clientPhone: optionalPhoneSchema,
    limit: z.coerce
      .number()
      .int('Limit deve ser um número inteiro')
      .min(1, 'Limit deve ser maior que 0')
      .max(100, 'Limit deve ser no máximo 100')
      .default(50),
    offset: z.coerce
      .number()
      .int('Offset deve ser um número inteiro')
      .min(0, 'Offset deve ser maior ou igual a 0')
      .default(0),
  })
  .strict();

export const updateAppointmentStatusSchema = z
  .object({
    status: z.enum(appointmentStatusValues),
  })
  .strict();

export type ListAppointmentsInput = z.infer<typeof listAppointmentsSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;

export function formatZodError(error: ZodError) {
  return error.issues
    .map(issue => `${issue.path.join('.') || 'body'}: ${issue.message}`)
    .join('; ');
}
