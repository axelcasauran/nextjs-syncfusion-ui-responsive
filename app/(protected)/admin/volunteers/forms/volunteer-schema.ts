import { z } from 'zod';

export const VolunteerSchema = z.object({
  firstName: z
    .string()
    .nonempty({ message: 'First name is required.' })
    .min(2, { message: 'Last name must be at least 2 characters long.' })
    .max(50, { message: 'Last name must not exceed 50 characters.' }),
  lastName: z
    .string()
    .nonempty({ message: 'Name is required.' })
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name must not exceed 50 characters.' }),
  departmentId: z
    .string().nonempty({ message: 'Department is required.' }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  roleId: z.string().nonempty({
    message: 'Role ID is required.',
  }),
});

export type VolunteerSchemaType = z.infer<typeof VolunteerSchema>;
