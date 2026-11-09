import { ServiceCategory } from '@prisma/client';
import { ZodError, z } from 'zod';

const serviceCategoryValues = Object.values(ServiceCategory) as [ServiceCategory, ...ServiceCategory[]];

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Nome é obrigatório')
  .max(120, 'Nome deve ter no máximo 120 caracteres');

const descriptionSchema = z
  .string()
  .trim()
  .min(1, 'Descrição não pode ser vazia')
  .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
  .optional();

const priceSchema = z.coerce
  .number({ invalid_type_error: 'Preço deve ser um número' })
  .min(0, 'Preço deve ser maior ou igual a 0');

// New numeric fields for pricing
const costSchema = z.coerce
  .number({ invalid_type_error: 'Custo deve ser um número' })
  .min(0, 'Custo deve ser maior ou igual a 0');
const commissionSchema = z.coerce
  .number({ invalid_type_error: 'Comissão deve ser um número' })
  .min(0, 'Comissão deve ser maior ou igual a 0');
const marginSchema = z.coerce
  .number({ invalid_type_error: 'Margem desejada deve ser um número' })
  .min(0, 'Margem deve ser maior ou igual a 0');

const durationSchema = z.coerce
  .number({ invalid_type_error: 'Duração deve ser um número' })
  .int('Duração deve ser um número inteiro')
  .positive('Duração deve ser maior que 0');

export const createServiceSchema = z
  .object({
    name: nameSchema,
    description: descriptionSchema,
    category: z.enum(serviceCategoryValues).default(ServiceCategory.OTHER),
    price: priceSchema,
    durationMinutes: durationSchema,
    // Pricing fields
    costAmount: costSchema.optional(),
    commissionPercent: commissionSchema.optional(),
    desiredMarginPercent: marginSchema.optional(),
    pricingNotes: z.string().trim().max(500).optional(),
    active: z.boolean().optional(),
    imageUrl: z.string().url('URL inválida').or(z.literal('')).optional(),
  })
  .strict();

export const updateServiceSchema = z
  .object({
    name: nameSchema.optional(),
    description: descriptionSchema.optional(),
    category: z.enum(serviceCategoryValues).optional(),
    price: priceSchema.optional(),
    durationMinutes: durationSchema.optional(),
    // Pricing fields (optional)
    costAmount: costSchema.optional(),
    commissionPercent: commissionSchema.optional(),
    desiredMarginPercent: marginSchema.optional(),
    pricingNotes: z.string().trim().max(500).optional(),
    finalPrice: priceSchema.optional(),
    active: z.boolean().optional(),
    imageUrl: z.string().url('URL inválida').or(z.literal('')).optional(),
  })
  .strict()
  .refine(data => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar',
  });

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;

export function formatZodError(error: ZodError) {
  return error.issues
    .map(issue => `${issue.path.join('.') || 'body'}: ${issue.message}`)
    .join('; ');
}
