import { ZodError, z } from 'zod';

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Nome é obrigatório')
  .max(120, 'Nome deve ter no máximo 120 caracteres');

const phoneSchema = z
  .string()
  .trim()
  .min(8, 'Telefone deve ter pelo menos 8 caracteres')
  .max(20, 'Telefone deve ter no máximo 20 caracteres');

const bioSchema = z
  .string()
  .trim()
  .min(1, 'Bio não pode ser vazia')
  .max(1000, 'Bio deve ter no máximo 1000 caracteres')
  .optional();

export const createProfessionalSchema = z
  .object({
    name: nameSchema,
    phone: phoneSchema,
    bio: bioSchema,
    active: z.boolean().optional(),
  })
  .strict();

export const updateProfessionalSchema = z
  .object({
    name: nameSchema.optional(),
    phone: phoneSchema.optional(),
    bio: bioSchema,
    active: z.boolean().optional(),
  })
  .strict()
  .refine(data => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar',
  });

export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>;
export type UpdateProfessionalInput = z.infer<typeof updateProfessionalSchema>;

export function formatZodError(error: ZodError) {
  return error.issues
    .map(issue => `${issue.path.join('.') || 'body'}: ${issue.message}`)
    .join('; ');
}
