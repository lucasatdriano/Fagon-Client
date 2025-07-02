import { z } from 'zod';

export const createPathologySchema = z.object({
    projectId: z.string().uuid({
        message: 'ID do projeto inválido',
    }),
    locationId: z.string().uuid({
        message: 'ID do local inválido',
    }),
    referenceLocation: z
        .string()
        .min(3, 'A referência deve ter pelo menos 3 caracteres')
        .max(100, 'A referência deve ter no máximo 100 caracteres'),
    title: z
        .string()
        .min(5, 'O título deve ter pelo menos 5 caracteres')
        .max(100, 'O título deve ter no máximo 100 caracteres'),
    description: z
        .string()
        .min(5, 'A descrição deve ter pelo menos 5 caracteres')
        .max(500, 'A descrição deve ter no máximo 500 caracteres'),
    photos: z.array(z.any()).min(1, 'Pelo menos uma foto é necessária'),
});

export type CreatePathologyFormValues = z.infer<typeof createPathologySchema>;
