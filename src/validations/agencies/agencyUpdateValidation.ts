import { z } from 'zod';
import { createAgencySchema } from './agencyCreateValidation';

export const updateAgencySchema = createAgencySchema
    .extend({
        id: z.string().uuid('ID inválido'),
    })
    .partial();

export type UpdateAgencyFormValues = z.infer<typeof updateAgencySchema>;
