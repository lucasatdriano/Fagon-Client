import { z } from 'zod';
import { createInspectorSchema } from './inspectorCreateValidation';

export const updateInspectorSchema = createInspectorSchema
    .extend({
        id: z.string().uuid('ID inválido'),
    })
    .partial();

export type UpdateInspectorFormValues = z.infer<typeof updateInspectorSchema>;
