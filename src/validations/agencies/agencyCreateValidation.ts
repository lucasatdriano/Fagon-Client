import { z } from 'zod';

export const createAgencySchema = z.object({
    name: z.string().min(1, 'O nome da agência é obrigatório').max(100),

    agencyNumber: z.coerce
        .string({
            invalid_type_error: 'Número da agência deve ser um número',
        })
        .min(1, 'O número da agência é obrigatório'),

    cnpj: z
        .string()
        .refine(
            (val) => val === '' || val.replace(/\D/g, '').length === 14,
            'CNPJ deve ter 14 dígitos',
        )
        .optional(),

    cep: z
        .string()
        .min(1, 'O CEP é obrigatório')
        .refine(
            (val) => val === '' || val.replace(/\D/g, '').length === 8,
            'CEP deve ter 8 dígitos',
        ),

    state: z.string().min(1, 'O estado é obrigatório').max(50),
    city: z.string().min(1, 'A cidade é obrigatória').max(100),
    district: z.string().min(1, 'O bairro é obrigatório').max(100),
    street: z.string().min(1, 'A rua é obrigatória').max(200),
    complement: z.string().max(200).optional(),

    number: z
        .string()
        .min(1, 'Número é obrigatório')
        .max(20, 'Número muito longo')
        .refine(
            (val) => /^[A-Za-z0-9/\-\s]+$/.test(val),
            'Número deve conter apenas letras, números, barras, hífens ou espaços',
        ),
});

export type CreateAgencyFormValues = z.infer<typeof createAgencySchema>;
