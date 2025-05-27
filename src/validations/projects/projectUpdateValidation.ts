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

    totalArea: z
        .string()
        .min(1, 'Área total é obrigatória')
        .regex(/^[\d,]+$/, 'Deve conter apenas números e vírgula'),

    maxHeight: z
        .string()
        .min(1, 'Altura é obrigatória')
        .regex(/^[\d,]+$/, 'Deve conter apenas números e vírgula'),
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
