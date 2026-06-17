import { ZodError, z } from 'zod';

export const linkProfessionalServicesSchema = z
  .object({
    serviceIds: z
      .array(z.string().trim().min(1, 'ID do serviço não pode ser vazio'))
      .min(1, 'Informe ao menos um serviço'),
  })
  .strict();

export type LinkProfessionalServicesInput = z.infer<typeof linkProfessionalServicesSchema>;

export function formatZodError(error: ZodError) {
  return error.issues
    .map(issue => `${issue.path.join('.') || 'body'}: ${issue.message}`)
    .join('; ');
}
