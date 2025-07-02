import { z } from 'zod';

export const pathologyPhotoSchema = z.object({
    id: z.string().optional(),
    pathologyId: z.string(),
    filePath: z.string(),
});

export type PathologyPhotoSchema = z.infer<typeof pathologyPhotoSchema>;
