import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email é obrigatório' })
        .email('Email inválido')
        .max(100, 'Email muito longo'),
    password: z
        .string({ required_error: 'Senha é obrigatória' })
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .max(14, 'Senha muito longa'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
