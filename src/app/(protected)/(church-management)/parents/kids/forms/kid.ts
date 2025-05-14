import { z } from 'zod';

export const KidSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name must not exceed 50 characters.' }),
  middleName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name must not exceed 50 characters.' }),  
  lastName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name must not exceed 50 characters.' }),  
  gender: z
    .string()
    .min(2, { message: 'Gender is required.' }),
  birthDate: z
    .string()
    .min(2, { message: 'Birthdate is required.' })
});

export type KidSchemaType = z.infer<typeof KidSchema>;
