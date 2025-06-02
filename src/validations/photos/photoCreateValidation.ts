import { z } from 'zod';

export const photoSchema = z.object({
    id: z.string().optional(),
    locationId: z.string(),
    filePath: z.string(),
    selectedForPdf: z.boolean().default(false),
    url: z.string().optional(),
});

export type PhotoSchema = z.infer<typeof photoSchema>;
