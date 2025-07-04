import { z } from 'zod';

export const createAgencySchema = z.object({
    name: z.string().min(1, 'Nome da agência é obrigatório').max(100),

    agencyNumber: z
        .union([
            z.number().min(1, 'Número da agência é obrigatório'),
            z
                .string()
                .min(1, 'Número da agência é obrigatório')
                .transform((val) => Number(val)),
        ])
        .refine((val) => !isNaN(val), {
            message: 'Deve ser um número válido',
        }),

    cnpj: z
        .string()
        .refine(
            (val) => val === '' || val.replace(/\D/g, '').length === 14,
            'CNPJ deve ter 14 dígitos',
        )
        .optional(),

    cep: z
        .string()
        .min(9, 'CEP deve ter 8 dígitos')
        .max(9, 'CEP deve ter 8 dígitos'),

    state: z.string().min(1, 'Estado é obrigatório').max(50),
    city: z.string().min(1, 'Cidade é obrigatória').max(100),
    district: z.string().min(1, 'Bairro é obrigatório').max(100),
    street: z.string().min(1, 'Rua é obrigatória').max(200),

    number: z
        .union([
            z.number().min(1, 'Número é obrigatório'),
            z
                .string()
                .min(1, 'Número é obrigatório')
                .transform((val) => Number(val)),
        ])
        .refine((val) => !isNaN(val), {
            message: 'Deve ser um número válido',
        }),
});

export type CreateAgencyFormValues = z.infer<typeof createAgencySchema>;
