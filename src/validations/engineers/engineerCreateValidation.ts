import { z } from 'zod';

export const createEngineerSchema = z.object({
    name: z.string().min(1, 'O nome é obrigatório').max(200),

    email: z
        .string()
        .min(1, 'O email é obrigatório')
        .email('Email inválido')
        .max(255, 'Email muito longo'),

    phone: z
        .string()
        .min(1, 'O telefone é obrigatório')
        .refine(
            (val) => val.replace(/\D/g, '').length === 11,
            'Telefone deve ter 11 dígitos (com DDD)',
        ),

    cpf: z
        .string()
        .min(1, 'O CPF é obrigatório')
        .refine(
            (val) => val.replace(/\D/g, '').length === 11,
            'CPF deve ter 11 dígitos',
        ),

    education: z
        .string()
        .min(1, 'A formação é obrigatória')
        .max(100, 'Formação muito longa'),

    registrationEntity: z
        .string()
        .min(1, 'O órgão de registro é obrigatório')
        .max(100, 'Órgão de registro muito longo'),

    registrationNumber: z
        .string()
        .min(1, 'O número de registro é obrigatório')
        .max(50, 'Número de registro muito longo'),
});

export type CreateEngineerFormValues = z.infer<typeof createEngineerSchema>;
