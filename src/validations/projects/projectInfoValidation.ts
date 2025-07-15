import { z } from 'zod';
import { pavementSchema } from '../pavements/pavementValidation';

export const projectInfoSchema = z.object({
    structureType: z
        .string({ required_error: 'Tipo da estrutura é obrigatório' })
        .min(1, 'Tipo da estrutura é obrigatório'),

    pavements: z
        .array(pavementSchema)
        .min(1, 'Pelo menos um pavimento deve ser informado'),

    floorHeight: z.string({
        required_error: 'Valor piso a piso é obrigatório',
    }),
});

export type ProjectInfoFormData = z.infer<typeof projectInfoSchema>;
