import { z } from 'zod';

const pavementSchema = z.object({
    id: z.string(),
    pavement: z.string(),
    height: z.string().refine((val) => /^\d*\.?\d+$/.test(val), {
        message: 'A altura deve ser um número válido',
    }),
    area: z
        .string()
        .min(1, 'Área é obrigatória')
        .refine((val) => /^\d*\.?\d+$/.test(val), {
            message: 'A área deve ser um número válido',
        }),
});

export const projectInfoSchema = z.object({
    structureType: z
        .string({ required_error: 'Tipo da estrutura é obrigatório' })
        .min(1, 'Tipo da estrutura é obrigatório'),

    pavements: z
        .array(pavementSchema)
        .min(1, 'Pelo menos um pavimento deve ser informado'),

    floorHeight: z
        .string({ required_error: 'Valor piso a piso é obrigatório' })
        .min(1, 'Valor piso a piso é obrigatório')
        .regex(
            /^\d+(\.\d+)?$/,
            'o valor piso a piso deve ser um número válido',
        ),
});

export type ProjectInfoFormData = z.infer<typeof projectInfoSchema>;
