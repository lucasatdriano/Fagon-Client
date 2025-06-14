import { projectType } from '@/constants';
import { z } from 'zod';

export const createProjectSchema = z.object({
    projectType: z
        .string()
        .min(1, 'Tipo do projeto é obrigatório')
        .refine((val) => projectType.some((type) => type.value === val), {
            message: 'Tipo de projeto inválido',
        }),

    selectedPerson: z
        .string()
        .min(1, 'Responsável é obrigatório')
        .uuid('ID inválido'),

    pavements: z.array(z.string()).min(1, 'Selecione pelo menos um pavimento'),

    upeCode: z
        .string()
        .min(1, 'UPE do projeto é obrigatório')
        .regex(/^\d+$/, 'Deve conter apenas números'),

    agencyId: z.string().min(1, 'Agência é obrigatória').uuid('ID inválido'),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
