import { z } from 'zod';

export const registerSchema = z
    .object({
        name: z
            .string({ required_error: 'Nome é obrigatório' })
            .min(3, 'Nome deve ter pelo menos 3 caracteres')
            .max(60, 'Nome muito longo'),
        email: z
            .string({ required_error: 'Email é obrigatório' })
            .email('Email inválido')
            .max(100, 'Email muito longo'),
        password: z
            .string({ required_error: 'Senha é obrigatória' })
            .min(4, 'Senha deve ter pelo menos 4 caracteres')
            .max(14, 'Senha muito longa'),
        confirmPassword: z.string({
            required_error: 'Confirmação de senha é obrigatória',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;
