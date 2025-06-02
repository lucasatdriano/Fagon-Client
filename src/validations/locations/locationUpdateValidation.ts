import z from 'zod';
import { materialFinishingSchema } from '../materialFinishings/materialFinishingCreateValidation';
import { photoSchema } from '../photos/photoCreateValidation';

export const updateLocationSchema = z
    .object({
        id: z.string().optional(),
        projectId: z.string(),
        pavementId: z.string().optional(),
        name: z.string().min(1, 'O nome é obrigatório'),
        locationType: z.enum(['externo', 'interno']),
        height: z.number().min(0.1, 'A altura deve ser maior que zero'),
        photos: z.array(photoSchema).optional(),
        materialFinishings: z.array(materialFinishingSchema).optional(),
    })
    .superRefine((data, ctx) => {
        const isFacade = data.name.toLowerCase().includes('fachada');
        const isExternal = data.locationType === 'externo';

        if (!isExternal && !data.pavementId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Pavimento é obrigatório para locais internos',
                path: ['pavementId'],
            });
        }

        if (!isFacade && !isExternal) {
            const hasCeilingFinishing = data.materialFinishings?.some(
                (f) => f.surface === 'forro',
            );
            if (!hasCeilingFinishing) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'Acabamento de forro é obrigatório para locais internos que não são fachadas',
                    path: ['materialFinishings'],
                });
            }
        }

        // Validações comuns
        const hasFloorFinishing = data.materialFinishings?.some(
            (f) => f.surface === 'piso',
        );
        if (!hasFloorFinishing && !isExternal) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Acabamento de piso é obrigatório',
                path: ['materialFinishings'],
            });
        }

        const hasWallFinishing = data.materialFinishings?.some(
            (f) => f.surface === 'parede',
        );
        if (!hasWallFinishing) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Acabamento de parede é obrigatório',
                path: ['materialFinishings'],
            });
        }
    });
