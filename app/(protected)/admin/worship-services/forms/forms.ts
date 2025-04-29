import { z } from 'zod';

export const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name must not exceed 50 characters.' }),
  slug: z
    .string()
    .min(2, { message: 'Slug must be at least 2 characters long.' })
    .max(12, { message: 'Slug must not exceed 12 characters.' }),  
  description: z
    .string()
    .min(2, { message: 'Description must be at least 2 characters long.' })
    .max(50, { message: 'Description must not exceed 50 characters.' })
});

export type FormSchemaType = z.infer<typeof FormSchema>;
