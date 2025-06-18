import { z } from 'zod';

export const inspectorSchema = z.object({
    nameInspector: z
        .string({
            required_error: 'o nome do vistoriador é obrigatório',
        })
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(60, 'Nome muito longo'),
});

export type InspectorFormData = z.infer<typeof inspectorSchema>;
