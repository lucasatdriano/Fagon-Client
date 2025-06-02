import { z } from 'zod';

export const createPathologySchema = z.object({
    pathologyType: z.enum(['externo', 'interno'], {
        required_error: 'Selecione um tipo de local',
        invalid_type_error: 'Tipo de local inválido',
    }),
    name: z.string().nonempty('Selecione um local'),
});

export type CreatePathologyFormValues = z.infer<typeof createPathologySchema>;
