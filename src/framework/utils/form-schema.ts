import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { createZodSchemaFromPrisma } from './prisma-zod';

type PrismaModel = keyof typeof Prisma.ModelName;

interface FormSchemaOptions<T extends PrismaModel> {
  model: T;
  customErrorMessages?: Record<string, string>;
  customValidations?: Record<string, {
    type: z.ZodTypeAny;
    errorMessage?: string;
  }>;
}

/**
 * Creates a form schema from a Prisma model with common validations
 * @param options Configuration options for the form schema
 */
export function createFormSchema<T extends PrismaModel>({
  model,
  customErrorMessages = {},
  customValidations = {}
}: FormSchemaOptions<T>) {
  // Convert custom validations to the format expected by createZodSchemaFromPrisma
  const fieldValidations = Object.entries(customValidations).reduce((acc, [field, validation]) => {
    acc[field] = {
      type: validation.type,
      errorMessage: validation.errorMessage || customErrorMessages[field]
    };
    return acc;
  }, {} as Record<string, { type: z.ZodTypeAny; errorMessage?: string }>);

  // Generate schema directly from Prisma model with custom validations
  return createZodSchemaFromPrisma(model, fieldValidations);
}

/**
 * Example usage:
 * 
 * const serviceFormSchema = createFormSchema({
 *   model: "Service",
 *   customErrorMessages: {
 *     name: "Service name is required",
 *     location: "Please specify a location"
 *   },
 *   customValidations: {
 *     email: {
 *       type: z.string().email(),
 *       errorMessage: "Invalid email format"
 *     }
 *   }
 * });
 */ 