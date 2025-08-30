import { z } from 'zod';
import { createEngineerSchema } from './engineerCreateValidation';

export const updateEngineerSchema = createEngineerSchema
    .extend({
        id: z.string().uuid('ID inválido'),
    })
    .partial();

export type UpdateEngineerFormValues = z.infer<typeof updateEngineerSchema>;
