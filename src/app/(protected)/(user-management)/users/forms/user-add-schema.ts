import { z } from 'zod';

export const UserAddSchema = z.object({
  firstName: z
    .string()
    .nonempty({ message: 'First Name is required.' })
    .min(2, { message: 'First Name must be at least 2 characters long.' })
    .max(50, { message: 'First Name must not exceed 50 characters.' }),
  lastName: z
    .string()
    .nonempty({ message: 'Last Name is required.' })
    .min(2, { message: 'Last Name must be at least 2 characters long.' })
    .max(50, { message: 'Last Name must not exceed 50 characters.' }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  roleId: z.string().nonempty({
    message: 'Role ID is required.',
  }),
});

export type UserAddSchemaType = z.infer<typeof UserAddSchema>;
