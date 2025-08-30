import { z } from 'zod';

export const createInspectorSchema = z.object({
    name: z.string().min(1, 'O nome é obrigatório').max(200),

    phone: z
        .string()
        .min(1, 'O telefone é obrigatório')
        .refine(
            (val) => val.replace(/\D/g, '').length === 11,
            'Telefone deve ter 11 dígitos (com DDD)',
        ),

    cep: z.string(),
    state: z.string().min(1, 'O estado é obrigatório').max(100),
    city: z.string().min(1, 'A cidade é obrigatória').max(100),
    district: z.string().max(100),
    street: z.string().max(200),

    selectedCities: z.array(z.string()),
});

export type CreateInspectorFormValues = z.infer<typeof createInspectorSchema>;
