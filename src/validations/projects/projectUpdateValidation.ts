import { ProjectStatus } from '@/types/project';
import { z } from 'zod';

const editableFieldsSchema = z.object({
    inspectorName: z
        .string()
        .max(100, 'Máximo 100 caracteres')
        .optional()
        .nullable(),

    inspectionDate: z.string().optional().nullable(),

    structureType: z
        .string()
        .max(100, 'Máximo 100 caracteres')
        .optional()
        .nullable(),

    engineer: z
        .object({
            id: z.string().min(1, 'Selecione um engenheiro responsável'),
        })
        .optional(),

    pavements: z.array(z.string()).optional(),

    // floorHeight: z
    //     .string()
    //     .regex(/^\d+(\.\d+)?$/, 'Deve ser um número válido')
    //     .optional()
    //     .nullable(),
});

export type UpdateProjectFormValues = z.infer<typeof editableFieldsSchema> & {
    id: string;
    name: string;
    upeCode: string;
    agency: {
        id: string;
        name: string;
        agencyNumber: string;
        state: string;
        city: string;
        district: string;
    };
    projectType: string;
    projectDate: string;
    status: ProjectStatus;
};

export const updateProjectSchema = editableFieldsSchema;
