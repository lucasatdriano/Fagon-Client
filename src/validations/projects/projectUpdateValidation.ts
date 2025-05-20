import { projectType } from '@/constants';
import { z } from 'zod';

export const updateProjectSchema = z.object({
    id: z.string().uuid('ID inválido'),

    projectType: z
        .string()
        .min(1, 'Tipo do projeto é obrigatório')
        .refine((val) => projectType.some((type) => type.value === val), {
            message: 'Tipo de projeto inválido',
        }),

    upeCode: z
        .string()
        .min(1, 'UPE é obrigatório')
        .regex(/^\d+$/, 'Deve conter apenas números')
        .transform(Number),

    agencyId: z.string().uuid('ID da agência inválido'),

    engineerId: z.string().uuid('ID do engenheiro inválido'),

    structureType: z.string().min(1, 'Tipo da estrutura é obrigatório'),

    inspectorName: z
        .string()
        .min(1, 'Nome do vistoriador é obrigatório')
        .max(100, 'Máximo 100 caracteres'),

    inspectionDate: z
        .string()
        .min(1, 'Data de vistoria é obrigatória')
        .pipe(z.coerce.date()),
});

export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;
