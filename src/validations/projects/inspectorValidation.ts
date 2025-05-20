import { z } from 'zod';

export const inspectorSchema = z.object({
    nameInspector: z
        .string({
            required_error: 'o nome do vistoriador é obrigatório',
        })
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(60, 'Nome muito longo'),
    inspectionDate: z
        .string()
        .min(1, 'Data de vistoria é obrigatória')
        .pipe(z.coerce.date()),
});

export type InspectorFormData = z.infer<typeof inspectorSchema>;
