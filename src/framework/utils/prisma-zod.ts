/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { PRISMA_SCHEMA_METADATA, PrismaModelMetadata } from '../../generated/prisma-schema-metadata';

type PrismaModel = keyof typeof Prisma.ModelName;

type FieldValidation = {
  type: z.ZodTypeAny;
  errorMessage?: string;
};

/**
 * Creates a Zod schema from a Prisma model's metadata
 * @param modelName The name of the Prisma model
 * @param customConfig Optional custom configurations for specific fields
 */
export function createZodSchemaFromPrisma<T extends PrismaModel>(
  modelName: T,
  customConfig: Partial<Record<string, FieldValidation>> = {}
) {
  // Get model metadata from generated file
  const modelMetadata = PRISMA_SCHEMA_METADATA[modelName];
  
  if (!modelMetadata) {
    throw new Error(`Model ${modelName} not found in Prisma schema metadata.
    Run 'npm run generate-schema-metadata' to update schema metadata.`);
  }

  const schema: Record<string, z.ZodTypeAny> = {};

  modelMetadata.fields.forEach((field) => {
    // Skip if field is an id or relation field
    if (field.isId || field.relationName) {
      schema[field.name] = z.string().optional();
      return;
    }

    // Use custom config if provided
    if (customConfig[field.name]) {
      const customType = customConfig[field.name]?.type;
      if (customType) {
        schema[field.name] = customType;
        return;
      }
    }

    let zodType: z.ZodTypeAny;

    // Map Prisma types to Zod types
    switch (field.type) {
      case 'String':
        zodType = z.string();
        break;
      case 'Int':
        zodType = z.number().int();
        break;
      case 'Float':
        zodType = z.number();
        break;
      case 'Boolean':
        zodType = z.boolean();
        break;
      case 'DateTime':
        zodType = z.date();
        break;
      case 'Json':
        zodType = z.any();
        break;
      default:
        zodType = z.any();
    }

    // Handle required/optional based on Prisma schema
    if (!field.isRequired) {
      zodType = zodType.optional();
    } else {
      const errorMessage = customConfig[field.name]?.errorMessage || 
        `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} is required`;
      
      switch (field.type) {
        case 'String':
          zodType = zodType.refine((val) => val.length > 0, errorMessage);
          break;
        case 'Int':
        case 'Float':
          zodType = zodType.refine((val) => val !== undefined, errorMessage);
          break;
        case 'Boolean':
          zodType = zodType.refine((val) => val !== undefined, errorMessage);
          break;
        case 'DateTime':
          zodType = zodType.refine((val) => val !== undefined, errorMessage);
          break;
      }
    }

    // Handle nullable fields
    if (!field.isRequired) {
      zodType = zodType.nullable();
    }

    schema[field.name] = zodType;
  });

  return z.object(schema);
}

/**
 * Type-safe way to extend a Prisma-generated Zod schema
 * @param baseSchema The base schema generated from Prisma
 * @param extension The extension configuration
 */
export function extendZodSchema<T extends z.ZodObject<any, any>>(
  baseSchema: T,
  extension: { [K in keyof z.infer<T>]?: z.ZodTypeAny }
) {
  const nonUndefinedExtension = Object.fromEntries(
    Object.entries(extension).filter(([_, value]) => value !== undefined)
  ) as z.ZodRawShape;
  return baseSchema.extend(nonUndefinedExtension);
}