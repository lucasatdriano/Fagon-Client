import { z } from 'zod';

export const pavementSchema = z.object({
    id: z.string(),
    pavement: z.string(),
    height: z.number(),
    area: z
        .string()
        .optional()
        .refine((val) => {
            if (val === undefined || val === '') return true;
            return !isNaN(parseFloat(val)) && parseFloat(val) > 0;
        }, 'A área deve ser um número maior que zero'),
});
