import { ProjectStatus } from '@/types/project';
import { z } from 'zod';

const editableFieldsSchema = z.object({
    inspectorName: z
        .string()
        .min(1, 'Nome do vistoriador é obrigatório')
        .max(100, 'Máximo 100 caracteres'),

    inspectionDate: z.string().min(1, 'Data da vistoria é obrigatória'),

    structureType: z
        .string()
        .min(1, 'Tipo da estrutura é obrigatório')
        .max(100, 'Máximo 100 caracteres'),

    floorHeight: z
        .string({ required_error: 'Valor piso a piso é obrigatório' })
        .min(1, 'Valor piso a piso é obrigatório')
        .regex(
            /^\d+(\.\d+)?$/,
            'o valor piso a piso deve ser um número válido',
        ),
});

export type UpdateProjectFormValues = z.infer<typeof editableFieldsSchema> & {
    id: string;
    engineer: {
        id: string;
        name: string;
    };
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
