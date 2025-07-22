import { z } from 'zod';

export const createLocationSchema = z.object({
    name: z
        .string({
            required_error: 'Selecione um nome para o local',
            invalid_type_error: 'Nome do local inválido',
        })
        .min(1, 'O nome do local é obrigatório'),

    locationType: z.enum(['externo', 'interno'], {
        required_error: 'Selecione um tipo de local',
        invalid_type_error: 'Tipo de local inválido',
    }),
});

export type CreateLocationFormValues = z.infer<typeof createLocationSchema>;
