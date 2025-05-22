import { z } from "zod";
import { createFormSchema } from "@framework/utils/form-schema";

// The schema is 100% automatically generated from the Prisma model
// No need to specify any fields - they are all inferred from the Prisma schema
export const FormSchema = createFormSchema({
  model: "Service",
  // Just override error messages where needed - all other validation is automatic
  customErrorMessages: {
    name: "Service name is required",
    location: "Please specify a location",
    type: "Service type is required"
  }
});

export type FormSchemaData = z.infer<typeof FormSchema>;