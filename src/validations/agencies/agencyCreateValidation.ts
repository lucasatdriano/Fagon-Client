import { z } from 'zod';

export const createAgencySchema = z.object({
    name: z.string().min(1, 'Nome da agência é obrigatório').max(100),

    agencyNumber: z
        .string()
        .min(1, 'Número da agência é obrigatório')
        .regex(/^\d+$/, 'Deve conter apenas números'),

    cnpj: z
        .string()
        .refine(
            (val) => val === '' || val.length === 18,
            'CNPJ deve ter 14 dígitos',
        )
        .refine(
            (val) =>
                val === '' || /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(val),
            'Formato inválido',
        )
        .optional(),

    cep: z
        .string()
        .min(8, 'CEP deve ter 8 dígitos')
        .max(9, 'CEP deve ter 8 dígitos'),

    state: z.string().min(1, 'Estado é obrigatório').max(50),
    city: z.string().min(1, 'Cidade é obrigatória').max(100),
    district: z.string().min(1, 'Bairro é obrigatório').max(100),
    street: z.string().min(1, 'Rua é obrigatória').max(200),

    number: z
        .string()
        .min(1, 'Número é obrigatório')
        .regex(/^\d+$/, 'Deve conter apenas números'),
});

export type CreateAgencyFormValues = {
    name: string;
    agencyNumber: string;
    cnpj?: string;
    cep: string;
    state: string;
    city: string;
    district: string;
    street: string;
    number: string;
};
