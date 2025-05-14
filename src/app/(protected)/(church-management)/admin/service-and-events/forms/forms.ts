import { z } from "zod";

export const FormSchema = z.object({
  id: z.string().optional(), // Add the 'id' field
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string({ invalid_type_error: "Please select a type"}).min(1, "Type is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().nullable().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(false)
});

export type FormSchemaData = z.infer<typeof FormSchema>;