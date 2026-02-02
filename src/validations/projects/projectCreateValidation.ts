import { projectTypes } from '../../constants';
import { z } from 'zod';

export const createProjectSchema = z.object({
    projectType: z
        .string({
            required_error: 'O tipo do projeto é obrigatório',
            invalid_type_error: 'Deve ser uma string',
        })
        .min(1, 'Tipo do projeto é obrigatório')
        .refine((val) => projectTypes.some((type) => type.value === val), {
            message: 'Tipo de projeto inválido',
        }),

    engineer: z.object(
        {
            id: z
                .string()
                .min(1, 'Engenheiro responsável é obrigatório')
                .uuid('ID inválido'),
        },
        {
            required_error: 'O engenheiro responsável é obrigatório',
            invalid_type_error: 'Deve ser uma string',
        },
    ),

    pavements: z
        .array(z.string(), {
            required_error: 'Os pavimentos são obrigatórios',
            invalid_type_error: 'Deve ser uma array de strings',
        })
        .min(1, 'Selecione pelo menos um pavimento'),

    upeCode: z
        .string()
        .min(1, 'UPE do projeto é obrigatório')
        .regex(/^\d+$/, 'Deve conter apenas números'),

    agencyId: z
        .string({
            required_error: 'A agência é obrigatória',
            invalid_type_error: 'Deve ser uma string',
        })
        .min(1, 'Agência é obrigatória')
        .uuid('ID inválido'),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
