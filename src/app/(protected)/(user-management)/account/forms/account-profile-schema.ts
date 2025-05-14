import { z } from 'zod';

export const AccountProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters'),
  gender: z
    .string()
    .min(1, 'Gender is required'),
  avatarFile: z
    .instanceof(File)
    .nullable()
    .optional()
    .refine(
      (file) => !file || file.size <= 1024 * 1024, // Ensure file is not present or <= 1MB
      { message: 'Avatar file must be smaller than 1MB' },
    )
    .refine(
      (file) =>
        !file || ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
      { message: 'Only JPG, PNG, or GIF formats are allowed' },
    ),
  avatarAction: z.string().optional(),
});

export type AccountProfileSchemaType = z.infer<typeof AccountProfileSchema>;
