import { z } from 'zod';

export const materialFinishingSchema = z.object({
    id: z.string().optional(),
    locationId: z.string(),
    surface: z.enum(['piso', 'parede', 'forro']),
    materialFinishing: z.string().min(1, 'O acabamento é obrigatório'),
});

export type MaterialFinishingSchema = z.infer<typeof materialFinishingSchema>;
