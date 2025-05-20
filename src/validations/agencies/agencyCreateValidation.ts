import { z } from 'zod';

export const createAgencySchema = z.object({
    name: z
        .string()
        .min(1, 'Nome da agência é obrigatório')
        .max(100, 'Máximo 100 caracteres'),

    agencyNumber: z
        .string()
        .min(1, 'Número da agência é obrigatório')
        .regex(/^\d+$/, 'Deve conter apenas números'),

    cnpj: z
        .string()
        .length(18, 'CNPJ deve ter 14 dígitos')
        .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'Formato inválido')
        .optional()
        .or(z.literal('')),

    cep: z
        .string()
        .length(9, 'CEP deve ter 8 dígitos')
        .regex(/^\d{5}-\d{3}$/, 'Formato inválido'),

    state: z
        .string()
        .min(1, 'Estado é obrigatório')
        .max(50, 'Máximo 50 caracteres'),

    city: z
        .string()
        .min(1, 'Cidade é obrigatória')
        .max(100, 'Máximo 100 caracteres'),

    district: z
        .string()
        .min(1, 'Bairro é obrigatório')
        .max(100, 'Máximo 100 caracteres'),

    street: z
        .string()
        .min(1, 'Rua é obrigatória')
        .max(200, 'Máximo 200 caracteres'),

    number: z
        .string()
        .min(1, 'Número é obrigatório')
        .regex(/^\d+$/, 'Deve conter apenas números'),
});

export type CreateAgencyFormValues = z.infer<typeof createAgencySchema>;
