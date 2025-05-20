import { z } from 'zod';

export const accessKeySchema = z.object({
    accessKey: z.string({ required_error: 'Chave de acesso é obrigatório' }),
});

export type AccessKeyFormData = z.infer<typeof accessKeySchema>;
