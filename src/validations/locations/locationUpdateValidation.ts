import z from 'zod';

export const updateLocationSchema = z
    .object({
        id: z.string().optional(),
        projectId: z.string(),

        name: z.string().min(1, 'O nome do local é obrigatório'),

        locationType: z.enum(['interno', 'externo']),

        pavementId: z.string().optional(),

        height: z.string().optional(),

        floorFinishing: z
            .array(z.string())
            .min(
                1,
                'Selecione ou escreva pelo menos um acabamento para o piso',
            ),

        wallFinishing: z
            .array(z.string())
            .min(
                1,
                'Selecione ou escreva pelo menos um acabamento para a parede',
            ),

        ceilingFinishing: z.array(z.string()).optional(),
        facadeObservation: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        const isExternal = data.locationType === 'externo';

        if (!isExternal && !data.pavementId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'O pavimento/andar é obrigatório',
                path: ['pavementId'],
            });
        }

        if (
            !isExternal &&
            (!data.ceilingFinishing || data.ceilingFinishing.length === 0)
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    'Selecione ou escreva pelo menos um acabamento para o forro',
                path: ['ceilingFinishing'],
            });
        }

        if (!isExternal) {
            if (!data.height || data.height.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'A altura é obrigatória',
                    path: ['height'],
                });
            } else {
                const heightNum = parseFloat(data.height);
                if (isNaN(heightNum) || heightNum <= 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'A altura deve ser um número maior que zero',
                        path: ['height'],
                    });
                }
            }
        }

        if (isExternal && data.height && data.height.trim() !== '') {
            const heightNum = parseFloat(data.height);
            if (isNaN(heightNum) || heightNum <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'Se informada, a altura deve ser um número maior que zero',
                    path: ['height'],
                });
            }
        }
    });

export type UpdateLocationFormSchema = z.infer<typeof updateLocationSchema>;
