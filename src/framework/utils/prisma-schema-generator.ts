import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * This utility generates a TypeScript file with Prisma schema metadata
 * that can be used for form generation without direct DMMF access.
 */

interface PrismaFieldMetadata {
  name: string;
  type: string;
  isRequired: boolean;
  isId: boolean;
  isUnique: boolean;
  isReadOnly: boolean;
  hasDefaultValue: boolean;
  relationName?: string;
  relationFromFields?: string[];
  relationToFields?: string[];
  isGenerated: boolean;
  isUpdatedAt: boolean;
}

interface PrismaModelMetadata {
  name: string;
  fields: PrismaFieldMetadata[];
}

function generateSchemaMetadata() {
  // Get the Prisma schema path from the environment or use default
  const schemaPath = path.resolve(process.cwd(), 'prisma/schema.prisma');
  
  if (!fs.existsSync(schemaPath)) {
    console.error(`Prisma schema not found at ${schemaPath}`);
    process.exit(1);
  }
  
  // Use Prisma CLI to dump the DMMF
  try {
    // Create a temporary directory if it doesn't exist
    const tempDir = path.resolve(process.cwd(), '.prisma-schema-temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    // Execute Prisma CLI to generate DMMF JSON
    execSync(`npx prisma generate --schema=${schemaPath}`, { stdio: 'inherit' });
    
    // Write a script to output the DMMF
    const dmmfScript = `
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Access internal DMMF
    const dmmf = (prisma as any)._baseDmmf || (prisma as any)._dmmf;
    
    if (!dmmf) {
      console.error('Could not access Prisma DMMF');
      process.exit(1);
    }
    
    // Extract model metadata
    const models = dmmf.datamodel.models.map(model => ({
      name: model.name,
      fields: model.fields.map(field => ({
        name: field.name,
        type: field.type,
        isRequired: !field.isNullable,
        isId: field.isId,
        isUnique: field.isUnique,
        hasDefaultValue: field.hasDefaultValue,
        relationName: field.relationName,
        relationFromFields: field.relationFromFields,
        relationToFields: field.relationToFields,
        isGenerated: !!field.isGenerated,
        isUpdatedAt: !!field.isUpdatedAt,
      }))
    }));
    
    // Write to stdout
    console.log(JSON.stringify(models, null, 2));
    `;
    
    // Save script to temporary file
    const scriptPath = path.join(tempDir, 'extract-dmmf.js');
    fs.writeFileSync(scriptPath, dmmfScript);
    
    // Execute the script and capture output
    const output = execSync(`node ${scriptPath}`, { encoding: 'utf-8' });
    
    // Parse the output
    const models = JSON.parse(output) as PrismaModelMetadata[];
    
    // Generate TypeScript code
    const tsCode = `
// This file is auto-generated from the Prisma schema
// Do not edit directly

export interface PrismaFieldMetadata {
  name: string;
  type: string;
  isRequired: boolean;
  isId: boolean;
  isUnique: boolean;
  hasDefaultValue: boolean;
  relationName?: string;
  relationFromFields?: string[];
  relationToFields?: string[];
  isGenerated: boolean;
  isUpdatedAt: boolean;
}

export interface PrismaModelMetadata {
  name: string;
  fields: PrismaFieldMetadata[];
}

export const PRISMA_SCHEMA_METADATA: Record<string, PrismaModelMetadata> = ${JSON.stringify(
      models.reduce((acc, model) => {
        acc[model.name] = model;
        return acc;
      }, {} as Record<string, PrismaModelMetadata>),
      null,
      2
    )};
`;
    
    // Write the output to a TypeScript file
    const outputPath = path.resolve(process.cwd(), 'src/generated/prisma-schema-metadata.ts');
    
    // Create the directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, tsCode);
    console.log(`Prisma schema metadata written to ${outputPath}`);
    
    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });
    
  } catch (error) {
    console.error('Failed to generate schema metadata:', error);
    process.exit(1);
  }
}

// Run the generator
generateSchemaMetadata(); 