import { z } from 'zod';

export const updatePathologySchema = z.object({
    locationId: z
        .string()
        .uuid({
            message: 'ID do local inválido',
        })
        .optional(),
    title: z
        .string()
        .min(5, 'O título deve ter pelo menos 5 caracteres')
        .max(100, 'O título deve ter no máximo 100 caracteres')
        .optional(),
    description: z
        .string()
        .min(5, 'A descrição deve ter pelo menos 5 caracteres')
        .max(500, 'A descrição deve ter no máximo 500 caracteres')
        .optional(),
    referenceLocation: z
        .string()
        .min(3, 'A referência deve ter pelo menos 5 caracteres')
        .max(100, 'A referência deve ter no máximo 100 caracteres')
        .optional(),
});

export type UpdatePathologyFormValues = z.infer<typeof updatePathologySchema>;
