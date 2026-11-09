import { ZodError, z } from 'zod';

const optionalText = z
  .string()
  .trim()
  .min(1, 'Campo não pode ser vazio')
  .max(255, 'Campo deve ter no máximo 255 caracteres')
  .optional();

const optionalLongText = z
  .string()
  .trim()
  .min(1, 'Campo não pode ser vazio')
  .max(1000, 'Campo deve ter no máximo 1000 caracteres')
  .optional();

const optionalEmail = z
  .string()
  .trim()
  .email('E-mail inválido')
  .transform(email => email.toLowerCase())
  .optional();

const optionalPhone = z
  .string()
  .trim()
  .min(8, 'Telefone deve ter pelo menos 8 caracteres')
  .max(20, 'Telefone deve ter no máximo 20 caracteres')
  .optional();

const optionalSlug = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Slug deve ter pelo menos 3 caracteres')
  .max(60, 'Slug deve ter no máximo 60 caracteres')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug deve conter apenas letras minúsculas, números e hífens entre palavras'
  )
  .optional();

export const updateSalonSchema = z
  .object({
    name: optionalText,
    slug: optionalSlug,
    phone: optionalPhone,
    email: optionalEmail,
    description: optionalLongText,
    address: optionalText,
    city: optionalText,
    state: optionalText,
    zipCode: optionalText,
    businessHours: optionalLongText,
    avatarUrl: z.string().url('URL inválida').or(z.literal('')).optional(),
  })
  .strict()
  .refine(data => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar',
  });

export type UpdateSalonInput = z.infer<typeof updateSalonSchema>;

export function formatZodError(error: ZodError) {
  return error.issues
    .map(issue => `${issue.path.join('.') || 'body'}: ${issue.message}`)
    .join('; ');
}
