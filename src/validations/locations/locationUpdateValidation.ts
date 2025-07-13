import z from 'zod';

export const updateLocationSchema = z
    .object({
        id: z.string().optional(),
        projectId: z.string(),
        name: z.string().min(1, 'O nome do local é obrigatório'),
        locationType: z.enum(['interno', 'externo']),
        pavementId: z.string().optional(),
        height: z
            .string()
            .optional()
            .refine((val) => {
                if (val === undefined || val === '') return true;
                return !isNaN(parseFloat(val)) && parseFloat(val) > 0;
            }, 'A altura deve ser um número maior que zero'),
        floorFinishing: z
            .array(z.string())
            .min(1, 'Selecione pelo menos um acabamento do piso'),
        wallFinishing: z
            .array(z.string())
            .min(1, 'Selecione pelo menos um acabamento da parede'),
        ceilingFinishing: z.array(z.string()).optional(),
        facadeObservation: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        const isFacade = data.name.toLowerCase().includes('fachada');
        const isExternal = data.locationType === 'externo';

        if (!isExternal && !data.pavementId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'O pavimento/andar é obrigatório para locais internos',
                path: ['pavementId'],
            });
        }

        if (
            !isFacade &&
            !isExternal &&
            (!data.ceilingFinishing || data.ceilingFinishing.length === 0)
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Selecione pelo menos um acabamento do forro',
                path: ['ceilingFinishing'],
            });
        }

        if (!isFacade && (!data.height || data.height.trim() === '')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A altura é obrigatória',
                path: ['height'],
            });
        }
    });

export type UpdateLocationFormSchema = z.infer<typeof updateLocationSchema>;
