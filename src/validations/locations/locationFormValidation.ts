import { z } from 'zod';

export const locationFormSchema = z
    .object({
        name: z.string().min(1, 'O nome do local é obrigatório'),

        locationType: z.enum(['interno', 'externo']),

        pavementId: z.string().optional(),

        height: z
            .string()
            .min(1, 'A altura é obrigatória')
            .refine(
                (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
                'A altura deve ser um número maior que zero',
            ),

        floorFinishing: z
            .array(z.string())
            .min(1, 'Selecione ou escreva pelo menos um acabamento do piso'),

        wallFinishing: z
            .array(z.string())
            .min(1, 'Selecione ou escreva pelo menos um acabamento da parede'),

        ceilingFinishing: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
        const isFacade = data.name.toLowerCase().includes('fachada');
        const isExternal = data.locationType === 'externo';

        if (!isExternal && !data.pavementId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'O pavimento/andar é obrigatório',
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
                message:
                    'Selecione ou escreva pelo menos um acabamento do forro',
                path: ['ceilingFinishing'],
            });
        }
    });

export type LocationFormSchema = z.infer<typeof locationFormSchema>;
