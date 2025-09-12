import { z } from 'zod';
import { createProjectSchema } from './projectCreateValidation';
import { pavementSchema } from '../pavements/pavementValidation';

const baseUpdateSchema = createProjectSchema
    .extend({
        id: z.string().uuid('ID inválido').optional(),
        name: z.string().optional(),
        agency: z
            .object({
                id: z.string().uuid(),
                name: z.string(),
                agencyNumber: z.union([z.string(), z.number()]),
                state: z.string(),
                city: z.string(),
                district: z.string(),
            })
            .optional(),
        projectType: z.string().optional(),
        projectDate: z.string().optional(),
        status: z.string().optional(),
        inspectorName: z.string().max(100, 'Máximo 100 caracteres').optional(),
        inspectionDate: z.string().optional(),
        technicalResponsibilityNumber: z.string().optional(),
        structureType: z.string().max(500, 'Máximo 500 caracteres').optional(),
        floorHeight: z.string().optional(),
        pavements: z.array(pavementSchema).optional(),
    })
    .partial();

export const updateProjectSchema = baseUpdateSchema.refine(
    (data) => data.pavements === undefined || data.pavements.length > 0,
    {
        message: 'Selecione pelo menos um pavimento',
        path: ['pavements'],
    },
);

export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;
