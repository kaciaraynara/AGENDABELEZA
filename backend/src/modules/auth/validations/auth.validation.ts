import { ZodError, z } from 'zod';

const optionalText = z
  .string()
  .trim()
  .min(1, 'Campo não pode ser vazio')
  .optional();

const emailSchema = z
  .string()
  .trim()
  .email('E-mail inválido')
  .transform(email => email.toLowerCase());

const phoneSchema = z
  .string()
  .trim()
  .min(8, 'Telefone deve ter pelo menos 8 caracteres')
  .max(20, 'Telefone deve ter no máximo 20 caracteres');

const slugSchema = z
  .string()
  .trim()
  .min(3, 'Slug deve ter pelo menos 3 caracteres')
  .max(60, 'Slug deve ter no máximo 60 caracteres')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug deve conter apenas letras minúsculas, números e hífens entre palavras'
  )
  .transform(slug => slug.toLowerCase());

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(120),
  email: emailSchema,
  phone: phoneSchema.optional(),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(72, 'Senha deve ter no máximo 72 caracteres'),
  salon: z.object({
    name: z.string().trim().min(2, 'Nome do salão deve ter pelo menos 2 caracteres').max(120),
    slug: slugSchema,
    phone: phoneSchema,
    email: emailSchema.optional(),
    description: optionalText,
    address: optionalText,
    city: optionalText,
    state: optionalText,
    zipCode: optionalText,
    businessHours: optionalText,
  }),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export function formatZodError(error: ZodError) {
  return error.issues
    .map(issue => `${issue.path.join('.') || 'body'}: ${issue.message}`)
    .join('; ');
}
